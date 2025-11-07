import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-white/30 bg-white/10 text-white",
        secondary: "border-white/20 bg-white/5 text-white/70",
        outline: "border-white/40 text-white",
        success: "border-emerald-400/40 bg-emerald-400/20 text-emerald-200",
        warning: "border-amber-400/40 bg-amber-400/20 text-amber-100",
        danger: "border-rose-400/40 bg-rose-400/20 text-rose-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
