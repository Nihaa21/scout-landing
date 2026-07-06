"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Competitive, TeardownRow } from "@/lib/brief";

const EASE = [0.16, 1, 0.3, 1] as const;

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] text-ink-soft mb-3">{children}</p>;
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
              <Label>positioning map</Label>
              <PositioningMap p={positioning} />
            </Reveal>
          )}
          {five_forces && five_forces.length > 0 && (
            <Reveal delay={0.1}>
              <Label>five forces</Label>
              <FiveForces forces={five_forces} />
            </Reveal>
          )}
        </div>
      )}

      {battle_table && battle_table.length > 0 && (
        <Reveal>
          <Label>battle table — how to win against each</Label>
          <Table className="min-w-[760px]">
            <TableHeader>
              <tr className="hairline-b">
                <TableHead>competitor</TableHead>
                <TableHead>really serves</TableHead>
                <TableHead>pricing</TableHead>
                <TableHead>strength</TableHead>
                <TableHead>weakness</TableHead>
                <TableHead>how to win</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {battle_table.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="font-medium whitespace-nowrap">{r.name}</TableCell>
                  <TableCell className="text-ink-soft">{r.segment}</TableCell>
                  <TableCell className="font-mono text-[11px] whitespace-nowrap">{r.pricing}</TableCell>
                  <TableCell className="text-ink-soft">{r.strength}</TableCell>
                  <TableCell className="text-ink-soft">{r.weakness}</TableCell>
                  <TableCell className="text-accent pr-0">{r.how_to_win}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Reveal>
      )}

      {whitespace && whitespace.length > 0 && (
        <Reveal>
          <Label>whitespace — underserved gaps</Label>
          <div className="grid gap-3 sm:grid-cols-3">
            {whitespace.map((w, i) => (
              <motion.div key={w.opportunity} whileHover={{ y: -2 }} transition={{ duration: 0.25 }}>
                <Card className="p-4 h-full hover:border-accent/40">
                  <p className="font-mono text-[11px] text-accent mb-1.5">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="text-[13.5px] font-medium leading-snug">{w.opportunity}</p>
                  <p className="text-[12px] text-ink-soft mt-2 leading-relaxed">
                    <span className="font-mono text-[10px] text-ink-faint mr-1">why now</span>
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
          <Label>0→1 strategy</Label>
          <Card className="p-4 sm:p-5 space-y-3">
            {(
              [
                ["beachhead", strategy.beachhead],
                ["wedge", strategy.wedge],
                ["moat", strategy.moat],
              ] as const
            ).map(([k, v]) => (
              <p key={k} className="text-[13px] leading-relaxed">
                <span className="font-mono text-[11px] text-accent mr-2">{k}</span>
                {v}
              </p>
            ))}
            {strategy.first_90_days?.length > 0 && (
              <div className="hairline-t pt-3">
                <p className="font-mono text-[11px] text-ink-faint mb-2">first 90 days</p>
                <ol className="space-y-1.5">
                  {strategy.first_90_days.map((step, i) => (
                    <li key={step} className="text-[12.5px] leading-relaxed flex gap-2.5">
                      <span className="font-mono text-[11px] text-ink-faint shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </Card>
        </Reveal>
      )}

      {teardown.length > 0 && (
        <Reveal>
          <Label>scraped facts — G2 · Capterra · pricing pages</Label>
          <Table>
            <TableHeader>
              <tr className="hairline-b">
                <TableHead>competitor</TableHead>
                <TableHead>pricing</TableHead>
                <TableHead>rating</TableHead>
                <TableHead>top complaint</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {teardown.map((r) => (
                <TableRow key={r.competitor}>
                  <TableCell className="font-medium whitespace-nowrap">{r.competitor}</TableCell>
                  <TableCell className="font-mono text-[11.5px] whitespace-nowrap">{r.pricing}</TableCell>
                  <TableCell className="font-mono text-[11.5px] whitespace-nowrap">{r.rating}</TableCell>
                  <TableCell className="text-ink-soft">{r.complaint}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Reveal>
      )}
    </div>
  );
}
