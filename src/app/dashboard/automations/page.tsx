'use client';

import Link from "next/link";
import { PlayCircle, Workflow } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAutomations } from "@/lib/hooks/useAutomations";

export default function AutomationsPage() {
  const { automations, switchAutomation } = useAutomations();

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">
            Automations
          </p>
          <h1 className="text-2xl font-semibold">
            Workflow studio
          </h1>
        </div>
        <Link
          href="/dashboard/automations/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500/80 px-6 py-3 text-sm font-semibold text-slate-900"
        >
          <PlayCircle className="h-4 w-4" />
          Build automation
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {automations.map((automation) => (
          <Link
            key={automation.id}
            href={`/dashboard/automations/${automation.id}`}
            className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm shadow-cyan-500/5 transition hover:-translate-y-1 hover:bg-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Workflow className="h-5 w-5 text-cyan-300" />
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                    Automation
                  </p>
                  <h2 className="text-lg font-semibold text-white">
                    {automation.name}
                  </h2>
                </div>
              </div>
              <Switch
                checked={Boolean(automation.is_active)}
                onCheckedChange={() => switchAutomation(automation.id)}
              />
            </div>
            <p className="mt-2 text-sm text-white/70">
              {automation.description}
            </p>
            <p className="mt-4 text-xs text-white/50">
              Trigger: {automation.trigger_type}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
