import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateJsonResponse, logAIInteraction } from "@/lib/ai/gemini";

type SuggestedAction = {
  label?: string;
  action?: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = (body?.message as string) ?? "";
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: workspace } = await supabase
      .from("workspaces")
      .select("id,name")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const { data: projects = [] } = await supabase
      .from("projects")
      .select("id,name,status,end_date")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: true })
      .limit(6);

    const projectIds = projects.map((project) => project.id);
    let tasks = [] as Array<{ status: string; due_date: string | null }>;
    if (projectIds.length > 0) {
      const { data: fetchedTasks = [] } = await supabase
        .from("tasks")
        .select("status,due_date")
        .in("project_id", projectIds);
      tasks = fetchedTasks;
    }

    const summary = {
      activeProjects: projects.filter((project) => project.status === "active").length,
      totalProjects: projects.length,
      totalTasks: tasks.length,
      overdueTasks: tasks.filter(
        (task) =>
          task.due_date &&
          new Date(task.due_date) < new Date() &&
          task.status !== "done"
      ).length,
    };

    const prompt = `Eres BzWork Copilot. Responde en español latino y devuelve únicamente JSON con la forma {"message":"","suggestedActions":[{"label":"","action":""}]}. Mensaje del usuario: "${message}". Contexto del workspace: ${JSON.stringify({ summary, projects })}`;

    const response = await generateJsonResponse(prompt);
    const payload = {
      message:
        response.message ??
        "Estoy listo para ayudarte a coordinar proyectos, hojas o automatizaciones.",
      suggestedActions: Array.isArray(response.suggestedActions)
        ? (response.suggestedActions as SuggestedAction[]).map(
            (action, index) => ({
              label: action.label ?? `Opción ${index + 1}`,
              action: action.action ?? "navigate_projects",
            })
          )
        : [],
    };

    await logAIInteraction(supabase, {
      userId: user.id,
      interactionType: "chat",
      input: { message },
      output: payload,
    });

    return NextResponse.json(payload);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
