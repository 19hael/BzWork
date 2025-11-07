"use client";

type CellEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onCommit: () => void;
};

export function CellEditor({ value, onChange, onCommit }: CellEditorProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
      <input
        className="w-full bg-transparent text-sm outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onCommit();
          }
        }}
      />
      <button
        onClick={onCommit}
        className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
      >
        Save
      </button>
    </div>
  );
}
