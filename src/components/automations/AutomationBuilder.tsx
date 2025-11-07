"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FlowCanvas } from "@/components/automations/FlowCanvas";

type GeneratedAutomation = {
  id: string;
  name: string;
  trigger: { type: string; config: Record<string, unknown> };
  actions: Array<{
    type: string;
    description: string;
    config: Record<string, unknown>;
  }>;
  estimatedExecutionTime?: string;
  diagram?: string;
};

export function AutomationBuilder() {
  const upsertAutomation = useWorkspaceStore((state) => state.upsertAutomation);
  const [prompt, setPrompt] = useState(
    "Cuando una tarea urgente termina, notifica en Slack, actualiza Supabase y crea seguimiento."
  );
  const [result, setResult] = useState<GeneratedAutomation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error("Describe qué debe hacer la automatización");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/automation-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: prompt }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "No pudimos generar la automatización");
      }
      setResult(data.automation);
      if (data.record) {
        upsertAutomation(data.record);
      }
      toast.success("Automatización generada y guardada");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error con Gemini";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">
            Automation builder
          </p>
          <p className="text-sm text-white/70">
            Describe el flujo en lenguaje natural y lo convertimos a nodos n8n style
          </p>
        </div>
        <Sparkles className="h-5 w-5 text-amber-400" />
      </div>
      <div className="grid gap-3 text-xs text-white/60 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 px-3 py-2">
          <p className="text-white/40">Estado</p>
          <p className="text-base font-semibold text-white">{loading ? "Generando" : result ? "Listo" : "Esperando"}</p>
        </div>
        <div className="rounded-2xl border border-white/10 px-3 py-2">
          <p className="text-white/40">Diagramas activos</p>
          <p className="text-base font-semibold text-white">{result ? result.actions.length + 1 : 0}</p>
        </div>
        <div className="rounded-2xl border border-white/10 px-3 py-2">
          <p className="text-white/40">Proyecto Gemini</p>
          <p className="text-base font-semibold text-white">
            {process.env.NEXT_PUBLIC_GEMINI_PROJECT ?? "1067908934753"}
          </p>
        </div>
      </div>
      <Textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        className="min-h-[120px] border-white/10 bg-white/5 text-white placeholder:text-white/40"
        placeholder="Define objetivos del flujo..."
      />
      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full rounded-2xl bg-cyan-500/80 py-5 text-base font-semibold text-slate-900 hover:bg-cyan-400"
      >
        {loading ? "Synthesizing..." : "Generate automation"}
      </Button>
      {error ? (
        <p className="text-xs text-rose-300">{error}</p>
      ) : null}
      {result ? (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-white">{result.name}</p>
          <FlowCanvas trigger={result.trigger} actions={result.actions} />
          <p className="text-xs text-white/60">
            Tiempo estimado {result.estimatedExecutionTime}
          </p>
          {result.diagram ? (
            <p className="text-xs text-white/50">{result.diagram}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
