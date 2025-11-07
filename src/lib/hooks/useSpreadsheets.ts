import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Spreadsheet } from "@/types";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";

export function useSpreadsheets() {
  const { spreadsheets, saveSpreadsheet } = useWorkspaceStore();

  const updateSpreadsheet = async (sheet: Spreadsheet) => {
    saveSpreadsheet(sheet);
    const supabase = createClient();
    const { error } = await supabase
      .from("spreadsheets")
      .update({
        data: sheet.data,
        columns: sheet.columns,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sheet.id);
    if (error) {
      toast.error("No pudimos guardar la hoja");
    }
  };

  return {
    spreadsheets,
    updateSpreadsheet,
  };
}
