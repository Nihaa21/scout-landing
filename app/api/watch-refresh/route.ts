// The watchtower's weekly heartbeat (Vercel cron, Sundays 12:00 UTC).
// Wakes the Render backend, reads the watchlist, and kicks a listening pass
// for every stale subject. The kicks are fire-and-forget: Render runs each
// pass in a worker thread that finishes and persists memory even after this
// function's short fetch disconnects — so a 60s serverless budget is enough
// to trigger multi-minute research runs.
//
// Safe to hit by hand too: the backend self-throttles (20h floor per subject,
// in-flight guard), so extra invocations are no-ops.

const BASE = process.env.NEXT_PUBLIC_SCOUT_API ?? 'https://scout-agent-lea9.onrender.com'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

type WatchEntry = { subject: string; mode: string; stale: boolean }

export async function GET() {
  // The first fetch to a sleeping Render dyno triggers its cold start; retry
  // until it answers or the budget is nearly spent.
  let status: { watched?: WatchEntry[] } | null = null
  for (let i = 0; i < 5 && !status; i++) {
    try {
      const r = await fetch(`${BASE}/brain/watch`, { cache: 'no-store', signal: AbortSignal.timeout(9000) })
      if (r.ok) status = await r.json()
    } catch { /* still waking */ }
  }
  if (!status) return Response.json({ ok: false, reason: 'backend did not wake in time' }, { status: 502 })

  const stale = (status.watched ?? []).filter((w) => w.stale)
  for (const w of stale) {
    fetch(`${BASE}/brain/watch/refresh`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ subject: w.subject, mode: w.mode }),
      signal: AbortSignal.timeout(1500),
    }).catch(() => {})
  }
  if (stale.length) await new Promise((r) => setTimeout(r, 2500)) // let the kicks leave the building

  return Response.json({ ok: true, watched: (status.watched ?? []).length, kicked: stale.map((w) => w.subject) })
}
