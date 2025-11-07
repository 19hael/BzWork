"use client";

import { Clock3, Tag } from "lucide-react";
import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { relativeTime } from "@/lib/utils/date";

type TaskCardProps = {
  task: Task;
};

const priorityMap: Record<Task["priority"], { label: string; variant: "success" | "warning" | "danger" | "secondary" }> =
  {
    low: { label: "Low", variant: "secondary" },
    medium: { label: "Medium", variant: "secondary" },
    high: { label: "High", variant: "warning" },
    urgent: { label: "Urgent", variant: "danger" },
  };

export function TaskCard({ task }: TaskCardProps) {
  const priority = priorityMap[task.priority];
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{task.title}</p>
        <Badge variant={priority.variant}>{priority.label}</Badge>
      </div>
      <p className="mt-2 text-sm text-slate-500">{task.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5" />
          {relativeTime(task.due_date)}
        </span>
        {task.tags?.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-slate-600"
          >
            <Tag className="h-3 w-3" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
