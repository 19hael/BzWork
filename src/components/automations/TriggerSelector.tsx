type TriggerSelectorProps = {
  trigger: {
    type: string;
    config: Record<string, unknown>;
  };
};

export function TriggerSelector({ trigger }: TriggerSelectorProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
      <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
        Trigger
      </p>
      <p className="text-lg font-semibold text-slate-900">{trigger.type}</p>
      <ul className="mt-3 space-y-1 text-xs text-slate-600">
        {Object.entries(trigger.config).map(([key, value]) => (
          <li key={key} className="flex justify-between">
            <span>{key}</span>
            <span className="font-semibold">
              {typeof value === "string" ? value : JSON.stringify(value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
