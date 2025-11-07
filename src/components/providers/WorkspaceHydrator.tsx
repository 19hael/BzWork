"use client";

import { useEffect } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database.types";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";

type TypedClient = SupabaseClient<Database>;

export function WorkspaceHydrator() {
  const hydrate = useWorkspaceStore((state) => state.hydrate);
  const setLoading = useWorkspaceStore((state) => state.setLoading);

  useEffect(() => {
    const supabase = createClient();
    let cancel = false;

    const loadWorkspace = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          hydrate({
            workspaceId: undefined,
            workspaceName: undefined,
            projects: [],
            tasks: [],
            spreadsheets: [],
            automations: [],
          });
          return;
        }

        await ensureProfile(supabase, user.id, user.email ?? undefined, user.user_metadata?.full_name);

        const { data: workspaceData, error: workspaceError } = await supabase
          .from("workspaces")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        let workspace = workspaceData;

        if (workspaceError && workspaceError.code !== "PGRST116") {
          console.error(workspaceError);
        }

        if (!workspace) {
          const { data: createdWorkspace, error: createError } = await supabase
            .from("workspaces")
            .insert({
              id: crypto.randomUUID(),
              owner_id: user.id,
              name: `${user.user_metadata?.full_name ?? "BzWork"} workspace`,
              description: "Workspace inicial generado automáticamente",
            })
            .select()
            .single();
          if (createError || !createdWorkspace) {
            console.error(createError);
            return;
          }
          workspace = createdWorkspace;
          await seedWorkspaceData(supabase, workspace.id, user.id);
        }

        const { data: projects = [], error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("workspace_id", workspace.id)
          .order("created_at", { ascending: true });
        if (projectsError) {
          console.error(projectsError);
        }

        const projectIds = projects.map((project) => project.id);
        let tasks = [] as Database["public"]["Tables"]["tasks"]["Row"][];
        if (projectIds.length > 0) {
          const { data: fetchedTasks = [], error: tasksError } = await supabase
            .from("tasks")
            .select("*")
            .in("project_id", projectIds);
          if (tasksError) {
            console.error(tasksError);
          }
          tasks = fetchedTasks;
        }

        const { data: spreadsheets = [], error: sheetsError } = await supabase
          .from("spreadsheets")
          .select("*")
          .eq("workspace_id", workspace.id)
          .order("created_at", { ascending: true });
        if (sheetsError) {
          console.error(sheetsError);
        }

        const { data: automations = [], error: automationsError } = await supabase
          .from("automations")
          .select("*")
          .eq("workspace_id", workspace.id)
          .order("created_at", { ascending: true });
        if (automationsError) {
          console.error(automationsError);
        }

        if (!cancel) {
          hydrate({
            workspaceId: workspace.id,
            workspaceName: workspace.name,
            projects,
            tasks,
            spreadsheets,
            automations,
          });
        }
      } catch (error) {
        console.error("Failed to hydrate workspace", error);
      } finally {
        if (!cancel) {
          setLoading(false);
        }
      }
    };

    loadWorkspace();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadWorkspace();
    });

    return () => {
      cancel = true;
      listener?.subscription.unsubscribe();
    };
  }, [hydrate, setLoading]);

  return null;
}

async function ensureProfile(
  supabase: TypedClient,
  userId: string,
  email?: string,
  fullName?: string
) {
  try {
    await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          email: email ?? "user@bzwork.demo",
          full_name: fullName ?? email ?? "Usuario BzWork",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
  } catch (error) {
    console.error("Profile sync failed", error);
  }
}

async function seedWorkspaceData(
  supabase: TypedClient,
  workspaceId: string,
  userId: string
) {
  try {
    const projectOpsId = crypto.randomUUID();
    const projectAIId = crypto.randomUUID();

    await supabase.from("projects").insert([
      {
        id: projectOpsId,
        workspace_id: workspaceId,
        name: "Operaciones Inteligentes",
        description: "Visibilidad en tiempo real para fulfillment",
        status: "active",
        color: "#06b6d4",
        start_date: new Date().toISOString(),
        end_date: null,
        budget: "180000",
        created_by: userId,
      },
      {
        id: projectAIId,
        workspace_id: workspaceId,
        name: "Automatización IA",
        description: "Canvas n8n simplificado con Gemini",
        status: "active",
        color: "#f43f5e",
        start_date: new Date().toISOString(),
        end_date: null,
        budget: "220000",
        created_by: userId,
      },
    ]);

    await supabase.from("tasks").insert([
      {
        id: crypto.randomUUID(),
        project_id: projectOpsId,
        title: "Sincronizar almacenes",
        description: "Actualizar conectores críticos",
        status: "in_progress",
        priority: "high",
        assigned_to: userId,
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_hours: "14",
        actual_hours: "4",
        tags: ["integrations"],
        position: 1,
        created_by: userId,
      },
      {
        id: crypto.randomUUID(),
        project_id: projectOpsId,
        title: "Alertas predictivas",
        description: "Diseñar umbrales de riesgo",
        status: "review",
        priority: "medium",
        assigned_to: userId,
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_hours: "10",
        actual_hours: "6",
        tags: ["ops"],
        position: 2,
        created_by: userId,
      },
      {
        id: crypto.randomUUID(),
        project_id: projectAIId,
        title: "Afinar prompts Gemini",
        description: "Medir latencia vs precisión",
        status: "todo",
        priority: "urgent",
        assigned_to: userId,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_hours: "12",
        actual_hours: null,
        tags: ["ai"],
        position: 1,
        created_by: userId,
      },
    ]);

    await supabase.from("spreadsheets").insert([
      {
        id: crypto.randomUUID(),
        workspace_id: workspaceId,
        name: "Pipeline Comercial",
        description: "ARR por cuenta",
        data: [
          ["Account", "Status", "ARR", "Owner"],
          ["FerroTech", "Contract", 54000, "Dana"],
          ["SolarSphere", "Pilot", 32000, "Dev"],
        ],
        columns: [
          { key: "account", width: 180 },
          { key: "status", width: 140 },
          { key: "arr", width: 120 },
          { key: "owner", width: 160 },
        ],
        linked_project_id: projectOpsId,
        created_by: userId,
      },
    ]);

    await supabase.from("automations").insert([
      {
        id: crypto.randomUUID(),
        workspace_id: workspaceId,
        name: "Alertar urgentes en Slack",
        description: "Envía Slack y crea seguimiento",
        trigger_type: "task_update",
        trigger_config: { field: "status", value: "done" },
        actions: [
          {
            type: "send_slack",
            channel: "#ops-alerts",
            message: "{{task.title}} pasó a {{task.status}}",
          },
          {
            type: "create_followup",
            due_in_days: 2,
          },
        ],
        is_active: true,
        execution_count: 0,
        created_by: userId,
      },
    ]);
  } catch (error) {
    console.error("Workspace seed failed", error);
  }
}
