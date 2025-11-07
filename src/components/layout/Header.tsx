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
    <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">
            BzWork Command Hub
          </p>
          <h1 className="text-3xl font-semibold text-white">{title}</h1>
          {subtitle ? (
            <p className="text-sm text-white/70">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="relative text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500" />
          </Button>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
            AV
          </div>
        </div>
      </div>
      <CommandPalette />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-900 px-4 py-3 text-white">
          <p className="text-sm text-white/60">Workspace completion</p>
          <p className="text-3xl font-semibold">{summary.completion}%</p>
        </div>
        <div className="rounded-2xl bg-white/10 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-white/60">
            Overdue
          </p>
          <p className="text-2xl font-semibold text-white">
            {summary.overdue}
          </p>
          <p className="text-sm text-white/70">Items need attention</p>
        </div>
        <div className="rounded-2xl border border-dashed border-white/20 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-white/60">
            Automations
          </p>
          <p className="flex items-center gap-2 text-2xl font-semibold text-white">
            <Sparkles className="h-5 w-5 text-amber-400" />
            {summary.highPriority}
          </p>
          <p className="text-sm text-white/70">
            Urgent workflows ready to trigger
          </p>
        </div>
      </div>
    </header>
  );
}
