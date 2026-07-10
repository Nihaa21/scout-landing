import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "hairline flex h-11 w-full rounded-[11px] bg-surface/80 elev-1 px-4 text-[14px] text-ink placeholder:text-ink-faint transition-all duration-200 focus:outline-none focus:border-accent focus:bg-surface focus-visible:ring-2 focus-visible:ring-accent/25 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
