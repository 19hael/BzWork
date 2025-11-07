import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";

export function useProjects() {
  const {
    workspaceId,
    projects,
    tasks,
    activeProjectId,
    setActiveProject,
    upsertProject,
  } =
    useWorkspaceStore();

  const hydrated = useMemo(() => {
    return projects.map((project) => {
      const projectTasks = tasks.filter((task) => task.project_id === project.id);
      const done = projectTasks.filter((task) => task.status === "done").length;
      const progress =
        projectTasks.length === 0
          ? project.progress ?? 0
          : Math.round((done / projectTasks.length) * 100);
      const active = projectTasks.filter((task) =>
        ["in_progress", "review"].includes(task.status)
      ).length;
      const overdue = projectTasks.filter(
        (task) =>
          task.due_date &&
          new Date(task.due_date) < new Date() &&
          task.status !== "done"
      ).length;
      return {
        ...project,
        progress,
        activeTasks: active,
        overdueTasks: overdue,
      };
    });
  }, [projects, tasks]);

  const activeProject =
    hydrated.find((project) => project.id === activeProjectId) ?? hydrated[0];

  const summary = useMemo(() => {
    const totalTasks = tasks.length;
    const done = tasks.filter((task) => task.status === "done").length;
    const overdue = tasks.filter(
      (task) =>
        task.due_date &&
        new Date(task.due_date) < new Date() &&
        task.status !== "done"
    ).length;
    const highPriority = tasks.filter((task) => task.priority === "urgent").length;
    return {
      completion: totalTasks === 0 ? 0 : Math.round((done / totalTasks) * 100),
      overdue,
      highPriority,
      activeProjects: hydrated.filter(
        (project) => project.status === "active"
      ).length,
    };
  }, [tasks, hydrated]);

  const selectProject = (id: string) => setActiveProject(id);

  const createProject = async (
    input: Pick<Project, "name" | "description" | "end_date">
  ) => {
    if (!workspaceId) {
      throw new Error("Workspace not ready yet");
    }
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const payload: Project = {
      id: crypto.randomUUID(),
      workspace_id: workspaceId,
      name: input.name,
      description: input.description,
      status: "active",
      color: "#06b6d4",
      start_date: new Date().toISOString(),
      end_date: input.end_date,
      budget: null,
      created_by: user?.id ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select()
      .single();
    if (error) {
      throw error;
    }
    upsertProject(data);
    return data;
  };

  return {
    projects: hydrated,
    activeProject,
    summary,
    selectProject,
    createProject,
    workspaceId,
  };
}
