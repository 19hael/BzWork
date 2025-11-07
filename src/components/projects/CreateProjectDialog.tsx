"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProjects } from "@/lib/hooks/useProjects";
import { Project } from "@/types";

export function CreateProjectDialog() {
  const { createProject } = useProjects();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    end_date: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setForm((state) => ({ ...state, [field]: event.target.value }));
  };

  const handleSubmit = () => {
    if (!form.name) {
      toast.error("Project needs a name");
      return;
    }
    setSubmitting(true);
    const project: Project = {
      id: `proj-${crypto.randomUUID()}`,
      workspace_id: "ws-demo-01",
      name: form.name,
      description: form.description,
      status: "active",
      color: "#2563eb",
      start_date: new Date().toISOString(),
      end_date: form.end_date || null,
      budget: null,
      created_by: "user-demo-01",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      progress: 0,
      budget_used: 0,
    };
    createProject(project);
    setSubmitting(false);
    setOpen(false);
    setForm({ name: "", description: "", end_date: "" });
    toast.success("Project added to workspace");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl px-6 py-5 text-base font-semibold">
          New project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Spin up a project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Name</Label>
            <Input
              id="project-name"
              placeholder="Northstar Automation"
              value={form.name}
              onChange={(event) => handleChange(event, "name")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">Narrative</Label>
            <Textarea
              id="project-description"
              placeholder="What outcomes will this unlock?"
              value={form.description}
              onChange={(event) => handleChange(event, "description")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-date">Target date</Label>
            <Input
              id="project-date"
              type="date"
              value={form.end_date}
              onChange={(event) => handleChange(event, "end_date")}
            />
          </div>
          <Button
            className="w-full rounded-2xl py-5 text-base font-semibold"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
