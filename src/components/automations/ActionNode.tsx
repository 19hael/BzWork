type ActionNodeProps = {
  action: {
    type: string;
    description: string;
    config: Record<string, unknown>;
  };
};

export function ActionNode({ action }: ActionNodeProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
        Action
      </p>
      <p className="text-sm font-semibold text-slate-900">{action.type}</p>
      <p className="text-xs text-slate-500">{action.description}</p>
      <ul className="mt-2 space-y-1 text-xs text-slate-500">
        {Object.entries(action.config).map(([key, value]) => (
          <li key={key} className="flex justify-between">
            <span className="text-slate-400">{key}</span>
            <span className="font-medium text-slate-700">
              {typeof value === "string" ? value : JSON.stringify(value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
