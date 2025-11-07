"use client";

type FormulaBarProps = {
  cellLabel: string;
  value: string;
};

export function FormulaBar({ cellLabel, value }: FormulaBarProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
      <span className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
        {cellLabel || "--"}
      </span>
      <p className="flex-1 text-slate-600">{value || "Select a cell to edit"}</p>
    </div>
  );
}
