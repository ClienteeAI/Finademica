import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all duration-250",
  {
    variants: {
      variant: {
        default: "border-[#E4C776]/60 bg-[#E4C776]/10 text-[#1E1E1F] shadow-[0_0_10px_rgba(228,199,118,0.2)]",
        secondary: "border-[#DBE6F0] bg-white/50 backdrop-blur-sm text-[#4A4A4A]",
        info: "border-[#DBE6F0] bg-[#DBE6F0]/20 text-[#4A4A4A] shadow-[0_0_10px_rgba(219,230,240,0.3)]",
        warning: "border-[#E4C776]/60 bg-[#E4C776]/15 text-[#1E1E1F] shadow-[0_0_10px_rgba(228,199,118,0.3)]",
        destructive: "border-error/50 bg-error/10 text-error shadow-[0_0_10px_rgba(239,68,68,0.2)]",
        success: "border-[#E4C776]/70 bg-[#E4C776]/15 text-[#1E1E1F] shadow-[0_0_10px_rgba(228,199,118,0.3)]",
        purple: "border-[#D4A5A5]/60 bg-[#D4A5A5]/10 text-[#8B6B6B] shadow-[0_0_10px_rgba(212,165,165,0.2)]",
        outline: "border-[#DBE6F0] bg-transparent backdrop-blur-sm text-[#4A4A4A] hover:border-[#E4C776]/50",
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