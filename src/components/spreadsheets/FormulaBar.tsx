"use client";

type FormulaBarProps = {
  cellLabel: string;
  value: string;
};

export function FormulaBar({ cellLabel, value }: FormulaBarProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
      <span className="rounded-lg bg-cyan-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white">
        {cellLabel || "--"}
      </span>
      <p className="flex-1 text-white/70">
        {value || "Selecciona una celda para editar"}
      </p>
    </div>
  );
}
