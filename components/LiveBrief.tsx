"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import CompetitiveBreakdown from "@/components/CompetitiveBreakdown";
import PlatformLogo from "@/components/PlatformLogo";
import Theater, { prettySource, type SourceStatus, type TheaterStage } from "@/components/Theater";
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
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const riseIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/* Big, bold, Title-Case section heading with a mono kicker. */
function SectionHead({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-5">
      <p className="font-mono text-[11px] text-accent mb-1.5">{kicker}</p>
      <h2 className="text-[22px] sm:text-[27px] font-bold tracking-[-0.02em] leading-tight">
        {title}
      </h2>
      {sub && <p className="text-[13px] text-ink-soft mt-1.5">{sub}</p>}
    </div>
  );
}

function Divider() {
  return <div className="hairline-t mt-14 pt-10" />;
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
  const [typed, setTyped] = useState(false);
  useEffect(() => setTyped(false), [brief?.oneThing]);

  if (phase !== "scouting" && !brief) return null;

  const kpis: [string, number][] = brief
    ? [
        ["Signals Read", brief.signals],
        ["Themes Found", brief.themes.length],
        ["Competitors Analyzed", Math.max(brief.teardown.length, brief.competitive.battle_table?.length ?? 0)],
        ["Questions To Ask", brief.interview.length],
      ]
    : [];

  return (
    <section
      aria-label={`Research brief for ${product}`}
      className="hairline rounded-[14px] w-full max-w-6xl mx-auto overflow-hidden bg-surface/70 backdrop-blur-[2px]"
    >
      {/* header */}
      <header className="hairline-b flex items-baseline justify-between gap-4 px-6 py-4 sm:px-8 bg-surface/80">
        <h2 className="text-[16px] font-semibold">{product}</h2>
        <p className="font-mono text-[11px] text-ink-soft flex items-center gap-1.5 whitespace-nowrap shrink-0">
          {phase === "scouting" ? (
            <span className="text-accent breathe">{signals ? `${signals} signals…` : "scouting…"}</span>
          ) : (
            <>
              <span aria-hidden="true" className="inline-block size-[6px] rounded-full bg-accent" />
              Live · {brief!.signals} Signals
            </>
          )}
        </p>
      </header>

      {phase === "scouting" || !brief ? (
        <Theater stage={stage} roster={roster} statuses={statuses} elapsed={elapsed} live={live} />
      ) : (
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          {/* sources read — logos + names */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8"
          >
            <span className="font-mono text-[11px] text-ink-faint">Read From</span>
            {brief.sources.map((s, i) => {
              const label = prettySource(s);
              return (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: EASE }}
                  className="flex items-center gap-1.5 text-[12.5px] text-ink"
                >
                  <PlatformLogo name={label} className="size-[16px] text-accent" />
                  {label}
                </motion.span>
              );
            })}
          </motion.div>

          {/* KPI band */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map(([label, value], i) => (
              <motion.div key={label} variants={riseIn}>
                <Card className="px-5 py-4 hover:border-accent/40">
                  <p className="text-[28px] leading-none font-bold tabular-nums">
                    <CountUp value={value} delay={0.3 + i * 0.12} />
                  </p>
                  <p className="font-mono text-[10px] text-ink-faint mt-2">{label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* The One Thing */}
          <div className="mt-14">
            <p className="font-mono text-[11px] text-accent mb-2.5">The One Thing</p>
            <p className="text-[26px] sm:text-[32px] leading-[1.28] font-medium tracking-[-0.015em] max-w-[46ch] min-h-[2.2em]">
              <Typewriter key={brief.oneThing} text={brief.oneThing} delay={500} speed={16} onDone={() => setTyped(true)} />
            </p>
          </div>

          {/* Themes */}
          <motion.div variants={stagger} initial="hidden" animate={typed ? "show" : "hidden"} className="mt-14">
            <motion.div variants={riseIn}>
              <SectionHead kicker="What The Crowd Says" title="Themes" sub="Ranked by frequency × severity" />
            </motion.div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {brief.themes.map((t) => (
                <motion.article
                  key={t.title}
                  variants={riseIn}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="hairline rounded-[12px] p-4 bg-surface/60 group hover:border-accent/50 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[14px] font-semibold leading-snug flex items-baseline gap-2">
                      <span aria-hidden="true" className={`inline-block size-2 rounded-full shrink-0 translate-y-[-1px] ${DOT[t.sentiment]}`} />
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
                      <span className="font-mono text-[10px] text-ink-faint mr-1.5">Gap</span>
                      {t.gap}
                    </p>
                    <p className="text-accent">
                      <span className="font-mono text-[10px] text-ink-faint mr-1.5">Ask</span>
                      {t.ask}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* Interview Agenda — the centerpiece */}
          {brief.interview.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Divider />
              <SectionHead
                kicker="The Real Work"
                title="Interview Agenda"
                sub="The questions worth asking real users — each tied to the decision it unlocks."
              />
              <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                {brief.interview.map((q, i) => (
                  <motion.div
                    key={q.question}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % 2) * 0.05 + 0.05, duration: 0.4, ease: EASE }}
                    className="flex gap-4 group"
                  >
                    <span className="font-mono text-[13px] text-accent shrink-0 pt-0.5 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="hairline-l pl-4 group-hover:border-accent/60 transition-colors duration-300">
                      <p className="text-[15px] leading-relaxed">{q.question}</p>
                      {q.why && (
                        <p className="font-mono text-[10.5px] text-ink-faint mt-1.5 leading-relaxed opacity-80 group-hover:opacity-100 group-hover:text-accent transition-all duration-300">
                          → {q.why}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Deep-Research Targets */}
          {Object.values(brief.targets).some((v) => v.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Divider />
              <SectionHead kicker="Where To Dig Next" title="Deep-Research Targets" />
              <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {(
                  [
                    ["Key Players", brief.targets.key_players],
                    ["Switched From", brief.targets.switched_from],
                    ["Segments", brief.targets.segments],
                    ["Pains To Mine", brief.targets.pains_to_mine],
                  ] as const
                ).map(
                  ([label, items]) =>
                    items.length > 0 && (
                      <div key={label}>
                        <p className="font-mono text-[10.5px] text-ink-faint mb-2">{label}</p>
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
            </motion.div>
          )}

          {/* Pain Map */}
          {brief.pains.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Divider />
              <SectionHead kicker="Who Hurts, When, And What It Costs" title="Pain Map" />
              <div className="grid gap-3 lg:grid-cols-2">
                {brief.pains.map((p) => (
                  <motion.div key={p.pain} whileHover={{ y: -2 }} transition={{ duration: 0.25 }}>
                    <Card className="p-5 h-full hover:border-neg/40">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-[14px] font-semibold">{p.pain}</h3>
                        <Severity n={p.severity} />
                      </div>
                      <p className="text-[12.5px] text-ink-soft leading-relaxed mt-2.5">{p.detail}</p>
                      {p.quote && (
                        <blockquote className="hairline-l mt-3 pl-3 font-serif italic text-[12.5px] text-ink-soft leading-relaxed">
                          “{p.quote}”
                        </blockquote>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Competitive Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Divider />
            <SectionHead kicker="Strategy Class" title="Competitive Breakdown" />
            <CompetitiveBreakdown competitive={brief.competitive} teardown={brief.teardown} />
          </motion.div>
        </div>
      )}
    </section>
  );
}
