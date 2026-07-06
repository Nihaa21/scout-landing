"use client";

import { AnimatePresence, motion } from "motion/react";

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

/* Everything Scout knows how to read — shown while the router decides. */
const CANDIDATES = ["hacker news", "reddit", "youtube", "app store", "bluesky", "open web"];

export const prettySource = (s: string): string =>
  ({ hackernews: "hacker news", appstore: "app store", web: "open web" } as Record<string, string>)[s] ?? s;

const STAGE_COPY: Record<TheaterStage, [string, string]> = {
  routing: ["routing sources", "deciding where the signal lives for this subject"],
  gathering: ["reading the crowd", "every selected platform, scraped in parallel"],
  synthesizing: ["synthesizing themes", "clustering every voice into ranked signals"],
  teardown: ["tearing down competitors", "G2 · Capterra · pricing pages · news"],
  competitive: ["building the strategy", "positioning · five forces · whitespace · your first 90 days"],
};

function Row({ name, status }: { name: string; status: SourceStatus }) {
  const s = status.state;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: s === "skipped" ? 0.3 : 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="flex items-baseline justify-between gap-6 py-2.5">
        <span
          className={`text-[17px] sm:text-[20px] transition-colors duration-500 ${
            s === "done"
              ? "text-ink"
              : s === "active"
                ? "text-accent"
                : s === "skipped"
                  ? "text-ink-faint line-through decoration-[0.5px]"
                  : "text-ink-faint"
          }`}
        >
          {name}
        </span>
        <span className="font-mono text-[11px] whitespace-nowrap">
          {s === "done" && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-ink-soft"
            >
              <span className="text-accent mr-1.5">✓</span>
              {status.count != null ? `${status.count} signals` : "read"}
            </motion.span>
          )}
          {s === "active" && <span className="text-accent breathe">reading…</span>}
          {s === "skipped" && <span className="text-ink-faint">skipped</span>}
          {s === "pending" && <span className="text-ink-faint">·</span>}
        </span>
      </div>
      {/* scanning line under active rows */}
      <div className="hairline-b relative overflow-hidden">
        {s === "active" && (
          <span
            aria-hidden="true"
            className="scanline absolute bottom-[-0.5px] left-0 h-[1px] w-1/4 bg-accent"
          />
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
  roster: string[] | null; // null until the router reports
  statuses: Record<string, SourceStatus>;
  elapsed: number;
  live: boolean;
}) {
  const names = roster
    ? [...new Set([...CANDIDATES.filter((c) => roster.includes(c)), ...roster])]
    : CANDIDATES;
  // While routing: show every candidate, dim. After: chosen + skipped.
  const rows = (roster ? CANDIDATES : CANDIDATES).map((name) => {
    if (!roster) return { name, status: { state: "pending" } as SourceStatus };
    if (!roster.includes(name))
      return { name, status: { state: "skipped" } as SourceStatus };
    return { name, status: statuses[name] ?? ({ state: "active" } as SourceStatus) };
  });
  void names;

  const [title, sub] = STAGE_COPY[stage];

  return (
    <div className="px-5 sm:px-7 py-14 sm:py-16 flex flex-col items-center" role="status" aria-live="polite">
      <div className="w-full max-w-md">
        {/* stage banner */}
        <div className="text-center mb-10 h-[54px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-[12px] text-accent">
                {title}
                <span className="breathe">…</span>
              </p>
              <p className="font-mono text-[10.5px] text-ink-faint mt-1.5">{sub}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* platform roster */}
        <ul>
          {rows.map(({ name, status }) => (
            <Row key={name} name={name} status={status} />
          ))}
        </ul>

        {/* footer line */}
        <div className="mt-10 text-center font-mono text-[10.5px] text-ink-faint">
          {live ? (
            <>
              live research in progress
              {elapsed > 0 && <span className="text-ink-soft"> · {elapsed}s</span>}
            </>
          ) : (
            "demo replay"
          )}
        </div>
      </div>
    </div>
  );
}
