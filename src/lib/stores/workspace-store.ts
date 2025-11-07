import { create } from "zustand";
import { Automation, Project, Spreadsheet, Task } from "@/types";
import {
  mockAutomations,
  mockProjects,
  mockSpreadsheets,
  mockTasks,
  mockWorkspace,
} from "@/lib/data/mock";

type WorkspaceStore = {
  workspaceId: string;
  projects: Project[];
  tasks: Task[];
  spreadsheets: Spreadsheet[];
  automations: Automation[];
  activeProjectId?: string;
  setActiveProject: (id: string) => void;
  addProject: (project: Project) => void;
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, status: Task["status"]) => void;
  updateTaskPosition: (taskId: string, position: number) => void;
  toggleAutomation: (automationId: string) => void;
  saveSpreadsheet: (spreadsheet: Spreadsheet) => void;
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaceId: mockWorkspace.id,
  projects: mockProjects,
  tasks: mockTasks,
  spreadsheets: mockSpreadsheets,
  automations: mockAutomations,
  activeProjectId: mockProjects[0]?.id,
  setActiveProject: (id) =>
    set(() => ({
      activeProjectId: id,
    })),
  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      ),
    })),
  updateTaskPosition: (taskId, position) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, position } : task
      ),
    })),
  toggleAutomation: (automationId) =>
    set((state) => ({
      automations: state.automations.map((automation) =>
        automation.id === automationId
          ? { ...automation, is_active: !automation.is_active }
          : automation
      ),
    })),
  saveSpreadsheet: (spreadsheet) =>
    set((state) => ({
      spreadsheets: state.spreadsheets.map((sheet) =>
        sheet.id === spreadsheet.id ? spreadsheet : sheet
      ),
    })),
}));
