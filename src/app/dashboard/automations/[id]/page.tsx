'use client';

import { useParams } from "next/navigation";
import { FlowCanvas } from "@/components/automations/FlowCanvas";
import { useAutomations } from "@/lib/hooks/useAutomations";

export default function AutomationDetailPage() {
  const params = useParams<{ id: string }>();
  const { automations } = useAutomations();
  const automation = automations.find((entry) => entry.id === params?.id);

  if (!automation) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Automation not found.
      </div>
    );
  }

  const actions = Array.isArray(automation.actions)
    ? (automation.actions as Array<{ type: string; description?: string; [key: string]: unknown }>)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Automation
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">
          {automation.name}
        </h1>
        <p className="text-sm text-slate-500">{automation.description}</p>
      </div>
      <FlowCanvas
        trigger={{
          type: automation.trigger_type,
          config: (automation.trigger_config as Record<string, unknown>) ?? {},
        }}
        actions={actions.map((action) => ({
          type: action.type,
          description:
            (action.description as string) ?? "Configured action step",
          config: action,
        }))}
      />
    </div>
  );
}
