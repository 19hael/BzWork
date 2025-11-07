import { useMemo } from "react";
import { Project } from "@/types";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";

export function useProjects() {
  const { projects, tasks, activeProjectId, setActiveProject, addProject } =
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

  const createProject = (project: Project) => addProject(project);

  return {
    projects: hydrated,
    activeProject,
    summary,
    selectProject,
    createProject,
  };
}
