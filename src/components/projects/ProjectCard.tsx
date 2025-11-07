import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/date";

type Props = {
  project: Project & {
    activeTasks?: number;
    overdueTasks?: number;
  };
};

const statusVariant: Record<Project["status"], "success" | "secondary" | "outline"> = {
  active: "success",
  completed: "outline",
  archived: "outline",
};

export function ProjectCard({ project }: Props) {
  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="group flex flex-col rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
      style={{ borderColor: project.color ?? "#e2e8f0" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Project
          </p>
          <h3 className="text-xl font-semibold text-slate-900">{project.name}</h3>
        </div>
        <Badge variant={statusVariant[project.status] ?? "secondary"}>
          {project.status}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-slate-500 line-clamp-2">
        {project.description}
      </p>
      <div className="mt-4 flex items-center gap-6">
        <div>
          <p className="text-xs text-slate-400">Progress</p>
          <p className="text-2xl font-semibold text-slate-900">
            {project.progress ?? 0}%
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Active tasks</p>
          <p className="text-xl font-semibold text-slate-900">
            {project.activeTasks ?? 0}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Due</p>
          <p className="text-sm font-semibold text-slate-900">
            {formatDate(project.end_date, "MMM d")}
          </p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm font-semibold text-slate-900">
        View project
        <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </Link>
  );
}
