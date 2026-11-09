"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Honor the OS reduced-motion setting for every `motion` tree. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
