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

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: Blocks },
  { href: "/dashboard/spreadsheets", label: "Spreadsheets", icon: BarChart2 },
  { href: "/dashboard/automations", label: "Automations", icon: Workflow },
];

export function Sidebar() {
  const pathname = usePathname();
  const { summary } = useProjects();

  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white/90 p-6 lg:flex">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white text-lg font-semibold">
            Bz
          </div>
          <div>
            <p className="text-sm uppercase tracking-widest text-slate-400">
              Workspace
            </p>
            <p className="text-lg font-semibold text-slate-900">
              BzWork Demo
            </p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl bg-slate-900 px-4 py-3 text-white">
          <p className="text-sm text-slate-300">Health score</p>
          <p className="text-3xl font-semibold mt-1">{summary.completion}%</p>
          <p className="text-xs text-slate-400">Avg project completion</p>
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
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-4 rounded-2xl border border-dashed border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-3">
          <CircleDot className="h-4 w-4 text-brand-600" />
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {summary.overdue} overdue
            </p>
            <p className="text-xs text-slate-500">Needs attention today</p>
          </div>
        </div>
        <p className="text-sm text-slate-500">
          Keep your leadership team informed with real-time dashboards that blend
          projects, spreadsheets, and automations.
        </p>
        <Link
          href="/dashboard/automations"
          className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 py-2 text-sm font-semibold text-white"
        >
          Launch automation
        </Link>
      </div>
    </aside>
  );
}
