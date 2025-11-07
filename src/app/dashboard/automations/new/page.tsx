'use client';

import { AutomationBuilder } from "@/components/automations/AutomationBuilder";

export default function NewAutomationPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Automation
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">
          Describe your workflow
        </h1>
        <p className="text-sm text-slate-500">
          The builder will propose triggers and actions instantly.
        </p>
      </div>
      <AutomationBuilder />
    </div>
  );
}
