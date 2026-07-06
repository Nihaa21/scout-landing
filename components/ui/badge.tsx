import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "hairline text-ink-soft hover:text-ink hover:border-accent/50",
        accent: "bg-accent-deep/30 text-accent-bright",
        mono: "hairline font-mono text-[10px] text-ink-faint",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
