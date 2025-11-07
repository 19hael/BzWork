import { useWorkspaceStore } from "@/lib/stores/workspace-store";

export function useAutomations() {
  const { automations, toggleAutomation } = useWorkspaceStore();

  const switchAutomation = (automationId: string) => {
    toggleAutomation(automationId);
  };

  return {
    automations,
    switchAutomation,
  };
}
