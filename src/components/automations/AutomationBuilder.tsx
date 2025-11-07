"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { simulateAutomationBuilder } from "@/lib/ai/simulators";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FlowCanvas } from "@/components/automations/FlowCanvas";

export function AutomationBuilder() {
  const [prompt, setPrompt] = useState(
    "When a task marked urgent is completed, notify exec channel and create a follow-up checklist."
  );
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof simulateAutomationBuilder>
  > | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const automation = await simulateAutomationBuilder(prompt);
    setResult(automation);
    setLoading(false);
  };

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Automation builder
          </p>
          <p className="text-sm text-slate-500">
            Describe the workflow in natural language
          </p>
        </div>
        <Sparkles className="h-5 w-5 text-amber-500" />
      </div>
      <Textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        className="min-h-[120px]"
        placeholder="Define automation goals..."
      />
      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full rounded-2xl py-5 text-base font-semibold"
      >
        {loading ? "Synthesizing..." : "Generate automation"}
      </Button>
      {result ? (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-900">{result.name}</p>
          <FlowCanvas trigger={result.trigger} actions={result.actions} />
          <p className="text-xs text-slate-500">
            Estimated execution time {result.estimatedExecutionTime}
          </p>
        </div>
      ) : null}
    </div>
  );
}
