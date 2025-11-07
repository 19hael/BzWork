"use client";

import { useState } from "react";
import { Task } from "@/types";
import { useTasks } from "@/lib/hooks/useTasks";
import { TaskCard } from "@/components/projects/TaskCard";

type BoardProps = {
  projectId?: string;
};

export function ProjectBoard({ projectId }: BoardProps) {
  const { grouped, moveTask } = useTasks(projectId);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDrop = (status: Task["status"]) => {
    if (!draggedTaskId) return;
    const column = grouped.find((col) => col.id === status);
    const newPosition = column ? column.tasks.length + 1 : 1;
    moveTask(draggedTaskId, status, newPosition);
    setDraggedTaskId(null);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {grouped.map((column) => (
        <div
          key={column.id}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => handleDrop(column.id)}
          className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              {column.title}
            </p>
            <span className="text-xs text-slate-400">
              {column.tasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {column.tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={() => setDraggedTaskId(task.id)}
              >
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
