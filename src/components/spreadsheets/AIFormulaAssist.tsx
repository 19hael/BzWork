"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { simulateFormulaAssist } from "@/lib/ai/simulators";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function AIFormulaAssist() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    formula: string;
    explanation: string;
    example: string;
  } | null>(null);

  const handleSubmit = async () => {
    if (!prompt) return;
    setLoading(true);
    const response = await simulateFormulaAssist(prompt);
    setResult(response);
    setLoading(false);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white">
      <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/70">
        <Sparkles className="h-4 w-4 text-amber-400" />
        AI Formula Assist
      </div>
      <Textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="E.g. Sum ARR where owner is Dana"
        className="mt-4 min-h-[120px] border-none bg-white/10 text-white placeholder:text-white/50"
      />
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-3 w-full rounded-2xl bg-amber-400 text-slate-900 hover:bg-amber-300"
      >
        {loading ? "Thinking..." : "Generate formula"}
      </Button>
      {result ? (
        <div className="mt-4 space-y-2 rounded-2xl bg-white/10 p-4 text-sm">
          <p className="font-semibold text-white">{result.formula}</p>
          <p className="text-white/80">{result.explanation}</p>
          <p className="text-white/60">{result.example}</p>
        </div>
      ) : null}
    </div>
  );
}
