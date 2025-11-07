import { NextResponse } from "next/server";
import { simulateTaskSuggestions } from "@/lib/ai/simulators";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { mockProjects } from "@/lib/data/mock";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const projectId = body?.projectId ?? mockProjects[0].id;
    let project =
      mockProjects.find((entry) => entry.id === projectId) ?? mockProjects[0];
    let supabase: Awaited<ReturnType<typeof createServerClient>> | null = null;
    try {
      supabase = await createServerClient();
    } catch {
      supabase = null;
    }
    if (supabase) {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
      if (data) {
        project = { ...project, ...data };
      }
    }
    const suggestions = await simulateTaskSuggestions(project);
    return NextResponse.json({
      success: true,
      projectId,
      projectName: project.name,
      suggestions,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
