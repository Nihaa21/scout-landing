"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";

/** Counts a number up from 0 when it scrolls into view. */
export default function CountUp({
  value,
  duration = 1.1,
  delay = 0,
  className,
}: {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      ref.current.textContent = String(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, value, duration, delay]);

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      0
    </span>
  );
}
