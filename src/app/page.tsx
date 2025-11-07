import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { AuthPanel } from "@/components/auth/AuthPanel";

const heroHighlights = [
  "Connect Supabase projects, spreadsheets, and automations",
  "Simulated AI copilots deliver actions in under 2 seconds",
  "Netlify-ready deploy with observability baked in",
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(68,88,255,0.08),_transparent_55%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-16 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1 space-y-8">
          <p className="inline-flex items-center rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            BzWork Demo
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            One operating system for projects, data, automations, and AI copilots.
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            Ship complex programs faster with a canvas that unifies Kanban, spreadsheet
            modeling, and workflow builders. Real-time Supabase persistence plus
            human-grade AI simulations for live demos.
          </p>
          <ul className="space-y-3">
            {heroHighlights.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 text-white">
                  <Check className="h-4 w-4" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg shadow-slate-900/20"
            >
              Explore dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="https://supabase.com"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-900"
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
    </main>
  );
}
