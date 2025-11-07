import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { AuthPanel } from "@/components/auth/AuthPanel";

const heroHighlights = [
  "Supabase workspaces sincronizados por usuario",
  "Automatizaciones tipo n8n con nodos reales",
  "Copiloto Gemini para chat, fórmulas y workflows",
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(199,181,255,0.35),_transparent_60%)]">
      <div className="absolute inset-0 bg-[linear-gradient(140deg,_rgba(3,6,15,0.97),_rgba(10,16,32,0.92))]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-16 text-slate-100 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1 space-y-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.4em] text-violet-200/90">
            BzWork Demo
            <span className="text-[10px] font-mono text-white/60">
              Project #{process.env.NEXT_PUBLIC_GEMINI_PROJECT ?? "1067908934753"}
            </span>
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Operamos proyectos, hojas de cálculo y automatizaciones desde un solo lienzo oscuro.
          </h1>
          <p className="max-w-xl text-lg text-white/70">
            Conecta Supabase por cuenta, construye Excel gigante integrado y coordina flujos tipo n8n con nodos reales.
            El copiloto Gemini responde en segundos con contexto del workspace.
          </p>
          <ul className="space-y-3">
            {heroHighlights.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/30 to-cyan-300/40 text-white">
                  <Check className="h-4 w-4" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-400 via-sky-300 to-emerald-200 px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-violet-500/30"
            >
              Explore dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="https://supabase.com"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-6 py-3 font-semibold text-white/90 hover:border-white/60"
            >
              View schema
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <AuthPanel />
        </div>
      </div>
      <section className="relative mx-auto grid w-full max-w-6xl gap-4 px-6 pb-16 text-sm text-white/80 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-rose-300">Problema</p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            Datos dispersos, automatizaciones manuales y hojas pequeñas imposible de escalar.
          </h3>
          <p className="mt-3 text-white/70">
            Cada equipo replica tareas y pega datos en Excel aislados. No existe un mismo login para conectar proyectos, hojas y bots.
          </p>
        </div>
        <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-400/20 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Solución</p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            Workspace único con Excel inmenso integrado, flujos n8n simplificados y Gemini ejecutando.
          </h3>
          <p className="mt-3 text-white/80">
            BzWork sincroniza Supabase en tiempo real por cuenta, dibuja diagramas de automatización, ejecuta funciones reales y documenta cada acción.
          </p>
        </div>
      </section>
    </main>
  );
}
