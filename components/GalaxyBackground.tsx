/**
 * A faint wire/constellation web behind everything — fixed, non-interactive.
 * Nodes + nearest-neighbour edges, generated deterministically (seeded) so it's
 * identical on server and client (no hydration mismatch), and kept very light.
 */

const W = 1200;
const H = 820;
const N = 62;
const NEIGHBORS = 2;
const MAX_LINK = 240;

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type P = { x: number; y: number; r: number };

const { nodes, edges } = (() => {
  const rnd = mulberry32(20260706);
  const nodes: P[] = Array.from({ length: N }, () => ({
    x: rnd() * W,
    y: rnd() * H,
    r: 0.8 + rnd() * 1.6,
  }));
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  nodes.forEach((a, i) => {
    const dists = nodes
      .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter((o) => o.j !== i && o.d < MAX_LINK)
      .sort((p, q) => p.d - q.d)
      .slice(0, NEIGHBORS);
    for (const { j } of dists) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
    }
  });
  return { nodes, edges };
})();

export default function GalaxyBackground() {
  return (
    <div
      aria-hidden="true"
      className="no-print pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <svg
        className="drift absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="var(--color-ink)" strokeWidth="0.5" opacity="0.05">
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
            />
          ))}
        </g>
        <g fill="var(--color-ink)" opacity="0.08">
          {nodes.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={n.r} />
          ))}
        </g>
        {/* a few accent nodes for a whisper of color */}
        <g fill="var(--color-accent)" opacity="0.12">
          {nodes
            .filter((_, i) => i % 11 === 0)
            .map((n, i) => (
              <circle key={i} cx={n.x} cy={n.y} r={n.r + 0.4} />
            ))}
        </g>

        {/* ── meaningful motifs: Scout listens to the crowd ──────────────
             radar sweep (scanning sources), speech bubbles + quote marks
             (voice of customer), a waveform (voices heard), a magnifier
             (research). All kept whisper-faint, out of the reading column. */}

        {/* radar — Scout scanning for signal */}
        <g stroke="var(--color-accent)" fill="none" strokeWidth="1" opacity="0.1">
          <circle cx="196" cy="168" r="16" />
          <circle cx="196" cy="168" r="34" />
          <circle cx="196" cy="168" r="52" />
          <line x1="196" y1="168" x2="240" y2="140" strokeLinecap="round" />
        </g>
        <circle
          cx="196"
          cy="168"
          r="52"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.2"
          opacity="0.5"
          className="radar-ring"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
        <circle cx="196" cy="168" r="3.5" fill="var(--color-accent)" opacity="0.35" />

        {/* magnifier — research / dig deeper */}
        <g stroke="var(--color-ink)" fill="none" strokeWidth="1.4" opacity="0.08" className="floaty">
          <circle cx="1024" cy="238" r="21" />
          <line x1="1040" y1="254" x2="1058" y2="272" strokeLinecap="round" />
        </g>

        {/* voice-of-customer speech bubbles */}
        <g stroke="var(--color-ink)" fill="none" strokeWidth="1.1" opacity="0.07" className="floaty">
          <rect x="252" y="612" width="78" height="48" rx="13" />
          <path d="M270 660 l0 14 l15 -14" />
          <line x1="268" y1="630" x2="314" y2="630" />
          <line x1="268" y1="642" x2="302" y2="642" />
        </g>
        <g stroke="var(--color-accent)" fill="none" strokeWidth="1.1" opacity="0.08">
          <rect x="936" y="120" width="66" height="42" rx="12" />
          <path d="M986 162 l0 12 l-13 -12" />
          <line x1="950" y1="136" x2="988" y2="136" />
          <line x1="950" y1="147" x2="978" y2="147" />
        </g>

        {/* big quote marks — verbatim voices */}
        <text x="118" y="452" fontFamily="var(--font-serif)" fontSize="150" fill="var(--color-accent)" opacity="0.06">
          &ldquo;
        </text>
        <text x="1016" y="628" fontFamily="var(--font-serif)" fontSize="150" fill="var(--color-ink)" opacity="0.06">
          &rdquo;
        </text>

        {/* waveform — the voices, heard */}
        <g fill="var(--color-accent)" opacity="0.1">
          {[14, 26, 40, 30, 48, 22, 36, 18, 44, 24, 12].map((h, i) => (
            <rect key={i} x={150 + i * 12} y={732 - h / 2} width="4.5" height={h} rx="2.25" />
          ))}
        </g>
      </svg>
      {/* soft paper vignette so content stays legible over the web */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-paper)_92%)]" />
    </div>
  );
}
