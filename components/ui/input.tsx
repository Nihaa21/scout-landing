import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "hairline flex h-10 w-full rounded-[10px] bg-surface/60 px-4 text-[14px] text-ink placeholder:text-ink-faint transition-colors duration-200 focus:outline-none focus:border-accent focus-visible:ring-1 focus-visible:ring-ring/40 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
