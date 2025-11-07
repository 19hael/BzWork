'use client';

import Link from "next/link";
import { PlayCircle, Workflow } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAutomations } from "@/lib/hooks/useAutomations";

export default function AutomationsPage() {
  const { automations, switchAutomation } = useAutomations();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Automations
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Workflow studio
          </h1>
        </div>
        <Link
          href="/dashboard/automations/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
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
            className="flex flex-col rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Workflow className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                    Automation
                  </p>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {automation.name}
                  </h2>
                </div>
              </div>
              <Switch
                checked={Boolean(automation.is_active)}
                onCheckedChange={() => switchAutomation(automation.id)}
              />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {automation.description}
            </p>
            <p className="mt-4 text-xs text-slate-400">
              Trigger: {automation.trigger_type}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
