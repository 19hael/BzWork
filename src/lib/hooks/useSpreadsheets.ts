import { Spreadsheet } from "@/types";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";

export function useSpreadsheets() {
  const { spreadsheets, saveSpreadsheet } = useWorkspaceStore();

  const updateSpreadsheet = (sheet: Spreadsheet) => {
    saveSpreadsheet(sheet);
  };

  return {
    spreadsheets,
    updateSpreadsheet,
  };
}
