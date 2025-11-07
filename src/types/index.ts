import { Database } from "@/lib/supabase/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Workspace = Database["public"]["Tables"]["workspaces"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  progress?: number;
  budget_used?: number;
};
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type Spreadsheet = Database["public"]["Tables"]["spreadsheets"]["Row"];
export type Automation = Database["public"]["Tables"]["automations"]["Row"];

export type KanbanColumn = {
  id: Task["status"];
  title: string;
  tasks: Task[];
};

export type InsightMetric = {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  insight?: string;
};
