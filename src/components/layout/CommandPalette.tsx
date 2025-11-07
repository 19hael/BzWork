"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useProjects } from "@/lib/hooks/useProjects";
import { useTasks } from "@/lib/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const router = useRouter();

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((state) => !state);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (value: string) => {
    setOpen(false);
    router.push(value);
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-between gap-4 text-left text-sm text-white/70"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4 text-white/40" />
          Search projects, automations, tasks
        </span>
        <kbd className="rounded-md bg-white/10 px-2 py-1 text-xs text-white/60">
          ⌘K
        </kbd>
      </Button>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global command menu"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#050812] text-white shadow-2xl"
        )}
      >
        <div className="flex items-center border-b border-white/10 px-4">
          <Search className="h-4 w-4 text-white/40" />
          <Command.Input
            autoFocus
            className="h-12 w-full border-0 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/40"
            placeholder="Jump to anything..."
          />
        </div>
        <Command.List className="max-h-80 overflow-y-auto px-2 py-4 text-sm">
          <Command.Empty className="px-4 py-2 text-white/60">
            Nothing found. Try another search.
          </Command.Empty>
          <Command.Group
            heading="Navigation"
            className="space-y-1 px-2 text-xs font-semibold uppercase tracking-widest text-white/40"
          >
            <Command.Item
              className="group rounded-xl px-3 py-2 text-sm font-medium text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
              onSelect={() => handleSelect("/dashboard")}
            >
              Overview
            </Command.Item>
            <Command.Item
              className="group rounded-xl px-3 py-2 text-sm font-medium text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
              onSelect={() => handleSelect("/dashboard/projects")}
            >
              Projects
            </Command.Item>
            <Command.Item
              className="group rounded-xl px-3 py-2 text-sm font-medium text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
              onSelect={() => handleSelect("/dashboard/spreadsheets")}
            >
              Spreadsheets
            </Command.Item>
            <Command.Item
              className="group rounded-xl px-3 py-2 text-sm font-medium text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
              onSelect={() => handleSelect("/dashboard/automations")}
            >
              Automations
            </Command.Item>
          </Command.Group>
          <Command.Group
            heading="Projects"
            className="mt-4 space-y-1 px-2 text-xs font-semibold uppercase tracking-widest text-white/40"
          >
            {projects.map((project) => (
              <Command.Item
                key={project.id}
                className="rounded-xl px-3 py-2 text-sm font-medium text-white/70 data-[selected=true]:bg-cyan-500/30 data-[selected=true]:text-white"
                onSelect={() => handleSelect(`/dashboard/projects/${project.id}`)}
              >
                {project.name}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group
            heading="Tasks"
            className="mt-4 space-y-1 px-2 text-xs font-semibold uppercase tracking-widest text-white/40"
          >
            {tasks.slice(0, 8).map((task) => (
              <Command.Item
                key={task.id}
                className="rounded-xl px-3 py-2 text-sm text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
                onSelect={() =>
                  handleSelect(
                    `/dashboard/projects/${task.project_id}/tasks/${task.id}`
                  )
                }
              >
                {task.title}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </>
  );
}
