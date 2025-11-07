'use client';

import { AutomationBuilder } from "@/components/automations/AutomationBuilder";

export default function NewAutomationPage() {
  return (
    <div className="space-y-6 text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">
          Automation
        </p>
        <h1 className="text-2xl font-semibold">
          Describe your workflow
        </h1>
        <p className="text-sm text-white/70">
          The builder will propose triggers and actions instantly.
        </p>
      </div>
      <AutomationBuilder />
    </div>
  );
}
