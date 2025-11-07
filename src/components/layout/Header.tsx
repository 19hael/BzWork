"use client";

import { Bell, Sparkles } from "lucide-react";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/lib/hooks/useProjects";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  const { summary } = useProjects();

  return (
    <header className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            BzWork Command Hub
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
          {subtitle ? (
            <p className="text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500" />
          </Button>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-semibold">
            AV
          </div>
        </div>
      </div>
      <CommandPalette />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white">
          <p className="text-sm text-slate-300">Workspace completion</p>
          <p className="text-3xl font-semibold">{summary.completion}%</p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Overdue
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            {summary.overdue}
          </p>
          <p className="text-sm text-slate-500">Items need attention</p>
        </div>
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Automations
          </p>
          <p className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
            <Sparkles className="h-5 w-5 text-amber-500" />
            {summary.highPriority}
          </p>
          <p className="text-sm text-slate-500">
            Urgent workflows ready to trigger
          </p>
        </div>
      </div>
    </header>
  );
}
