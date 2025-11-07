"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  Blocks,
  CircleDot,
  LayoutDashboard,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useProjects } from "@/lib/hooks/useProjects";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: Blocks },
  { href: "/dashboard/spreadsheets", label: "Spreadsheets", icon: BarChart2 },
  { href: "/dashboard/automations", label: "Automations", icon: Workflow },
];

export function Sidebar() {
  const pathname = usePathname();
  const { summary } = useProjects();
  const workspaceName = useWorkspaceStore(
    (state) => state.workspaceName ?? "BzWork Demo"
  );

  return (
    <aside className="hidden w-72 flex-col border-r border-white/10 bg-white/5 p-6 text-white/80 backdrop-blur lg:flex">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/40 text-lg font-semibold text-white">
            Bz
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
              Workspace
            </p>
            <p className="text-lg font-semibold text-white">
              {workspaceName}
            </p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 px-4 py-3 text-white">
          <p className="text-sm text-white/60">Health score</p>
          <p className="mt-1 text-3xl font-semibold">{summary.completion}%</p>
          <p className="text-xs text-white/50">Avg project completion</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-white/15 text-white shadow-sm"
                : "text-white/60 hover:bg-white/5"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-4 rounded-2xl border border-dashed border-white/20 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
          <CircleDot className="h-4 w-4 text-cyan-300" />
          <div>
            <p className="text-sm font-semibold text-white">
              {summary.overdue} overdue
            </p>
            <p className="text-xs text-white/60">Needs attention today</p>
          </div>
        </div>
        <p className="text-sm text-white/70">
          Keep leadership informed con dashboards oscuros que mezclan proyectos, hojas inmensas y flujos n8n simplificados.
        </p>
        <Link
          href="/dashboard/automations"
          className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-500/80 py-2 text-sm font-semibold text-slate-900"
        >
          Launch automation
        </Link>
      </div>
    </aside>
  );
}
