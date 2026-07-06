"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import CompetitiveBreakdown from "@/components/CompetitiveBreakdown";
import Theater, { type SourceStatus, type TheaterStage } from "@/components/Theater";
import CountUp from "@/components/motion/CountUp";
import Typewriter from "@/components/motion/Typewriter";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Brief, Sentiment } from "@/lib/brief";

export type Phase = "scouting" | "done";

const DOT: Record<Sentiment, string> = {
  positive: "bg-pos",
  mixed: "bg-mid",
  negative: "bg-neg",
};

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const riseIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

function SectionLabel({
  children,
  accent = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <p className={`font-mono text-[11px] mb-3 ${accent ? "text-accent" : "text-ink-soft"}`}>
      {children}
    </p>
  );
}

function Severity({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-[3px]" aria-label={`severity ${n} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + i * 0.06, duration: 0.3, ease: EASE }}
          className={`size-[7px] rounded-[2px] origin-bottom ${i < n ? "bg-neg" : "bg-ink/15"}`}
        />
      ))}
    </span>
  );
}

export default function LiveBrief({
  product,
  brief,
  phase,
  roster,
  statuses,
  stage,
  signals,
  elapsed = 0,
  live = false,
}: {
  product: string;
  brief: Brief | null;
  phase: Phase;
  roster: string[] | null;
  statuses: Record<string, SourceStatus>;
  stage: TheaterStage;
  signals: number;
  elapsed?: number;
  live?: boolean;
}) {
  // Assembly gate: theme grid waits for "the one thing" to finish typing.
  const [typed, setTyped] = useState(false);
  useEffect(() => setTyped(false), [brief?.oneThing]);

  if (phase !== "scouting" && !brief) return null;

  const kpis: [string, number][] = brief
    ? [
        ["signals read", brief.signals],
        ["themes found", brief.themes.length],
        ["competitors analyzed", Math.max(brief.teardown.length, brief.competitive.battle_table?.length ?? 0)],
        ["questions to ask", brief.interview.length],
      ]
    : [];

  return (
    <section
      aria-label={`Research brief for ${product}`}
      className="hairline rounded-[12px] w-full max-w-6xl mx-auto overflow-hidden"
    >
      {/* header row */}
      <header className="hairline-b flex items-baseline justify-between gap-4 px-5 py-3.5 sm:px-7 bg-surface/50">
        <h2 className="text-[15px] font-medium">{product}</h2>
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
              live · {brief!.signals} signals
            </>
          )}
        </p>
      </header>

      {phase === "scouting" || !brief ? (
        <Theater stage={stage} roster={roster} statuses={statuses} elapsed={elapsed} live={live} />
      ) : (
        <div className="px-5 py-6 sm:px-7 sm:py-8">
          {/* sources strip */}
          <motion.ul
            aria-label="Sources read"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-x-5 gap-y-1.5 mb-7"
          >
            {brief.sources.map((s, i) => (
              <motion.li
                key={s}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12, duration: 0.4, ease: EASE }}
                className="font-mono text-[11px] text-ink flex items-center gap-1.5"
              >
                <span className="text-accent">✓</span>
                {s}
              </motion.li>
            ))}
          </motion.ul>

          {/* KPI band — numbers count up */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {kpis.map(([label, value], i) => (
              <motion.div key={label} variants={riseIn}>
                <Card className="px-5 py-4 hover:border-accent/40">
                  <p className="text-[24px] leading-none font-medium tabular-nums">
                    <CountUp value={value} delay={0.3 + i * 0.12} />
                  </p>
                  <p className="font-mono text-[10px] text-ink-faint mt-1.5">{label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* the one thing — types itself in */}
          <div className="mt-10">
            <SectionLabel accent>the one thing</SectionLabel>
            <p className="text-[24px] sm:text-[28px] leading-snug font-normal max-w-[44ch] min-h-[2.4em]">
              <Typewriter
                key={brief.oneThing}
                text={brief.oneThing}
                delay={500}
                speed={16}
                onDone={() => setTyped(true)}
              />
            </p>
          </div>

          {/* main grid: themes + rail — assembles after the one thing lands */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={typed ? "show" : "hidden"}
            className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]"
          >
            <div>
              <motion.div variants={riseIn}>
                <SectionLabel>themes — ranked by frequency × severity</SectionLabel>
              </motion.div>
              <div className="grid gap-3 xl:grid-cols-2">
                {brief.themes.map((t) => (
                  <motion.article
                    key={t.title}
                    variants={riseIn}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="hairline rounded-[12px] p-4 bg-surface/40 group hover:border-accent/50 transition-colors duration-300"
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
                      <span className="font-mono text-[11px] text-ink-faint whitespace-nowrap group-hover:text-accent transition-colors duration-300">
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
                  </motion.article>
                ))}
              </div>
            </div>

            {/* rail */}
            <motion.aside
              variants={riseIn}
              className="space-y-8 lg:pl-8 lg:border-l-[0.5px] lg:border-[var(--color-hairline)]"
            >
              {brief.interview.length > 0 && (
                <div>
                  <SectionLabel accent>interview agenda</SectionLabel>
                  <ol className="space-y-3.5">
                    {brief.interview.map((q, i) => (
                      <li key={q.question} className="flex gap-2.5 group">
                        <span className="font-mono text-[10px] text-accent shrink-0 translate-y-[2px]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="text-[12.5px] leading-relaxed">{q.question}</p>
                          {q.why && (
                            <p className="font-mono text-[10px] text-ink-faint mt-1 leading-relaxed opacity-70 group-hover:opacity-100 group-hover:text-ink-soft transition-all duration-300">
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
                              <li key={item}>
                                <Badge>{item}</Badge>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ),
                  )}
                </div>
              )}
            </motion.aside>
          </motion.div>

          {/* pain map */}
          {brief.pains.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-12"
            >
              <div className="hairline-t pt-6">
                <SectionLabel accent>pain map — who hurts, when, and what it costs</SectionLabel>
                <div className="grid gap-3 lg:grid-cols-2">
                  {brief.pains.map((p) => (
                    <motion.div key={p.pain} whileHover={{ y: -2 }} transition={{ duration: 0.25 }}>
                      <Card className="p-4 sm:p-5 h-full hover:border-neg/40">
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
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* competitive breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-12"
          >
            <div className="hairline-t pt-6">
              <SectionLabel accent>competitive breakdown</SectionLabel>
              <CompetitiveBreakdown competitive={brief.competitive} teardown={brief.teardown} />
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
