"use client";

import { AnimatePresence, motion } from "motion/react";
import PlatformLogo from "@/components/PlatformLogo";

export type TheaterStage =
  | "routing"
  | "gathering"
  | "synthesizing"
  | "teardown"
  | "competitive";

export interface SourceStatus {
  state: "pending" | "active" | "done" | "skipped";
  count?: number;
}

/* Everything Scout reads — Reddit is off (OAuth-gated), so it's not shown. */
const CANDIDATES = ["hacker news", "youtube", "app store", "bluesky", "open web"];

export const prettySource = (s: string): string =>
  ({ hackernews: "hacker news", appstore: "app store", web: "open web" } as Record<string, string>)[s] ?? s;

/* "hacker news" → "Hacker News" (display only; logic keys stay lowercase). */
const titleCase = (s: string): string => s.replace(/\b\w/g, (c) => c.toUpperCase());

const EASE = [0.16, 1, 0.3, 1] as const;

const STAGE_COPY: Record<TheaterStage, [string, string]> = {
  routing: ["Routing Sources", "Deciding where the signal lives for this subject"],
  gathering: ["Reading The Crowd", "Every selected platform, scraped in parallel"],
  synthesizing: ["Synthesizing Signals", "Clustering every voice into ranked signals"],
  teardown: ["Tearing Down Competitors", "G2 · Capterra · pricing pages · news"],
  competitive: ["Building The Strategy", "Positioning · five forces · whitespace · your first 90 days"],
};

function Row({ name, status }: { name: string; status: SourceStatus }) {
  const s = status.state;
  const color =
    s === "done"
      ? "text-ink"
      : s === "active"
        ? "text-accent"
        : "text-ink-faint";
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: s === "skipped" ? 0.35 : 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="relative"
    >
      <div
        className={`flex items-center justify-between gap-6 rounded-[11px] px-3 py-2.5 my-0.5 transition-all duration-500 ${
          s === "active" ? "row-glow hairline border-accent/30" : "border-[0.5px] border-transparent"
        }`}
      >
        <span className={`flex items-center gap-3.5 transition-colors duration-500 ${color}`}>
          {/* logo — colorful, with a pulsing halo while active */}
          <span className="relative grid place-items-center shrink-0 size-[26px] sm:size-[28px]">
            {s === "active" && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-accent/15"
                animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <motion.span
              animate={s === "active" ? { scale: [1, 1.12, 1] } : { scale: 1 }}
              transition={{ duration: 1.6, repeat: s === "active" ? Infinity : 0, ease: "easeInOut" }}
              className={`grid place-items-center ${s === "pending" ? "opacity-45 saturate-0" : ""} ${
                s === "skipped" ? "opacity-40 saturate-0" : ""
              }`}
            >
              <PlatformLogo name={name} colored className="size-[22px] sm:size-[24px]" />
            </motion.span>
          </span>
          <span
            className={`text-[19px] sm:text-[23px] font-medium tracking-[-0.01em] ${
              s === "skipped" ? "line-through decoration-[0.5px]" : ""
            }`}
          >
            {titleCase(name)}
          </span>
        </span>
        <span className="font-mono text-[12px] whitespace-nowrap">
          {s === "done" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className="inline-flex items-center gap-1.5 text-ink-soft"
            >
              <span className="grid place-items-center size-[16px] rounded-full bg-pos/15 text-pos text-[10px]">✓</span>
              {status.count != null ? (
                <span className="text-accent font-semibold tabular-nums">{status.count}</span>
              ) : null}
              {status.count != null ? " signals" : "read"}
            </motion.span>
          )}
          {s === "active" && (
            <span className="text-accent">
              reading
              <motion.span
                aria-hidden="true"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                …
              </motion.span>
            </span>
          )}
          {s === "skipped" && <span className="text-ink-faint">skipped</span>}
          {s === "pending" && <span className="text-ink-faint">queued</span>}
        </span>
      </div>
      {s === "active" && (
        <div className="mx-3 relative h-[1.5px] overflow-hidden rounded-full bg-accent/10">
          <span aria-hidden="true" className="scanline absolute inset-y-0 left-0 w-1/3 rounded-full bg-accent" />
        </div>
      )}
    </motion.li>
  );
}

export default function Theater({
  stage,
  roster,
  statuses,
  elapsed,
  live,
}: {
  stage: TheaterStage;
  roster: string[] | null;
  statuses: Record<string, SourceStatus>;
  elapsed: number;
  live: boolean;
}) {
  const rows = CANDIDATES.map((name) => {
    if (!roster) return { name, status: { state: "pending" } as SourceStatus };
    if (!roster.includes(name)) return { name, status: { state: "skipped" } as SourceStatus };
    return { name, status: statuses[name] ?? ({ state: "active" } as SourceStatus) };
  });

  const [title, sub] = STAGE_COPY[stage];

  return (
    <div className="pt-5 pb-16 sm:pb-20 flex flex-col items-center text-center w-full" role="status" aria-live="polite">
      {/* stage banner — sits right below the subject header, above the line */}
      <div className="px-5 sm:px-7 mb-8 min-h-[74px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[24px] sm:text-[30px] font-semibold tracking-[-0.01em] text-accent">
              {title}
              <span className="breathe">…</span>
            </p>
            <p className="font-mono text-[12px] sm:text-[13px] text-ink-faint mt-2">{sub}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* horizontal line — after the header cluster, before the roster */}
      <div className="hairline-b w-full mb-12" />

      {/* platform roster — logo + name */}
      <ul className="w-full max-w-md text-left px-5 sm:px-7">
        {rows.map(({ name, status }) => (
          <Row key={name} name={name} status={status} />
        ))}
      </ul>

      {/* footer */}
      <div className="mt-12 px-5 sm:px-7 font-mono text-[12px] text-ink-faint">
        {live ? (
          <>
            Live research in progress
            {elapsed > 0 && <span className="text-ink-soft"> · {elapsed}s</span>}
          </>
        ) : (
          "Demo replay"
        )}
      </div>
    </div>
  );
}
