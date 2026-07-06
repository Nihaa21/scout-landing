"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import type { Competitive, TeardownRow } from "@/lib/brief";

const EASE = [0.16, 1, 0.3, 1] as const;

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] font-semibold tracking-[-0.01em] mb-3">{children}</p>;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ── 2x2 positioning map ─────────────────────────────────────────────────── */
function PositioningMap({ p }: { p: NonNullable<Competitive["positioning"]> }) {
  const W = 640, H = 420, M = 46;
  const px = (v: number) => M + (Math.min(100, Math.max(0, v)) / 100) * (W - 2 * M);
  const py = (v: number) => H - M - (Math.min(100, Math.max(0, v)) / 100) * (H - 2 * M);

  return (
    <Card className="p-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Positioning map: ${p.x_axis.label} vs ${p.y_axis.label}`}
        className="w-full h-auto"
      >
        <rect x={M} y={M} width={W - 2 * M} height={H - 2 * M} fill="none"
          stroke="var(--color-hairline)" strokeWidth="1" />
        <line x1={W / 2} y1={M} x2={W / 2} y2={H - M} stroke="var(--color-hairline)" strokeWidth="1" />
        <line x1={M} y1={H / 2} x2={W - M} y2={H / 2} stroke="var(--color-hairline)" strokeWidth="1" />

        <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="11"
          fontFamily="var(--font-mono)" fill="var(--color-ink-soft)">{p.x_axis.label}</text>
        <text x={M} y={H - M + 16} textAnchor="start" fontSize="10"
          fontFamily="var(--font-mono)" fill="var(--color-ink-faint)">← {p.x_axis.low}</text>
        <text x={W - M} y={H - M + 16} textAnchor="end" fontSize="10"
          fontFamily="var(--font-mono)" fill="var(--color-ink-faint)">{p.x_axis.high} →</text>
        <text x={14} y={H / 2} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)"
          fill="var(--color-ink-soft)" transform={`rotate(-90 14 ${H / 2})`}>{p.y_axis.label}</text>
        <text x={M - 6} y={M + 4} textAnchor="end" fontSize="10"
          fontFamily="var(--font-mono)" fill="var(--color-ink-faint)">{p.y_axis.high}</text>
        <text x={M - 6} y={H - M} textAnchor="end" fontSize="10"
          fontFamily="var(--font-mono)" fill="var(--color-ink-faint)">{p.y_axis.low}</text>

        {p.players.map((pl, i) => (
          <motion.g
            key={pl.name}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 + i * 0.1, duration: 0.45, ease: EASE }}
            style={{ transformOrigin: `${px(pl.x)}px ${py(pl.y)}px` }}
            className="cursor-default"
          >
            <title>{`${pl.name} — ${pl.note}`}</title>
            {pl.is_subject && (
              <circle cx={px(pl.x)} cy={py(pl.y)} r={13}
                fill="var(--color-accent)" opacity="0.15" />
            )}
            <circle
              cx={px(pl.x)} cy={py(pl.y)} r={pl.is_subject ? 7 : 5}
              fill={pl.is_subject ? "var(--color-accent)" : "var(--color-paper)"}
              stroke={pl.is_subject ? "var(--color-accent)" : "var(--color-ink-soft)"}
              strokeWidth={pl.is_subject ? 0 : 1.5}
            />
            <text
              x={px(pl.x) + 10} y={py(pl.y) + 4} fontSize="12"
              fontFamily="var(--font-sans)"
              fontWeight={pl.is_subject ? 500 : 400}
              fill={pl.is_subject ? "var(--color-accent)" : "var(--color-ink)"}
            >
              {pl.name}
            </text>
          </motion.g>
        ))}
      </svg>
      <p className="sr-only">{p.players.map((pl) => `${pl.name}: ${pl.note}`).join(". ")}</p>
    </Card>
  );
}

