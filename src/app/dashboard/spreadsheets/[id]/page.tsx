'use client';

import { useParams } from "next/navigation";
import { SpreadsheetGrid } from "@/components/spreadsheets/SpreadsheetGrid";
import { AIFormulaAssist } from "@/components/spreadsheets/AIFormulaAssist";
import { useSpreadsheets } from "@/lib/hooks/useSpreadsheets";

export default function SpreadsheetDetailPage() {
  const params = useParams<{ id: string }>();
  const { spreadsheets } = useSpreadsheets();
  const sheet = spreadsheets.find((entry) => entry.id === params?.id);

  if (!sheet) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Spreadsheet not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Spreadsheet
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">{sheet.name}</h1>
        <p className="text-sm text-slate-500">{sheet.description}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SpreadsheetGrid sheetId={sheet.id} />
        </div>
        <AIFormulaAssist />
      </div>
    </div>
  );
}
