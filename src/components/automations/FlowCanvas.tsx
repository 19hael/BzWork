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
    <div className="flex flex-col gap-4 rounded-3xl border border-dashed border-slate-300 p-5">
      <TriggerSelector trigger={trigger} />
      <div className="flex flex-wrap items-center gap-4">
        {actions.map((action, index) => (
          <div key={action.type + index} className="flex items-center gap-4">
            <ActionNode action={action} />
            {index < actions.length - 1 ? (
              <div className="h-px w-8 bg-slate-200" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
