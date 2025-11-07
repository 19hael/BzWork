type TriggerSelectorProps = {
  trigger: {
    type: string;
    config: Record<string, unknown>;
  };
};

export function TriggerSelector({ trigger }: TriggerSelectorProps) {
  return (
    <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900/60 to-indigo-900/60 px-5 py-4 text-white">
      <p className="text-xs uppercase tracking-[0.4em] text-white/50">
        Trigger
      </p>
      <p className="text-lg font-semibold text-white">{trigger.type}</p>
      <ul className="mt-3 space-y-1 text-xs text-white/70">
        {Object.entries(trigger.config).map(([key, value]) => (
          <li key={key} className="flex justify-between gap-4">
            <span className="text-white/50">{key}</span>
            <span className="font-semibold">
              {typeof value === "string" ? value : JSON.stringify(value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
