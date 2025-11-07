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
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-white shadow-sm shadow-slate-900/30 transition hover:-translate-y-0.5 hover:bg-white/10">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{task.title}</p>
        <Badge variant={priority.variant}>{priority.label}</Badge>
      </div>
      <p className="mt-2 text-sm text-white/70">{task.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/60">
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5" />
          {relativeTime(task.due_date)}
        </span>
        {task.tags?.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5"
          >
            <Tag className="h-3 w-3" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
