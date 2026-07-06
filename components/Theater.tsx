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

const STAGE_COPY: Record<TheaterStage, [string, string]> = {
  routing: ["Routing Sources", "Deciding where the signal lives for this subject"],
  gathering: ["Reading The Crowd", "Every selected platform, scraped in parallel"],
  synthesizing: ["Synthesizing Themes", "Clustering every voice into ranked signals"],
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
        : s === "skipped"
          ? "text-ink-faint"
          : "text-ink-faint";
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: s === "skipped" ? 0.4 : 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="flex items-center justify-between gap-6 py-3">
        <span className={`flex items-center gap-3 transition-colors duration-500 ${color}`}>
          <PlatformLogo name={name} className="size-[22px] sm:size-[24px] shrink-0" />
          <span
            className={`text-[19px] sm:text-[23px] ${
              s === "skipped" ? "line-through decoration-[0.5px]" : ""
            }`}
          >
            {name}
          </span>
        </span>
        <span className="font-mono text-[12px] whitespace-nowrap">
          {s === "done" && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-ink-soft">
              <span className="text-accent mr-1.5">✓</span>
              {status.count != null ? `${status.count} signals` : "read"}
            </motion.span>
          )}
          {s === "active" && <span className="text-accent breathe">reading…</span>}
          {s === "skipped" && <span className="text-ink-faint">skipped</span>}
          {s === "pending" && <span className="text-ink-faint">·</span>}
        </span>
      </div>
      <div className="hairline-b relative overflow-hidden">
        {s === "active" && (
          <span aria-hidden="true" className="scanline absolute bottom-[-0.5px] left-0 h-[1px] w-1/4 bg-accent" />
        )}
      </div>
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
    <div className="px-5 sm:px-7 py-16 sm:py-20 flex flex-col items-center text-center" role="status" aria-live="polite">
      {/* stage banner — big, centered */}
      <div className="mb-12 h-[74px] flex flex-col items-center justify-center">
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

      {/* platform roster — logo + name */}
      <ul className="w-full max-w-md text-left">
        {rows.map(({ name, status }) => (
          <Row key={name} name={name} status={status} />
        ))}
      </ul>

      {/* footer */}
      <div className="mt-12 font-mono text-[12px] text-ink-faint">
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
