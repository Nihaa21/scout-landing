"use client";

import CompetitiveBreakdown from "@/components/CompetitiveBreakdown";
import type { Brief, Sentiment } from "@/lib/brief";

export type Phase = "scouting" | "done";

const DOT: Record<Sentiment, string> = {
  positive: "bg-pos",
  mixed: "bg-mid",
  negative: "bg-neg",
};

function SourceStep({
  label,
  state,
}: {
  label: string;
  state: "todo" | "active" | "done";
}) {
  return (
    <li
      className={`font-mono text-[11px] tracking-wide flex items-center gap-1.5 transition-colors duration-300 ${
        state === "done"
          ? "text-ink"
          : state === "active"
            ? "text-accent breathe"
            : "text-ink-faint"
      }`}
    >
      <span aria-hidden="true" className={state === "done" ? "text-accent" : ""}>
        {state === "done" ? "✓" : "·"}
      </span>
      {label}
      {state === "done" && <span className="sr-only">— read</span>}
    </li>
  );
}

export default function LiveBrief({
  brief,
  phase,
  lit,
  sources,
  elapsed = 0,
  live = false,
  stage,
  signals,
}: {
  brief: Brief;
  phase: Phase;
  lit: number; // completed steps: sources 0..n, then teardown = n+1
  sources?: string[]; // source list to show in the row (real routed sources mid-run)
  elapsed?: number; // seconds since the run started (for the live loading state)
  live?: boolean; // true when calling the real agent (multi-minute)
  stage?: string; // current stage label, shown while scouting
  signals?: number; // running signal count while gathering
}) {
  const steps = [...(sources ?? brief.sources), "teardown…"];

  return (
    <section
      aria-label={`Research brief for ${brief.product}`}
      className="hairline rounded-[12px] w-full max-w-3xl mx-auto"
    >
      {/* header row */}
      <header className="hairline-b flex items-baseline justify-between gap-4 px-5 py-3.5 sm:px-7">
        <h2 className="text-[15px] font-medium">{brief.product}</h2>
        <p className="font-mono text-[11px] text-ink-soft flex items-center gap-1.5 whitespace-nowrap shrink-0">
          {phase === "scouting" ? (
            <span className="text-accent breathe">
              {signals ? `${signals} signals…` : "scouting…"}
            </span>
          ) : (
            <>
              <span
                aria-hidden="true"
                className="inline-block size-[6px] rounded-full bg-accent-bright"
              />
              live · {brief.signals} signals
            </>
          )}
        </p>
      </header>

      {/* sources row */}
      <ul
        aria-label="Sources"
        className="hairline-b flex flex-wrap gap-x-5 gap-y-1.5 px-5 py-3 sm:px-7"
      >
        {steps.map((s, i) => (
          <SourceStep
            key={s}
            label={s}
            state={
              phase === "done"
                ? "done"
                : i < lit
                  ? "done"
                  : i === lit
                    ? "active"
                    : "todo"
            }
          />
        ))}
      </ul>

      {/* body */}
      {phase === "done" ? (
        <div className="px-5 py-6 sm:px-7 sm:py-8">
          {/* the one thing */}
          <div className="rise" style={{ "--d": "0s" } as React.CSSProperties}>
            <p className="font-mono text-[11px] text-accent mb-2">the one thing</p>
            <p className="text-[22px] sm:text-[26px] leading-snug font-normal max-w-[36ch]">
              {brief.oneThing}
            </p>
          </div>

          {/* themes */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {brief.themes.map((t, i) => (
              <article
                key={t.title}
                className="hairline rounded-[12px] p-4 rise"
                style={{ "--d": `${0.12 + i * 0.08}s` } as React.CSSProperties}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[13.5px] font-medium leading-snug flex items-baseline gap-2">
                    <span
                      aria-hidden="true"
                      className={`inline-block size-2 rounded-full shrink-0 translate-y-[-1px] ${DOT[t.sentiment]}`}
                    />
                    <span className="sr-only">{t.sentiment} theme:</span>
                    {t.title}
                  </h3>
                  <span className="font-mono text-[11px] text-ink-faint whitespace-nowrap">
                    ×{t.mentions}
                  </span>
                </div>
                <blockquote className="hairline-l mt-3 pl-3 font-serif italic text-[13.5px] text-ink-soft leading-relaxed">
                  “{t.quote}”
                </blockquote>
                <details className="gapask mt-3">
                  <summary className="font-mono text-[11px] text-ink-faint hover:text-ink transition-colors">
                    gap → ask
                  </summary>
                  <div className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed">
                    <p>
                      <span className="font-mono text-[11px] text-ink-faint mr-1.5">gap</span>
                      {t.gap}
                    </p>
                    <p className="text-accent">
                      <span className="font-mono text-[11px] text-ink-faint mr-1.5">ask</span>
                      {t.ask}
                    </p>
                  </div>
                </details>
              </article>
            ))}
          </div>

          {/* interview agenda */}
          {brief.interview.length > 0 && (
            <div className="mt-10 rise" style={{ "--d": "0.5s" } as React.CSSProperties}>
              <p className="font-mono text-[11px] text-ink-soft mb-3">
                interview agenda — ask a human
              </p>
              <ol className="space-y-2.5">
                {brief.interview.map((q, i) => (
                  <li key={q.question} className="flex gap-3 text-[13px] leading-relaxed">
                    <span className="font-mono text-[11px] text-accent shrink-0 translate-y-[1px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="font-medium">{q.title}.</span>{" "}
                      <span className="text-ink-soft">{q.question}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* deep-research targets */}
          {Object.values(brief.targets).some((v) => v.length > 0) && (
            <div className="mt-10 rise" style={{ "--d": "0.56s" } as React.CSSProperties}>
              <p className="font-mono text-[11px] text-ink-soft mb-3">
                deep-research targets
              </p>
              <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {(
                  [
                    ["key players", brief.targets.key_players],
                    ["switched from", brief.targets.switched_from],
                    ["segments", brief.targets.segments],
                    ["pains to mine", brief.targets.pains_to_mine],
                  ] as const
                ).map(
                  ([label, items]) =>
                    items.length > 0 && (
                      <div key={label}>
                        <p className="font-mono text-[10px] text-ink-faint mb-1.5">{label}</p>
                        <ul className="flex flex-wrap gap-1.5">
                          {items.map((item) => (
                            <li
                              key={item}
                              className="hairline rounded-full px-2.5 py-0.5 text-[11.5px] text-ink-soft"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ),
                )}
              </div>
            </div>
          )}

          {/* competitive breakdown — the MBA layer */}
          <div className="mt-10 rise" style={{ "--d": "0.62s" } as React.CSSProperties}>
            <div className="hairline-t pt-6">
              <p className="font-mono text-[11px] text-accent mb-5">
                competitive breakdown
              </p>
              <CompetitiveBreakdown
                competitive={brief.competitive}
                teardown={brief.teardown}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="px-5 py-16 sm:px-7 text-center"
          role="status"
          aria-live="polite"
        >
          <p className="font-mono text-[11px] text-ink-faint breathe">
            {stage ?? "reading sources…"}
          </p>
          {live && (
            <p className="font-mono text-[11px] text-ink-faint mt-3 leading-relaxed">
              scout is doing live research — this takes a few minutes
              {elapsed > 0 && (
                <>
                  {" "}
                  · <span className="text-ink-soft">{elapsed}s</span>
                </>
              )}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
