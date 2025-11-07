'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectBoard } from "@/components/projects/ProjectBoard";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { useProjects } from "@/lib/hooks/useProjects";

const filters = ["all", "active", "in_progress", "completed"] as const;

export default function ProjectsPage() {
  const { projects, activeProject, selectProject } = useProjects();
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((project) => project.status === filter);

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">
            Projects
          </p>
          <h1 className="text-2xl font-semibold">
            Strategy board
          </h1>
        </div>
        <CreateProjectDialog />
      </div>
      <Tabs
        defaultValue="all"
        value={filter}
        onValueChange={(value: string) =>
          setFilter(value as (typeof filters)[number])
        }
      >
        <TabsList>
          {filters.map((item) => (
            <TabsTrigger key={item} value={item}>
              {item === "all" ? "All" : item.replace("_", " ")}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={filter}>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => (
              <article key={project.id} onClick={() => selectProject(project.id)}>
                <ProjectCard project={project} />
              </article>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">
              Active board
            </p>
            <h2 className="text-lg font-semibold">
              {activeProject?.name}
            </h2>
          </div>
        </div>
        <ProjectBoard projectId={activeProject?.id} />
      </section>
    </div>
  );
}
