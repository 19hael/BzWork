import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";

export function useAutomations() {
  const { automations, toggleAutomation } = useWorkspaceStore();
  const supabase = createClient();

  const switchAutomation = async (automationId: string) => {
    const automation = automations.find((entry) => entry.id === automationId);
    if (!automation) return;
    toggleAutomation(automationId);
    const nextState = !automation.is_active;
    const { error } = await supabase
      .from("automations")
      .update({ is_active: nextState })
      .eq("id", automationId);
    if (error) {
      toast.error("No pudimos actualizar la automatización");
      toggleAutomation(automationId);
    }
  };

  return {
    automations,
    switchAutomation,
  };
}
