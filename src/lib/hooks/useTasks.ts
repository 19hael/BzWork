import { useMemo } from "react";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
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

  const moveTask = async (
    taskId: string,
    status: Task["status"],
    position: number
  ) => {
    const supabase = createClient();
    const currentTask = tasks.find((task) => task.id === taskId);
    updateTaskStatus(taskId, status);
    updateTaskPosition(taskId, position);
    const { error } = await supabase
      .from("tasks")
      .update({ status, position })
      .eq("id", taskId);
    if (error) {
      toast.error("No pudimos mover la tarea, intenta otra vez");
      if (currentTask) {
        updateTaskStatus(taskId, currentTask.status);
        updateTaskPosition(taskId, currentTask.position ?? 0);
      }
    }
  };

  return {
    tasks: filtered,
    grouped,
    moveTask,
    addTask,
  };
}
