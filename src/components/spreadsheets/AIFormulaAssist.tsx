"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
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
    try {
      const response = await fetch("/api/ai/formula-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "No pudimos generar la fórmula");
      }
      setResult(data.result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error con Gemini";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c1425] via-[#0a1220] to-[#050910] p-5 text-white shadow-xl shadow-cyan-500/10">
      <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/60">
        <Sparkles className="h-4 w-4 text-amber-400" />
        Fórmulas con IA
      </div>
      <Textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Ej. suma ARR cuando owner sea Dana"
        className="mt-4 min-h-[140px]"
      />
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-3 w-full rounded-2xl"
      >
        {loading ? "Pensando..." : "Generar fórmula"}
      </Button>
      {result ? (
        <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
          <p className="font-semibold text-white">{result.formula}</p>
          <p className="text-white/80">{result.explanation}</p>
          <p className="text-white/60">{result.example}</p>
        </div>
      ) : null}
    </div>
  );
}
