import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white rounded-full hover:scale-105 shadow-[0_0_18px_rgba(99, 102, 241,0.45)] hover:shadow-[0_0_30px_rgba(99, 102, 241,0.65)]",
        primary: "bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white rounded-full hover:scale-105 shadow-[0_0_18px_rgba(99, 102, 241,0.45)] hover:shadow-[0_0_30px_rgba(99, 102, 241,0.65)]",
        destructive: "danger-gradient text-white rounded-full hover:scale-105 shadow-[0_0_20px_rgba(248,113,113,0.4)]",
        outline: "border border-[#6366F1]/50 bg-white/60 backdrop-blur-sm text-[#6366F1] hover:bg-[#6366F1]/10 hover:border-[#6366F1] hover:shadow-[0_0_15px_rgba(99, 102, 241,0.25)] rounded-full",
        secondary: "bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-white/20 hover:border-white/40 rounded-full",
        ghost: "hover:bg-white/10 hover:backdrop-blur-sm text-white/60 hover:text-white rounded-full",
        link: "text-foreground/60 underline-offset-4 hover:underline hover:text-[#6366F1]",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-full px-4",
        lg: "h-14 rounded-full px-10 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
