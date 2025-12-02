import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all duration-250",
  {
    variants: {
      variant: {
        default: "border-primary/70 bg-primary/8 text-foreground shadow-[0_0_12px_rgba(34,243,255,0.3)]",
        secondary: "border-border-glass bg-card/40 backdrop-blur-sm text-text-secondary",
        info: "border-info/70 bg-info/8 text-info shadow-[0_0_12px_rgba(14,165,233,0.3)]",
        warning: "border-warning/70 bg-warning/8 text-warning shadow-[0_0_12px_rgba(251,146,60,0.3)]",
        destructive: "border-error/70 bg-error/8 text-error shadow-[0_0_12px_rgba(239,68,68,0.3)]",
        success: "border-success/70 bg-success/8 text-success shadow-[0_0_12px_rgba(34,197,94,0.3)]",
        purple: "border-purple/70 bg-purple/8 text-purple shadow-[0_0_12px_rgba(139,92,246,0.3)]",
        outline: "border-border-glass bg-transparent backdrop-blur-sm text-text-secondary hover:border-primary/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
