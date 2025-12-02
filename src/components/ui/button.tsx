import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "success-gradient text-background rounded-full hover:scale-105 shadow-[0_0_22px_rgba(34,243,255,0.45)] hover:shadow-[0_0_30px_rgba(34,243,255,0.75)]",
        primary: "success-gradient text-background rounded-full hover:scale-105 shadow-[0_0_22px_rgba(34,243,255,0.45)] hover:shadow-[0_0_30px_rgba(34,243,255,0.75)]",
        destructive: "danger-gradient text-white rounded-full hover:scale-105 shadow-[0_0_20px_rgba(239,68,68,0.4)]",
        outline: "border border-border-glass bg-transparent backdrop-blur-sm hover:bg-card/50 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(34,243,255,0.2)] rounded-full",
        secondary: "bg-card/60 backdrop-blur-sm border border-border-glass text-foreground hover:bg-card/80 hover:border-primary/30 rounded-full",
        ghost: "hover:bg-card/50 hover:backdrop-blur-sm rounded-full",
        link: "text-primary underline-offset-4 hover:underline",
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
