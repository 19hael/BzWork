import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateJsonResponse, logAIInteraction } from "@/lib/ai/gemini";

type SuggestionItem = {
  title?: string;
  task?: string;
  reason?: string;
  justification?: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: workspace } = await supabase
      .from("workspaces")
      .select("id")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    let projectId: string | undefined = body?.projectId;
    if (!projectId) {
      const { data: fallbackProject } = await supabase
        .from("projects")
        .select("id")
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      projectId = fallbackProject?.id;
    }

    if (!projectId) {
      return NextResponse.json({ error: "No project to analyze" }, { status: 400 });
    }

    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("workspace_id", workspace.id)
      .eq("id", projectId)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { data: projectTasks = [] } = await supabase
      .from("tasks")
      .select("title,status,priority,due_date")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true })
      .limit(25);

    const prompt = `Eres el copiloto de BzWork. Basado en la siguiente información genera cinco sugerencias accionables para avanzar el proyecto. Devuelve solo JSON con la forma {"tasks":[{"title":"","reason":""}]}.

Proyecto: ${project.name}
Descripción: ${project.description ?? "Sin descripción"}
Status: ${project.status}
Tareas existentes: ${JSON.stringify(projectTasks)}
`; 

    let rawSuggestions: { tasks?: SuggestionItem[]; suggestions?: SuggestionItem[] };
    try {
      rawSuggestions = await generateJsonResponse(prompt);
    } catch (error) {
      console.error("Gemini suggestion failure", error);
      rawSuggestions = { tasks: projectTasks.slice(0, 5).map((task) => ({
        title: task.title,
        reason: "Tomado de las tareas existentes",
      })) };
    }

    const normalized = (rawSuggestions?.tasks ?? rawSuggestions?.suggestions ?? [])
      .map((item: SuggestionItem) => ({
        title: item.title ?? item.task ?? "Tarea sin título",
        reason: item.reason ?? item.justification ?? "Prioridad sugerida por IA",
      }))
      .slice(0, 5);

    await logAIInteraction(supabase, {
      userId: user.id,
      interactionType: "task_suggestion",
      input: { projectId, projectName: project.name },
      output: normalized,
    });

    return NextResponse.json({
      success: true,
      projectId,
      projectName: project.name,
      suggestions: normalized,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
