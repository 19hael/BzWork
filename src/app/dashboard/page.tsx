'use client';

import { Header } from "@/components/layout/Header";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectBoard } from "@/components/projects/ProjectBoard";
import { AIChatPanel } from "@/components/ai/AIChatPanel";
import { AIInsightsWidget } from "@/components/ai/AIInsightsWidget";
import { AutomationBuilder } from "@/components/automations/AutomationBuilder";
import { useProjects } from "@/lib/hooks/useProjects";
import { useTasks } from "@/lib/hooks/useTasks";

export default function DashboardPage() {
  const { projects, activeProject } = useProjects();
  const { tasks } = useTasks(activeProject?.id);

  return (
    <div className="space-y-6">
      <Header
        title="Executive overview"
        subtitle="Monitor projects, spreadsheets, automations, and AI copilots in one control center."
      />
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Active programs
          </h2>
          <CreateProjectDialog />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Kanban board - {activeProject?.name}
          </h2>
        </div>
        <ProjectBoard projectId={activeProject?.id} />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {activeProject ? (
          <AIInsightsWidget project={activeProject} tasks={tasks} />
        ) : null}
        <AIChatPanel />
      </section>
      <AutomationBuilder />
    </div>
  );
}
