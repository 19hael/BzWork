type ActionNodeProps = {
  action: {
    type: string;
    description: string;
    config: Record<string, unknown>;
  };
};

export function ActionNode({ action }: ActionNodeProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white shadow-inner shadow-slate-900/30">
      <p className="text-xs uppercase tracking-[0.4em] text-white/40">
        Action
      </p>
      <p className="text-sm font-semibold text-white">{action.type}</p>
      <p className="text-xs text-white/60">{action.description}</p>
      <ul className="mt-2 space-y-1 text-xs text-white/70">
        {Object.entries(action.config).map(([key, value]) => (
          <li key={key} className="flex justify-between gap-4">
            <span className="text-white/40">{key}</span>
            <span className="font-medium text-white">
              {typeof value === "string" ? value : JSON.stringify(value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
