"use client";

import type { Competitive, TeardownRow } from "@/lib/brief";

/* Section label in the house style. */
function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] text-ink-soft mb-3">{children}</p>;
}

/* ── 2x2 positioning map (SVG, paper/ink style) ─────────────────────────── */
function PositioningMap({ p }: { p: NonNullable<Competitive["positioning"]> }) {
  const W = 640, H = 420, M = 46; // canvas + margin for labels
  const px = (v: number) => M + (Math.min(100, Math.max(0, v)) / 100) * (W - 2 * M);
  const py = (v: number) => H - M - (Math.min(100, Math.max(0, v)) / 100) * (H - 2 * M);

  return (
    <figure className="hairline rounded-[12px] p-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Positioning map: ${p.x_axis.label} vs ${p.y_axis.label}`}
        className="w-full h-auto"
      >
        {/* quadrant frame + midlines */}
        <rect x={M} y={M} width={W - 2 * M} height={H - 2 * M} fill="none"
          stroke="var(--color-hairline)" strokeWidth="1" />
        <line x1={W / 2} y1={M} x2={W / 2} y2={H - M} stroke="var(--color-hairline)" strokeWidth="1" />
        <line x1={M} y1={H / 2} x2={W - M} y2={H / 2} stroke="var(--color-hairline)" strokeWidth="1" />

        {/* axis labels */}
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

        {/* players */}
        {p.players.map((pl) => (
          <g key={pl.name}>
            <title>{`${pl.name} — ${pl.note}`}</title>
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
          </g>
        ))}
      </svg>
      <figcaption className="sr-only">
        {p.players.map((pl) => `${pl.name}: ${pl.note}`).join(". ")}
      </figcaption>
    </figure>
  );
}

/* ── Porter's five forces ────────────────────────────────────────────────── */
function FiveForces({ forces }: { forces: NonNullable<Competitive["five_forces"]> }) {
  return (
    <div className="space-y-4">
      {forces.map((f) => (
        <div key={f.force} className="hairline-b pb-4 last:border-b-0 last:pb-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[12.5px] font-medium">{f.force}</p>
            <div
              className="flex items-center gap-1 shrink-0"
              aria-label={`${f.score} out of 10 — ${f.level}`}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-[3px] w-2.5 rounded-full ${i < f.score ? "bg-accent" : "bg-ink/10"}`}
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

/* ── The whole breakdown ─────────────────────────────────────────────────── */
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
            <div>
              <Label>positioning map</Label>
              <PositioningMap p={positioning} />
            </div>
          )}
          {five_forces && five_forces.length > 0 && (
            <div>
              <Label>five forces</Label>
              <FiveForces forces={five_forces} />
            </div>
          )}
        </div>
      )}

      {battle_table && battle_table.length > 0 && (
        <div>
          <Label>battle table — how to win against each</Label>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[12.5px]">
              <thead>
                <tr className="hairline-b font-mono text-[11px] text-ink-faint">
                  <th className="py-2 pr-4 font-normal">competitor</th>
                  <th className="py-2 pr-4 font-normal">really serves</th>
                  <th className="py-2 pr-4 font-normal">pricing</th>
                  <th className="py-2 pr-4 font-normal">strength</th>
                  <th className="py-2 pr-4 font-normal">weakness</th>
                  <th className="py-2 font-normal">how to win</th>
                </tr>
              </thead>
              <tbody className="align-top">
                {battle_table.map((r) => (
                  <tr key={r.name} className="hairline-b last:border-b-0">
                    <td className="py-2.5 pr-4 font-medium whitespace-nowrap">{r.name}</td>
                    <td className="py-2.5 pr-4 text-ink-soft">{r.segment}</td>
                    <td className="py-2.5 pr-4 font-mono text-[11px] whitespace-nowrap">{r.pricing}</td>
                    <td className="py-2.5 pr-4 text-ink-soft">{r.strength}</td>
                    <td className="py-2.5 pr-4 text-ink-soft">{r.weakness}</td>
                    <td className="py-2.5 text-accent">{r.how_to_win}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {whitespace && whitespace.length > 0 && (
        <div>
          <Label>whitespace — underserved gaps</Label>
          <div className="grid gap-3 sm:grid-cols-3">
            {whitespace.map((w, i) => (
              <div key={w.opportunity} className="hairline rounded-[12px] p-4">
                <p className="font-mono text-[11px] text-ink-faint mb-1.5">0{i + 1}</p>
                <p className="text-[13.5px] font-medium leading-snug">{w.opportunity}</p>
                <p className="text-[12px] text-ink-soft mt-2 leading-relaxed">
                  <span className="font-mono text-[10px] text-ink-faint mr-1">why now</span>
                  {w.why_now}
                </p>
                <p className="font-serif italic text-[12px] text-ink-soft mt-2 leading-relaxed">
                  {w.evidence}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {strategy && (
        <div>
          <Label>0→1 strategy</Label>
          <div className="hairline rounded-[12px] p-4 sm:p-5 space-y-3">
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
          </div>
        </div>
      )}

      {teardown.length > 0 && (
        <div>
          <Label>scraped facts — G2 · Capterra · pricing pages</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="hairline-b font-mono text-[11px] text-ink-faint">
                  <th className="py-2 pr-4 font-normal">competitor</th>
                  <th className="py-2 pr-4 font-normal">pricing</th>
                  <th className="py-2 pr-4 font-normal">rating</th>
                  <th className="py-2 font-normal">top complaint</th>
                </tr>
              </thead>
              <tbody>
                {teardown.map((r) => (
                  <tr key={r.competitor} className="hairline-b last:border-b-0">
                    <td className="py-2.5 pr-4 font-medium whitespace-nowrap">{r.competitor}</td>
                    <td className="py-2.5 pr-4 font-mono text-[11.5px] whitespace-nowrap">{r.pricing}</td>
                    <td className="py-2.5 pr-4 font-mono text-[11.5px] whitespace-nowrap">{r.rating}</td>
                    <td className="py-2.5 text-ink-soft">{r.complaint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
