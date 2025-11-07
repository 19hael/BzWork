import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateJsonResponse, logAIInteraction } from "@/lib/ai/gemini";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const description = (body?.description as string) ?? "";
    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
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
      .select("id")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const prompt = `Eres el diseñador de automatizaciones de BzWork. A partir de esta descripción: "${description}" genera una automatización expresada únicamente en JSON con la forma {
      "name": "",
      "trigger": { "type": "", "config": { } },
      "actions": [ { "type": "", "description": "", "config": { } } ],
      "diagramNote": ""
    }
    Usa tipos como send_slack, update_supabase, create_task, append_spreadsheet, call_webhook.`;

    const automation = await generateJsonResponse(prompt);
    const safeActions = Array.isArray(automation.actions)
      ? automation.actions
      : [];
    const safeTrigger = automation.trigger ?? {
      type: "manual",
      config: {},
    };
    const estimatedExecutionTime = `${Math.max(
      safeActions.length * 400,
      400
    )}ms`;

    const { data: inserted, error: insertError } = await supabase
      .from("automations")
      .insert({
        workspace_id: workspace.id,
        name: automation.name ?? "Automation generada",
        description,
        trigger_type: safeTrigger.type ?? "manual",
        trigger_config: safeTrigger.config ?? {},
        actions: safeActions,
        is_active: true,
        created_by: user.id,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    const result = {
      id: inserted?.id ?? crypto.randomUUID(),
      name: automation.name ?? description.slice(0, 48),
      trigger: safeTrigger,
      actions: safeActions,
      estimatedExecutionTime,
      diagram: automation.diagramNote ?? "Trigger → acciones encadenadas",
    };

    await logAIInteraction(supabase, {
      userId: user.id,
      interactionType: "automation_builder",
      input: { description },
      output: result,
    });

    return NextResponse.json({ success: true, automation: result, record: inserted });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
