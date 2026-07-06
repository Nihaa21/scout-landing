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

function SectionLabel({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <p className={`font-mono text-[11px] mb-3 ${accent ? "text-accent" : "text-ink-soft"}`}>
      {children}
    </p>
  );
}

/* severity as five small squares, filled in the negative red */
function Severity({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-[3px]" aria-label={`severity ${n} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`size-[7px] rounded-[2px] ${i < n ? "bg-neg" : "bg-ink/10"}`}
        />
      ))}
    </span>
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
  lit: number;
  sources?: string[];
  elapsed?: number;
  live?: boolean;
  stage?: string;
  signals?: number;
}) {
  const steps = [...(sources ?? brief.sources), "teardown…"];

  const kpis: [string, string | number][] = [
    ["signals read", brief.signals],
    ["themes found", brief.themes.length],
    ["competitors analyzed", Math.max(brief.teardown.length, brief.competitive.battle_table?.length ?? 0)],
    ["questions to ask", brief.interview.length],
  ];

  return (
    <section
      aria-label={`Research brief for ${brief.product}`}
      className="hairline rounded-[12px] w-full max-w-6xl mx-auto"
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
              phase === "done" ? "done" : i < lit ? "done" : i === lit ? "active" : "todo"
            }
          />
        ))}
      </ul>

      {phase === "done" ? (
        <div className="px-5 py-6 sm:px-7 sm:py-8">
          {/* KPI band */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 rise"
            style={{ "--d": "0s" } as React.CSSProperties}>
            {kpis.map(([label, value]) => (
              <div key={label} className="hairline rounded-[12px] px-5 py-4">
                <p className="text-[24px] leading-none font-medium">{value}</p>
                <p className="font-mono text-[10px] text-ink-faint mt-1.5">{label}</p>
              </div>
            ))}
          </div>

          {/* the one thing */}
          <div className="mt-9 rise" style={{ "--d": "0.06s" } as React.CSSProperties}>
            <SectionLabel accent>the one thing</SectionLabel>
            <p className="text-[24px] sm:text-[28px] leading-snug font-normal max-w-[44ch]">
              {brief.oneThing}
            </p>
          </div>

          {/* main grid: themes + rail */}
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] rise"
            style={{ "--d": "0.12s" } as React.CSSProperties}>
            {/* MAIN — themes, gap→ask always visible */}
            <div>
              <SectionLabel>themes — ranked by frequency × severity</SectionLabel>
              <div className="grid gap-3 xl:grid-cols-2">
                {brief.themes.map((t) => (
                  <article key={t.title} className="hairline rounded-[12px] p-4">
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
                    <blockquote className="hairline-l mt-3 pl-3 font-serif italic text-[13px] text-ink-soft leading-relaxed">
                      “{t.quote}”
                    </blockquote>
                    <div className="mt-3 space-y-1.5 text-[12.5px] leading-relaxed hairline-t pt-3">
                      <p>
                        <span className="font-mono text-[10px] text-ink-faint mr-1.5">gap</span>
                        {t.gap}
                      </p>
                      <p className="text-accent">
                        <span className="font-mono text-[10px] text-ink-faint mr-1.5">ask</span>
                        {t.ask}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* RAIL — interview agenda + targets */}
            <aside className="space-y-8 lg:pl-8 lg:border-l-[0.5px] lg:border-[var(--color-hairline)]">
              {brief.interview.length > 0 && (
                <div>
                  <SectionLabel accent>interview agenda</SectionLabel>
                  <ol className="space-y-3.5">
                    {brief.interview.map((q, i) => (
                      <li key={q.question} className="flex gap-2.5">
                        <span className="font-mono text-[10px] text-accent shrink-0 translate-y-[2px]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="text-[12.5px] leading-relaxed">{q.question}</p>
                          {q.why && (
                            <p className="font-mono text-[10px] text-ink-faint mt-1 leading-relaxed">
                              → {q.why}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {Object.values(brief.targets).some((v) => v.length > 0) && (
                <div className="space-y-4">
                  <SectionLabel>deep-research targets</SectionLabel>
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
                                className="hairline rounded-full px-2.5 py-0.5 text-[11px] text-ink-soft"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ),
                  )}
                </div>
              )}
            </aside>
          </div>

          {/* pain map — the real scout */}
          {brief.pains.length > 0 && (
            <div className="mt-12 rise" style={{ "--d": "0.18s" } as React.CSSProperties}>
              <div className="hairline-t pt-6">
                <SectionLabel accent>pain map — who hurts, when, and what it costs</SectionLabel>
                <div className="grid gap-3 lg:grid-cols-2">
                  {brief.pains.map((p) => (
                    <article key={p.pain} className="hairline rounded-[12px] p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-[13.5px] font-medium">{p.pain}</h3>
                        <Severity n={p.severity} />
                      </div>
                      <p className="text-[12.5px] text-ink-soft leading-relaxed mt-2.5">
                        {p.detail}
                      </p>
                      {p.quote && (
                        <blockquote className="hairline-l mt-3 pl-3 font-serif italic text-[12.5px] text-ink-soft leading-relaxed">
                          “{p.quote}”
                        </blockquote>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* competitive breakdown */}
          <div className="mt-12 rise" style={{ "--d": "0.24s" } as React.CSSProperties}>
            <div className="hairline-t pt-6">
              <SectionLabel accent>competitive breakdown</SectionLabel>
              <CompetitiveBreakdown competitive={brief.competitive} teardown={brief.teardown} />
            </div>
          </div>
        </div>
      ) : (
        <div className="px-5 py-16 sm:px-7 text-center" role="status" aria-live="polite">
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
