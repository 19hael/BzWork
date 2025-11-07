'use client';

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTasks } from "@/lib/hooks/useTasks";
import { relativeTime } from "@/lib/utils/date";

export default function TaskDetailPage() {
  const params = useParams<{ id: string; taskId: string }>();
  const router = useRouter();
  const { tasks, moveTask } = useTasks(params?.id);
  const task = tasks.find((entry) => entry.id === params?.taskId);

  if (!task) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Task not found.
      </div>
    );
  }

  const markDone = () => {
    moveTask(task.id, "done", task.position ?? 0);
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="inline-flex items-center gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to board
      </Button>
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Task
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              {task.title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{task.description}</p>
          </div>
          <Badge variant="warning">{task.priority}</Badge>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Detail label="Status" value={task.status} />
          <Detail label="Due" value={relativeTime(task.due_date)} />
          <Detail label="Assignee" value={task.assigned_to ?? "Unassigned"} />
        </div>
        <Button onClick={markDone} className="mt-6 rounded-2xl">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Mark as done
        </Button>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
        {label}
      </p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
