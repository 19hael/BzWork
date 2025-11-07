"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Project, Task } from "@/types";
import { simulateProjectInsights } from "@/lib/ai/simulators";

type Props = {
  project: Project;
  tasks: Task[];
};

export function AIInsightsWidget({ project, tasks }: Props) {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Awaited<
    ReturnType<typeof simulateProjectInsights>
  > | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    simulateProjectInsights(project, tasks).then((data) => {
      if (mounted) {
        setInsights(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [project.id, tasks, project]);

  if (loading || !insights) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl border border-white/10 bg-white/5">
        <Loader2 className="h-6 w-6 animate-spin text-white/60" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 text-white">
      <div className="border-b border-white/5 px-5 py-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">
          AI Insights
        </p>
        <p className="text-sm font-semibold text-white">{project.name}</p>
      </div>
      <div className="space-y-4 p-5 text-sm text-white/80">
        <p className="text-white/80">{insights.summary}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {insights.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <p className="text-xs uppercase tracking-widest text-white/40">
                {metric.label}
              </p>
              <p className="text-xl font-semibold text-white">
                {metric.value}
              </p>
              {metric.insight ? (
                <p className="text-xs text-white/70">{metric.insight}</p>
              ) : null}
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">
            Recommendations
          </p>
          <ul className="mt-2 space-y-2">
            {insights.recommendations.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-2xl bg-white/10 px-3 py-2 text-white"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">
            Risks
          </p>
          <ul className="mt-2 space-y-2">
            {insights.risks.map((risk, index) => (
              <li
                key={`${risk.message}-${index}`}
                className="flex items-start gap-2 rounded-2xl bg-rose-500/20 px-3 py-2 text-rose-100"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                {risk.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
