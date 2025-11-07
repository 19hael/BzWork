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
      className="group flex flex-col rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-lg shadow-slate-900/40 transition hover:-translate-y-1 hover:bg-white/10"
      style={{ boxShadow: `0 8px 30px -20px ${project.color ?? "#22d3ee"}` }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">
            Project
          </p>
          <h3 className="text-xl font-semibold text-white">{project.name}</h3>
        </div>
        <Badge variant={statusVariant[project.status] ?? "secondary"}>
          {project.status}
        </Badge>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-white/70">
        {project.description}
      </p>
      <div className="mt-4 flex items-center gap-6">
        <div>
          <p className="text-xs text-white/50">Progress</p>
          <p className="text-2xl font-semibold text-white">
            {project.progress ?? 0}%
          </p>
        </div>
        <div>
          <p className="text-xs text-white/50">Active tasks</p>
          <p className="text-xl font-semibold text-white">
            {project.activeTasks ?? 0}
          </p>
        </div>
        <div>
          <p className="text-xs text-white/50">Due</p>
          <p className="text-sm font-semibold text-white">
            {formatDate(project.end_date, "MMM d")}
          </p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm font-semibold text-white">
        View project
        <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </Link>
  );
}
