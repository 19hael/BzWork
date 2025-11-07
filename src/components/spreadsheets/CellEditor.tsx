"use client";

type CellEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onCommit: () => void;
};

export function CellEditor({ value, onChange, onCommit }: CellEditorProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white">
      <input
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onCommit();
          }
        }}
        placeholder="Escribe un valor o fórmula"
      />
      <button
        onClick={onCommit}
        className="rounded-lg bg-cyan-500/80 px-3 py-1 text-xs font-semibold text-slate-900"
      >
        Guardar
      </button>
    </div>
  );
}
