'use client';

import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ProjectBoard } from "@/components/projects/ProjectBoard";
import { AIInsightsWidget } from "@/components/ai/AIInsightsWidget";
import { useProjects } from "@/lib/hooks/useProjects";
import { useTasks } from "@/lib/hooks/useTasks";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { projects } = useProjects();
  const project = projects.find((entry) => entry.id === params?.id);
  const { tasks } = useTasks(project?.id);

  if (!project) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Project not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Project
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              {project.name}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              {project.description}
            </p>
          </div>
          <Badge variant="secondary">{project.status}</Badge>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Progress" value={`${project.progress ?? 0}%`} />
          <Stat label="Budget used" value={`${project.budget_used ?? 0}%`} />
          <Stat label="Planned budget" value={`$${project.budget ?? "0"}`} />
          <Stat label="Tasks" value={tasks.length} />
        </div>
      </div>
      <ProjectBoard projectId={project.id} />
      <AIInsightsWidget project={project} tasks={tasks} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
        {label}
      </p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
