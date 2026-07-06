"use client";

import { motion } from "motion/react";
import CompetitiveBreakdown from "@/components/CompetitiveBreakdown";
import DownloadPdf from "@/components/DownloadPdf";
import PlatformLogo from "@/components/PlatformLogo";
import Theater, { prettySource, type SourceStatus, type TheaterStage } from "@/components/Theater";
import CountUp from "@/components/motion/CountUp";
import { Card } from "@/components/ui/card";
import type { Brief, Sentiment } from "@/lib/brief";

export type Phase = "scouting" | "done";

const SENTIMENT: Record<Sentiment, { emoji: string; color: string }> = {
  positive: { emoji: "🟢", color: "text-pos" },
  mixed: { emoji: "🟡", color: "text-mid" },
  negative: { emoji: "🔴", color: "text-neg" },
  neutral: { emoji: "⚪", color: "text-ink-soft" },
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
      <p className="font-mono text-[12.5px] font-semibold tracking-[0.02em] text-accent mb-2">{kicker}</p>
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
  if (phase !== "scouting" && !brief) return null;

  // Always show the subject with a capitalized first letter.
  const displayProduct = product ? product[0].toUpperCase() + product.slice(1) : product;

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
      aria-label={`Research brief for ${displayProduct}`}
      className="print-root hairline rounded-[14px] w-full max-w-6xl mx-auto overflow-hidden bg-surface/70 backdrop-blur-[2px]"
    >
      {/* header — product centered + prominent live/signals */}
      <header
        className={`relative px-6 py-7 sm:px-8 bg-surface/80 ${
          phase === "scouting" ? "text-center" : "hairline-b pr-32 sm:pr-40"
        }`}
      >
        {phase !== "scouting" && brief && (
          <div className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2">
            <DownloadPdf />
          </div>
        )}
        <h2 className="text-[26px] sm:text-[34px] font-bold tracking-[-0.02em] leading-none">
          {displayProduct}
        </h2>
        <div className={`mt-3.5 flex ${phase === "scouting" ? "justify-center" : "justify-start"}`}>
          {phase === "scouting" ? (
            <span className="inline-flex items-center gap-2 rounded-full hairline px-3.5 py-1 font-mono text-[12px]">
              <span aria-hidden="true" className="size-[7px] rounded-full bg-accent breathe" />
              <span className="text-accent">
                {signals ? (
                  <>
                    <span className="font-semibold">{signals}</span> signals…
                  </>
                ) : (
                  "scouting…"
                )}
              </span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-deep/10 px-4 py-1.5">
              <span aria-hidden="true" className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent ping-ring" />
                <span className="relative inline-flex size-2 rounded-full bg-accent blink" />
              </span>
              <span className="font-mono text-[12px] text-ink-soft">Live</span>
              <span className="font-mono text-[12px] text-ink-faint">·</span>
              <span className="text-[16px] font-bold text-accent tabular-nums leading-none">
                {brief!.signals}
              </span>
              <span className="font-mono text-[12px] text-ink-soft">Signals</span>
            </span>
          )}
        </div>
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
            <span className="font-mono text-[11px] font-semibold text-ink-soft">Read From</span>
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
                  <PlatformLogo name={label} colored className="size-[16px]" />
                  {label.replace(/\b\w/g, (c) => c.toUpperCase())}
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
                  <p className="font-mono text-[10.5px] font-semibold text-ink-soft mt-2">{label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Themes */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="mt-14">
            <motion.div variants={riseIn}>
              <SectionHead kicker="What The Crowd Says" title="Themes" sub="Ranked by frequency × severity" />
            </motion.div>
            <div className="grid gap-3.5 md:grid-cols-2">
              {brief.themes.map((t) => {
                const s = SENTIMENT[t.sentiment] ?? SENTIMENT.neutral;
                const isAsk = t.gap_type === "ask_human";
                return (
                  <motion.article
                    key={t.title}
                    variants={riseIn}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="hairline rounded-[12px] p-5 bg-surface/60 hover:border-accent/50 transition-colors duration-300 break-inside-avoid"
                  >
                    <h3 className="text-[15px] font-semibold leading-snug">{t.title}</h3>
                    <p className="mt-2 font-mono text-[11px] text-ink-soft flex flex-wrap items-center gap-x-2">
                      <span>
                        <span aria-hidden="true">{s.emoji}</span>{" "}
                        <span className={s.color}>{t.sentiment}</span>
                      </span>
                      <span className="text-ink-faint">·</span>
                      <span>{t.mentions} mentions</span>
                      {t.sources.length > 0 && (
                        <>
                          <span className="text-ink-faint">·</span>
                          <span className="text-ink-faint">{t.sources.join(", ")}</span>
                        </>
                      )}
                    </p>
                    <blockquote className="hairline-l mt-3 pl-3 font-serif italic text-[13.5px] text-ink-soft leading-relaxed">
                      “{t.quote}”
                    </blockquote>

                    {/* Open question — boxed */}
                    <div className="mt-4 rounded-[9px] hairline bg-paper/60 px-3 py-2.5">
                      <span className="inline-block rounded-full bg-ink/[0.06] px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wide text-ink-soft">
                        Open Question
                      </span>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink">{t.gap}</p>
                    </div>

                    {/* Ask a human / Research it — the action, accent box */}
                    <div
                      className={`mt-2 rounded-[9px] px-3 py-2.5 transition-colors duration-300 ${
                        isAsk
                          ? "bg-accent-deep/[0.08] border-[0.5px] border-accent/30"
                          : "hairline bg-surface/70"
                      }`}
                    >
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wide ${
                          isAsk ? "bg-accent text-white" : "bg-ink/[0.06] text-ink-soft"
                        }`}
                      >
                        {isAsk ? "🗣 Ask A Human" : "🔬 Research It"}
                      </span>
                      <p className={`mt-1.5 text-[12.5px] leading-relaxed ${isAsk ? "text-ink" : "text-ink-soft"}`}>
                        {t.ask}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
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
                        <p className="font-mono text-[10.5px] text-accent mt-1.5 leading-relaxed transition-all duration-300">
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
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["Key Players", brief.targets.key_players, true],
                    ["Switched From", brief.targets.switched_from, false],
                    ["Segments", brief.targets.segments, false],
                    ["Pains To Mine", brief.targets.pains_to_mine, false],
                  ] as const
                ).map(
                  ([label, items, accent]) =>
                    items.length > 0 && (
                      <Card key={label} className="p-4">
                        <p className="text-[16px] font-bold text-ink mb-3 tracking-[-0.01em]">{label}</p>
                        <ul className="flex flex-wrap gap-2">
                          {items.map((item) => (
                            <li
                              key={item}
                              className={`rounded-full px-3 py-1 text-[13px] transition-colors duration-200 ${
                                accent
                                  ? "bg-accent-deep/[0.1] text-accent border-[0.5px] border-accent/25 hover:bg-accent-deep/[0.16]"
                                  : "hairline text-ink hover:border-accent/50 hover:text-accent"
                              }`}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </Card>
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
                        <h3 className="text-[15px] font-semibold">{p.pain}</h3>
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
