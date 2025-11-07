import { TriggerSelector } from "@/components/automations/TriggerSelector";
import { ActionNode } from "@/components/automations/ActionNode";

type FlowCanvasProps = {
  trigger: {
    type: string;
    config: Record<string, unknown>;
  };
  actions: Array<{
    type: string;
    description: string;
    config: Record<string, unknown>;
  }>;
};

export function FlowCanvas({ trigger, actions }: FlowCanvasProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),rgba(3,7,18,0.88))] p-5 text-white shadow-lg shadow-slate-900/40">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,_1fr)]">
        <div className="space-y-4">
          <TriggerSelector trigger={trigger} />
          <div className="rounded-2xl border border-dashed border-white/10 p-4 text-xs text-white/60">
            <p className="text-white/40">Diagrama</p>
            <p className="mt-1 text-base font-semibold text-white">
              {actions.length + 1} nodos conectados
            </p>
            <p className="mt-2">
              Se genera automáticamente la ruta trigger → acciones y cada paso queda documentado.
            </p>
          </div>
        </div>
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 h-full border-l border-dashed border-white/10" />
          <div className="space-y-4">
            {actions.map((action, index) => (
              <div key={action.type + index} className="relative pl-6">
                <span className="absolute -left-6 top-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                  {index + 1}
                </span>
                <ActionNode action={action} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
