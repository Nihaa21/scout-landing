import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-[13.5px] font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(24,95,165,0.25),0_8px_20px_-8px_rgba(31,111,191,0.45)] hover:bg-accent-bright hover:shadow-[0_2px_4px_rgba(24,95,165,0.25),0_12px_26px_-8px_rgba(31,111,191,0.55)] active:scale-[0.98]",
        outline:
          "hairline bg-transparent text-ink hover:border-accent hover:text-accent",
        ghost: "text-ink-soft hover:text-ink hover:bg-surface",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-8 px-3 text-[12px]",
        lg: "h-11 px-6",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
