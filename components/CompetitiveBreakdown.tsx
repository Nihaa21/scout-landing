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

/* ── 2x2 positioning map ─────────────────────────────────────────────────
   No rotated text, no cramped margins: axis ends live as clean labels above
   and below the plot, players get halo'd bold names that flip sides near the
   edge, and the plot itself reads like graph paper with the winning quadrant
   tinted. */
function PositioningMap({ p }: { p: NonNullable<Competitive["positioning"]> }) {
  const W = 640, H = 520, ML = 24, MR = 24, MT = 46, MB = 88;
  const PW = W - ML - MR, PH = H - MT - MB;
  const px = (v: number) => ML + (Math.min(100, Math.max(0, v)) / 100) * PW;
  const py = (v: number) => MT + PH - (Math.min(100, Math.max(0, v)) / 100) * PH;
  const subject = p.players.find((pl) => pl.is_subject);

  /* halo'd label — paper stroke underneath keeps bold text legible anywhere */
  const halo = (x: number, y: number, anchor: "start" | "end" | "middle", fill: string, size: number, weight: number, mono: boolean, txt: string) => (
    <>
      <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight}
        fontFamily={mono ? "var(--font-mono)" : "var(--font-sans)"}
        stroke="var(--color-surface)" strokeWidth={4} strokeLinejoin="round" opacity="0.92">
        {txt}
      </text>
      <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight}
        fontFamily={mono ? "var(--font-mono)" : "var(--font-sans)"} fill={fill}>
        {txt}
      </text>
    </>
  );

  return (
    <Card className="p-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Positioning map: ${p.x_axis.label} vs ${p.y_axis.label}`}
        className="w-full h-auto"
      >
        <defs>
          <pattern id="pm-dots" width="34" height="34" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1.2" fill="var(--color-ink)" opacity="0.07" />
          </pattern>
          <linearGradient id="pm-win" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0.4" stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* plot — graph paper + a soft glow toward the winning corner */}
        <rect x={ML} y={MT} width={PW} height={PH} rx="10" fill="var(--color-paper)" opacity="0.55" />
        <rect x={ML} y={MT} width={PW} height={PH} rx="10" fill="url(#pm-dots)" />
        <rect x={ML} y={MT} width={PW} height={PH} rx="10" fill="url(#pm-win)" />
        <rect x={ML} y={MT} width={PW} height={PH} rx="10" fill="none"
          stroke="var(--color-hairline)" strokeWidth="1.2" />

        {/* dashed crosshair */}
        <line x1={ML + PW / 2} y1={MT + 8} x2={ML + PW / 2} y2={MT + PH - 8}
          stroke="var(--color-ink-faint)" strokeWidth="1" strokeDasharray="2 6" strokeLinecap="round" opacity="0.6" />
        <line x1={ML + 8} y1={MT + PH / 2} x2={ML + PW - 8} y2={MT + PH / 2}
          stroke="var(--color-ink-faint)" strokeWidth="1" strokeDasharray="2 6" strokeLinecap="round" opacity="0.6" />

        {/* y-axis ends — above and below the plot, never rotated */}
        {halo(W / 2, MT - 14, "middle", "var(--color-accent)", 11, 700, true, `▲ ${p.y_axis.high}`)}
        {halo(W / 2, MT + PH + 44, "middle", "var(--color-ink-soft)", 11, 700, true, `▼ ${p.y_axis.low}`)}

        {/* x-axis ends — bottom corners */}
        {halo(ML + 2, MT + PH + 22, "start", "var(--color-ink-soft)", 11, 700, true, `◀ ${p.x_axis.low}`)}
        {halo(W - MR - 2, MT + PH + 22, "end", "var(--color-accent)", 11, 700, true, `${p.x_axis.high} ▶`)}

        {/* axis titles — one quiet caption line */}
        {halo(W / 2, H - 14, "middle", "var(--color-ink-faint)", 10, 500, true,
          `x · ${p.x_axis.label}   |   y · ${p.y_axis.label}`)}

        {p.players.map((pl, i) => {
          const cx = px(pl.x), cy = py(pl.y);
          const flip = cx > ML + PW - 120; // label flips left near the right edge
          const lx = flip ? cx - 12 : cx + 12;
          const ly = Math.min(Math.max(cy + 4.5, MT + 16), MT + PH - 8);
          return (
            <motion.g
              key={pl.name}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 + i * 0.1, duration: 0.45, ease: EASE }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
              className="cursor-default"
            >
              <title>{`${pl.name} — ${pl.note}`}</title>
              {pl.is_subject && (
                <>
                  <circle cx={cx} cy={cy} r={18} fill="var(--color-accent)" opacity="0.1" />
                  <circle cx={cx} cy={cy} r={12} fill="none"
                    stroke="var(--color-accent)" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.6" />
                </>
              )}
              <circle
                cx={cx} cy={cy} r={pl.is_subject ? 7.5 : 6}
                fill={pl.is_subject ? "var(--color-accent)" : "var(--color-surface)"}
                stroke={pl.is_subject ? "var(--color-surface)" : "var(--color-accent-deep)"}
                strokeWidth={pl.is_subject ? 2 : 1.7}
              />
              {halo(lx, ly, flip ? "end" : "start",
                pl.is_subject ? "var(--color-accent)" : "var(--color-ink)", 13, 700, false, pl.name)}
            </motion.g>
          );
        })}
      </svg>

      {/* legend */}
      <div className="mt-1 flex items-center justify-center gap-5 font-mono text-[10.5px] text-ink-soft">
        {subject && (
          <span className="inline-flex items-center gap-1.5">
            <span className="size-[9px] rounded-full bg-accent inline-block" /> {subject.name} (you)
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <span className="size-[9px] rounded-full border-[1.7px] border-accent-deep bg-surface inline-block" /> competitors
        </span>
      </div>

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
            <p className="text-[13px] font-semibold">{f.force}</p>
            <span
              className="font-mono text-[10px] font-semibold uppercase tracking-wide text-accent shrink-0"
              aria-label={`${f.level} (${f.score} out of 10)`}
            >
              {f.level}
            </span>
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
                    <span className="font-mono text-[9.5px] font-semibold uppercase tracking-wide text-accent mr-1.5">
                      Why Now
                    </span>
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
              <p className="text-[14px] font-semibold tracking-[-0.01em] mb-3">First 90 Days</p>
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
