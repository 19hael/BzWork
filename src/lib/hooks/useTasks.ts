import { useMemo } from "react";
import { Task } from "@/types";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";

export function useTasks(projectId?: string) {
  const { tasks, updateTaskStatus, updateTaskPosition, addTask } =
    useWorkspaceStore();

  const filtered = useMemo(() => {
    if (!projectId) return tasks;
    return tasks.filter((task) => task.project_id === projectId);
  }, [tasks, projectId]);

  const grouped = useMemo(() => {
    const columns: Record<Task["status"], Task[]> = {
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    };
    filtered.forEach((task) => {
      columns[task.status].push(task);
    });
    return Object.entries(columns).map(([status, columnTasks]) => ({
      id: status as Task["status"],
      title:
        status === "todo"
          ? "Backlog"
          : status === "in_progress"
          ? "In progress"
          : status === "review"
          ? "Review"
          : "Done",
      tasks: columnTasks.sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    }));
  }, [filtered]);

  const moveTask = (taskId: string, status: Task["status"], position: number) => {
    updateTaskStatus(taskId, status);
    updateTaskPosition(taskId, position);
  };

  return {
    tasks: filtered,
    grouped,
    moveTask,
    addTask,
  };
}
