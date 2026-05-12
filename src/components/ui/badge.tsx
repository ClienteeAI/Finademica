import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all duration-250",
  {
    variants: {
      variant: {
        default: "border-[#6366F1]/60 bg-[#6366F1]/10 text-[#256F7A] shadow-[0_0_10px_rgba(99, 102, 241,0.2)]",
        secondary: "border-[#D4E0EC] bg-white/60 backdrop-blur-sm text-[#4B5563]",
        info: "border-[#1D3557]/30 bg-[#1D3557]/10 text-[#1D3557] shadow-[0_0_10px_rgba(29,53,87,0.15)]",
        warning: "border-[#F59E0B]/50 bg-[#F59E0B]/10 text-[#B45309] shadow-[0_0_10px_rgba(245,158,11,0.2)]",
        destructive: "border-[#F87171]/50 bg-[#F87171]/10 text-[#DC2626] shadow-[0_0_10px_rgba(248,113,113,0.2)]",
        success: "border-[#6366F1]/60 bg-[#6366F1]/15 text-[#256F7A] shadow-[0_0_10px_rgba(99, 102, 241,0.25)]",
        purple: "border-[#B5A7FF]/60 bg-[#B5A7FF]/10 text-[#6B5B95] shadow-[0_0_10px_rgba(181,167,255,0.2)]",
        outline: "border-[#D4E0EC] bg-transparent backdrop-blur-sm text-[#4B5563] hover:border-[#6366F1]/50",
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
