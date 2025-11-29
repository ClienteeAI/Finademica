import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border-0 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "bg-success/15 text-success",
        secondary: "bg-secondary text-text-secondary",
        info: "bg-info/15 text-info",
        warning: "bg-warning/15 text-warning",
        destructive: "bg-error/15 text-error",
        success: "bg-success/15 text-success",
        purple: "bg-purple-500/15 text-purple-400",
        outline: "border border-border-hover text-text-secondary",
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
