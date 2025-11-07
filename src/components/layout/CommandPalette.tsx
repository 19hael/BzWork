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
        className="w-full justify-between gap-4 text-left text-sm text-slate-500"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          Search projects, automations, tasks
        </span>
        <kbd className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500">
          ⌘K
        </kbd>
      </Button>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global command menu"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-2xl"
        )}
      >
        <div className="flex items-center border-b border-slate-100 px-4">
          <Search className="h-4 w-4 text-slate-400" />
          <Command.Input
            autoFocus
            className="h-12 w-full border-0 bg-transparent px-3 text-sm outline-none placeholder:text-slate-400"
            placeholder="Jump to anything..."
          />
        </div>
        <Command.List className="max-h-80 overflow-y-auto px-2 py-4 text-sm">
          <Command.Empty className="px-4 py-2 text-slate-500">
            Nothing found. Try another search.
          </Command.Empty>
          <Command.Group
            heading="Navigation"
            className="space-y-1 px-2 text-xs font-semibold uppercase tracking-widest text-slate-400"
          >
            <Command.Item
              className="group rounded-xl px-3 py-2 text-sm font-medium text-slate-700 data-[selected=true]:bg-slate-900 data-[selected=true]:text-white"
              onSelect={() => handleSelect("/dashboard")}
            >
              Overview
            </Command.Item>
            <Command.Item
              className="group rounded-xl px-3 py-2 text-sm font-medium text-slate-700 data-[selected=true]:bg-slate-900 data-[selected=true]:text-white"
              onSelect={() => handleSelect("/dashboard/projects")}
            >
              Projects
            </Command.Item>
            <Command.Item
              className="group rounded-xl px-3 py-2 text-sm font-medium text-slate-700 data-[selected=true]:bg-slate-900 data-[selected=true]:text-white"
              onSelect={() => handleSelect("/dashboard/spreadsheets")}
            >
              Spreadsheets
            </Command.Item>
            <Command.Item
              className="group rounded-xl px-3 py-2 text-sm font-medium text-slate-700 data-[selected=true]:bg-slate-900 data-[selected=true]:text-white"
              onSelect={() => handleSelect("/dashboard/automations")}
            >
              Automations
            </Command.Item>
          </Command.Group>
          <Command.Group
            heading="Projects"
            className="mt-4 space-y-1 px-2 text-xs font-semibold uppercase tracking-widest text-slate-400"
          >
            {projects.map((project) => (
              <Command.Item
                key={project.id}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 data-[selected=true]:bg-brand-600 data-[selected=true]:text-white"
                onSelect={() => handleSelect(`/dashboard/projects/${project.id}`)}
              >
                {project.name}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group
            heading="Tasks"
            className="mt-4 space-y-1 px-2 text-xs font-semibold uppercase tracking-widest text-slate-400"
          >
            {tasks.slice(0, 8).map((task) => (
              <Command.Item
                key={task.id}
                className="rounded-xl px-3 py-2 text-sm text-slate-700 data-[selected=true]:bg-slate-900 data-[selected=true]:text-white"
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
