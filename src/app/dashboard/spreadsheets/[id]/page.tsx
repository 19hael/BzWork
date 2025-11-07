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
    <div className="space-y-6 text-white">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">
          Spreadsheet
        </p>
        <h1 className="text-3xl font-semibold text-white">{sheet.name}</h1>
        <p className="text-sm text-white/70">{sheet.description}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,_3fr)_minmax(320px,_1fr)]">
        <SpreadsheetGrid sheetId={sheet.id} />
        <AIFormulaAssist />
      </div>
    </div>
  );
}
