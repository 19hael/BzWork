import { create } from "zustand";
import { Automation, Project, Spreadsheet, Task } from "@/types";

type WorkspaceStore = {
  loading: boolean;
  workspaceId?: string;
  workspaceName?: string;
  projects: Project[];
  tasks: Task[];
  spreadsheets: Spreadsheet[];
  automations: Automation[];
  activeProjectId?: string;
  setLoading: (loading: boolean) => void;
  hydrate: (payload: {
    workspaceId?: string;
    workspaceName?: string;
    projects?: Project[];
    tasks?: Task[];
    spreadsheets?: Spreadsheet[];
    automations?: Automation[];
  }) => void;
  setActiveProject: (id?: string) => void;
  upsertProject: (project: Project) => void;
  setProjects: (projects: Project[]) => void;
  addTask: (task: Task) => void;
  upsertTask: (task: Task) => void;
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (taskId: string, status: Task["status"]) => void;
  updateTaskPosition: (taskId: string, position: number) => void;
  toggleAutomation: (automationId: string) => void;
  upsertAutomation: (automation: Automation) => void;
  setAutomations: (automations: Automation[]) => void;
  saveSpreadsheet: (spreadsheet: Spreadsheet) => void;
  setSpreadsheets: (spreadsheets: Spreadsheet[]) => void;
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  loading: true,
  workspaceId: undefined,
  workspaceName: undefined,
  projects: [],
  tasks: [],
  spreadsheets: [],
  automations: [],
  activeProjectId: undefined,
  setLoading: (loading) => set({ loading }),
  hydrate: ({
    workspaceId,
    workspaceName,
    projects,
    tasks,
    spreadsheets,
    automations,
  }) =>
    set((state) => ({
      workspaceId: workspaceId ?? state.workspaceId,
      workspaceName: workspaceName ?? state.workspaceName,
      projects: projects ?? state.projects,
      tasks: tasks ?? state.tasks,
      spreadsheets: spreadsheets ?? state.spreadsheets,
      automations: automations ?? state.automations,
      activeProjectId:
        projects
          ? projects.length > 0
            ? projects[0].id
            : undefined
          : state.activeProjectId,
      loading: false,
    })),
  setActiveProject: (id) => set({ activeProjectId: id }),
  upsertProject: (project) =>
    set((state) => {
      const exists = state.projects.some((item) => item.id === project.id);
      return {
        projects: exists
          ? state.projects.map((item) =>
              item.id === project.id ? project : item
            )
          : [...state.projects, project],
        activeProjectId: state.activeProjectId ?? project.id,
      };
    }),
  setProjects: (projects) =>
    set((state) => ({
      projects,
      activeProjectId: state.activeProjectId ?? projects[0]?.id,
    })),
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  upsertTask: (task) =>
    set((state) => ({
      tasks: state.tasks.some((item) => item.id === task.id)
        ? state.tasks.map((item) => (item.id === task.id ? task : item))
        : [...state.tasks, task],
    })),
  setTasks: (tasks) => set({ tasks }),
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
  upsertAutomation: (automation) =>
    set((state) => ({
      automations: state.automations.some((item) => item.id === automation.id)
        ? state.automations.map((item) =>
            item.id === automation.id ? automation : item
          )
        : [...state.automations, automation],
    })),
  setAutomations: (automations) => set({ automations }),
  saveSpreadsheet: (spreadsheet) =>
    set((state) => ({
      spreadsheets: state.spreadsheets.map((sheet) =>
        sheet.id === spreadsheet.id ? spreadsheet : sheet
      ),
    })),
  setSpreadsheets: (spreadsheets) => set({ spreadsheets }),
}));
