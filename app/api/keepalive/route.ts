// Keep-alive (Vercel cron, daily 06:00 UTC).
// Free Supabase pauses a project after ~7 days with no database activity, and
// free Render spins the dyno down when idle — either one makes the app look
// broken (empty memory, cold first request). A daily ping to the backend's
// storage health probe issues a real `select ... from market_memory limit 1`,
// which is genuine DB activity: it resets Supabase's pause timer and keeps the
// Render dyno warm. One cheap request, both problems handled.

const BASE = process.env.NEXT_PUBLIC_SCOUT_API ?? 'https://scout-agent-lea9.onrender.com'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

export async function GET() {
  // Retry a few times so a cold Render dyno gets woken (and reached) within
  // the budget rather than reporting a false failure.
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(`${BASE}/health?storage=true`, { cache: 'no-store', signal: AbortSignal.timeout(9000) })
      if (r.ok) {
        const body = await r.json()
        return Response.json({ ok: true, storage: body?.storage ?? null, attempt: i + 1 })
      }
    } catch { /* dyno still waking */ }
  }
  return Response.json({ ok: false, reason: 'backend did not respond in time' }, { status: 502 })
}
