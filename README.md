<div align="center">
  <img src="./public/logo.svg" alt="BzWork logo" width="96" />
  <h1>BzWork Demo MVP</h1>
  <p>All-in-one productivity platform that unifies project management, spreadsheets, automation, and AI copilots.</p>
</div>

## Tech Stack

- Next.js 14 App Router (TypeScript strict mode)
- Tailwind CSS + shadcn/ui primitives
- Supabase (PostgreSQL, Auth, Realtime)
- Zustand data layer + simulated AI services
- Netlify deployment with `@netlify/plugin-nextjs`

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

1. Create a Supabase project and run `docs/schema.sql`.
2. Enable Realtime on `tasks`, `projects`, and `spreadsheets`.
3. Populate `.env.local` with Supabase URL, anon key, service role key, and optional flags.
4. Generate typed APIs once credentials are present:

```bash
npm run update-types
```

5. Visit http://localhost:3000 to explore the workspace.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local Next.js server |
| `npm run build` | Production build |
| `npm run start` | Serve built app |
| `npm run lint` | ESLint checks |
| `npm run type-check` | TypeScript validation |
| `npm run update-types` | Pull Supabase types into `src/lib/supabase/database.types.ts` |

## Product Areas

- **Unified Dashboard** – Sidebar + command palette, workspace stats, Kanban preview, AI chat, automation builder.
- **Projects** – Grid of project cards, detail pages, Kanban board with drag-and-drop, task drill-down routes.
- **Spreadsheets** – Basic grid editor with cell inspector, formula bar, AI formula assistant.
- **Automations** – Catalog with toggle controls, natural-language builder that outputs trigger/action graphs, execution API.
- **AI Simulators** – `simulateTaskSuggestions`, `simulateFormulaAssist`, `simulateAutomationBuilder`, `simulateProjectInsights`, `simulateAIChatResponse`.
- **API Routes** – `/api/ai/task-suggest`, `/api/ai/formula-assist`, `/api/ai/automation-builder`, `/api/ai/chat`, `/api/automations/execute/[id]`.

## Supabase Schema

- Tables: `profiles`, `workspaces`, `projects`, `tasks`, `spreadsheets`, `automations`, `automation_logs`, `ai_interactions`.
- Row Level Security policies and realtime publication defined in `docs/schema.sql`.

## Deployment

1. Push the repo to GitHub.
2. Connect to Netlify, keep build command `npm run build`, publish `.next`.
3. Add environment variables (`.env.example`) inside Netlify dashboard.
4. Trigger a build; the Next.js plugin is configured via `netlify.toml`.

## Validation Checklist

```bash
npm run type-check
npm run lint
npm run build
```

Ensure Supabase credentials are configured before running flows that depend on persistence or auth. AI endpoints run locally using the simulator module for a realistic but offline-friendly experience.
