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
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
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
      </svg>
      {/* soft paper vignette so content stays legible over the web */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-paper)_92%)]" />
    </div>
  );
}