/* ── five forces ─────────────────────────────────────────────────────────── */
function FiveForces({ forces }: { forces: NonNullable<Competitive["five_forces"]> }) {
  return (
    <div className="space-y-4">
      {forces.map((f, fi) => (
        <div key={f.force} className="hairline-b pb-4 last:border-b-0 last:pb-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[12.5px] font-medium">{f.force}</p>
            <div className="flex items-center gap-1 shrink-0"
              aria-label={`${f.score} out of 10 — ${f.level}`}>
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + fi * 0.08 + i * 0.025, duration: 0.25 }}
                  className={`h-[3px] w-2.5 rounded-full origin-left ${i < f.score ? "bg-accent" : "bg-ink/15"}`}
                />
              ))}
              <span className="font-mono text-[10px] text-ink-faint ml-1.5">{f.level}</span>
            </div>
          </div>
          <p className="text-[12px] text-ink-soft leading-relaxed mt-1.5">{f.insight}</p>
        </div>
      ))}
    </div>
  );
}

/* ── the whole breakdown ─────────────────────────────────────────────────── */
export default function CompetitiveBreakdown({
  competitive,
  teardown,
}: {
  competitive: Competitive;
  teardown: TeardownRow[];
}) {
  const { positioning, five_forces, battle_table, whitespace, strategy } = competitive;
  const hasAnything =
    positioning || five_forces?.length || battle_table?.length || whitespace?.length || strategy;
  if (!hasAnything) return null;

  return (
    <div className="space-y-10">
      {(positioning?.players?.length || five_forces?.length) && (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start">
          {positioning && positioning.players?.length > 0 && (
            <Reveal>
              <Label>Positioning Map</Label>
              <PositioningMap p={positioning} />
            </Reveal>
          )}
          {five_forces && five_forces.length > 0 && (
            <Reveal delay={0.1}>
              <Label>Five Forces</Label>
              <FiveForces forces={five_forces} />
            </Reveal>
          )}
        </div>
      )}

      {battle_table && battle_table.length > 0 && (
        <Reveal>
          <Label>Battle Table — How To Win Against Each</Label>
          <div className="grid gap-3 lg:grid-cols-2">
            {battle_table.map((r) => (
              <motion.div key={r.name} whileHover={{ y: -2 }} transition={{ duration: 0.25 }} className="min-w-0">
                <Card className="p-4 h-full hover:border-accent/40 break-inside-avoid overflow-hidden">
                  {/* name + pricing */}
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h4 className="text-[15px] font-semibold min-w-0 break-words">{r.name}</h4>
                    <span className="font-mono text-[11px] font-semibold text-ink shrink-0 break-words">{r.pricing}</span>
                  </div>
                  <p className="text-[11.5px] text-ink-faint mt-1 break-words">Serves {r.segment}</p>

                  {/* strength / weakness */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="min-w-0 rounded-[8px] bg-pos/[0.08] px-2.5 py-2">
                      <p className="font-mono text-[9px] uppercase tracking-wide text-pos mb-0.5">Strength</p>
                      <p className="text-[12px] leading-snug text-ink break-words">{r.strength}</p>
                    </div>
                    <div className="min-w-0 rounded-[8px] bg-neg/[0.08] px-2.5 py-2">
                      <p className="font-mono text-[9px] uppercase tracking-wide text-neg mb-0.5">Weakness</p>
                      <p className="text-[12px] leading-snug text-ink break-words">{r.weakness}</p>
                    </div>
                  </div>

                  {/* how to win — the punchline */}
                  <div className="mt-2.5 rounded-[8px] bg-accent-deep/[0.08] border-[0.5px] border-accent/25 px-3 py-2.5">
                    <p className="font-mono text-[9px] uppercase tracking-wide text-accent mb-1 flex items-center gap-1">
                      ⚔ How To Win
                    </p>
                    <p className="text-[13px] leading-snug text-accent font-medium break-words">{r.how_to_win}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Reveal>
      )}

      {whitespace && whitespace.length > 0 && (
        <Reveal>
          <Label>Whitespace — Underserved Gaps</Label>
          <div className="grid gap-3 sm:grid-cols-3">
            {whitespace.map((w, i) => (
              <motion.div key={w.opportunity} whileHover={{ y: -2 }} transition={{ duration: 0.25 }}>
                <Card className="p-4 h-full hover:border-accent/40">
                  <p className="font-mono text-[11px] text-accent mb-1.5">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="text-[13.5px] font-medium leading-snug">{w.opportunity}</p>
                  <p className="text-[12px] text-ink-soft mt-2 leading-relaxed">
                    <span className="font-mono text-[10px] text-ink-faint mr-1">Why Now</span>
                    {w.why_now}
                  </p>
                  <p className="font-serif italic text-[12px] text-ink-soft mt-2 leading-relaxed">
                    {w.evidence}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Reveal>
      )}

      {strategy && (
        <Reveal>
          <Label>0→1 Strategy</Label>
          {/* beachhead / wedge / moat as three cards */}
          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                ["Beachhead", strategy.beachhead, "Who to win first"],
                ["Wedge", strategy.wedge, "How you get in"],
                ["Moat", strategy.moat, "What compounds"],
              ] as const
            ).map(([k, v, hint]) => (
              <motion.div key={k} whileHover={{ y: -2 }} transition={{ duration: 0.25 }}>
                <Card className="p-4 h-full hover:border-accent/40">
                  <div className="flex items-baseline justify-between">
                    <p className="text-[14px] font-bold text-accent">{k}</p>
                    <p className="font-mono text-[9px] text-ink-faint">{hint}</p>
                  </div>
                  <p className="text-[14px] leading-relaxed mt-2">{v}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* first 90 days — interactive timeline */}
          {strategy.first_90_days?.length > 0 && (
            <div className="mt-4">
              <p className="font-mono text-[11px] text-ink-soft mb-3">First 90 Days</p>
              <ol className="relative">
                {strategy.first_90_days.map((step, i) => (
                  <motion.li
                    key={step}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: EASE }}
                    className="group flex gap-4 pb-4 last:pb-0 relative"
                  >
                    {/* connector line */}
                    {i < strategy.first_90_days.length - 1 && (
                      <span className="absolute left-[13px] top-7 bottom-0 w-px bg-[var(--color-hairline)]" />
                    )}
                    <span className="relative z-10 shrink-0 grid place-items-center size-[27px] rounded-full hairline bg-surface font-mono text-[11px] text-accent group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-colors duration-300">
                      {i + 1}
                    </span>
                    <p className="text-[14px] leading-relaxed pt-1">{step}</p>
                  </motion.li>
                ))}
              </ol>
            </div>
          )}
        </Reveal>
      )}

      {teardown.length > 0 && (
        <Reveal>
          <Label>Scraped Facts — G2 · Capterra · Pricing Pages</Label>
          <div className="overflow-x-auto rounded-[12px] hairline">
            <table className="w-full min-w-[560px] text-left text-[12.5px] border-collapse">
              <thead>
                <tr className="hairline-b bg-paper/70">
                  {["Competitor", "Pricing", "Rating", "Top Complaint"].map((h) => (
                    <th
                      key={h}
                      className="py-3 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.07em] text-ink-soft"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teardown.map((r, i) => (
                  <tr
                    key={r.competitor}
                    className={`align-top hairline-b last:border-b-0 transition-colors hover:bg-accent-deep/[0.04] ${
                      i % 2 ? "bg-paper/40" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-ink whitespace-nowrap">{r.competitor}</td>
                    <td className="py-3 px-4 font-mono text-[11.5px] text-ink-soft">{r.pricing}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-mid/[0.14] px-2 py-0.5 font-mono text-[11px] font-semibold text-mid">
                        ★ {r.rating}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-ink-soft leading-relaxed min-w-[220px]">{r.complaint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      )}
    </div>
  );
}
