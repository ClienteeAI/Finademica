import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#4DE2E8] to-[#2FB3C6] text-white rounded-full hover:scale-105 shadow-[0_0_18px_rgba(77,226,232,0.45)] hover:shadow-[0_0_30px_rgba(77,226,232,0.65)]",
        primary: "bg-gradient-to-r from-[#4DE2E8] to-[#2FB3C6] text-white rounded-full hover:scale-105 shadow-[0_0_18px_rgba(77,226,232,0.45)] hover:shadow-[0_0_30px_rgba(77,226,232,0.65)]",
        destructive: "danger-gradient text-white rounded-full hover:scale-105 shadow-[0_0_20px_rgba(248,113,113,0.4)]",
        outline: "border border-[#4DE2E8]/50 bg-white/60 backdrop-blur-sm text-[#4DE2E8] hover:bg-[#4DE2E8]/10 hover:border-[#4DE2E8] hover:shadow-[0_0_15px_rgba(77,226,232,0.25)] rounded-full",
        secondary: "bg-white/70 backdrop-blur-sm border border-[#D4E0EC] text-[#4B5563] hover:bg-white/90 hover:border-[#4DE2E8]/40 rounded-full",
        ghost: "hover:bg-white/50 hover:backdrop-blur-sm text-[#4B5563] rounded-full",
        link: "text-[#1D3557] underline-offset-4 hover:underline hover:text-[#4DE2E8]",
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
