"use client";

import { useEffect, useState } from "react";

/** Types text in character by character, honoring reduced-motion. */
export default function Typewriter({
  text,
  speed = 18,
  delay = 250,
  className,
  onDone,
}: {
  text: string;
  speed?: number; // ms per character
  delay?: number; // ms before starting
  className?: string;
  onDone?: () => void;
}) {
  const [n, setN] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setN(0);
    setStarted(false);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setN(text.length);
      setStarted(true);
      onDone?.();
      return;
    }
    const t0 = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    if (!started || n >= text.length) {
      if (started && n >= text.length) onDone?.();
      return;
    }
    const t = setTimeout(() => setN((v) => v + 1), speed);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, n, text]);

  const done = n >= text.length;
  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      {!done && (
        <span aria-hidden="true" className="caret text-accent">
          ▍
        </span>
      )}
    </span>
  );
}
