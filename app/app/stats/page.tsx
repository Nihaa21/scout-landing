'use client'

import '../console.css'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { LoaderCircle, RefreshCw } from 'lucide-react'
import { API_BASE } from '@/lib/scout-api'

type VisitorRow = { visitor: string; first_seen: string; last_seen: string; source: string; events: Record<string, number>; reached_console: boolean; ran: boolean; inputs: string[] }
type Summary = {
  total_events: number
  total_visitors: number
  reached_console: number
  ran_scout: number
  visitors: VisitorRow[]
  recent_inputs: { at: string; event: string; visitor: string; text: string }[]
  recent_events: { at: string; event: string; visitor: string; page: string }[]
}

const fmt = (at: string) => at ? at.replace('T', ' ').replace(/(\+00:00|Z)$/, '') : '—'
const funnel = (v: VisitorRow): { label: string; cls: string } => {
  if (v.ran) return { label: 'ran Scout', cls: 'status-green' }
  if (v.reached_console) return { label: 'reached console', cls: 'status-blue' }
  if (v.events.run_started) return { label: 'typed a query', cls: 'status-blue' }
  return { label: 'landed', cls: '' }
}

export default function StatsPage() {
  const [data, setData] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const r = await fetch(`${API_BASE}/track/summary`)
      if (!r.ok) throw new Error(String(r.status))
      setData(await r.json())
    } catch { setError('Could not load stats — is the backend awake?') } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  return <main className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-20 flex min-h-16 w-full items-center justify-between gap-5 border-b border-border bg-background px-5 py-3 md:px-8">
      <div className="flex shrink-0 items-baseline gap-3"><span className="text-xl font-semibold tracking-[-0.04em]">Scout<span className="text-primary">.</span></span><span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:inline">Visitor stats</span></div>
      <div className="flex items-center gap-2"><Link href="/app" className="ghost-button">← Console</Link><button type="button" className="ghost-button" onClick={load}><RefreshCw size={13}/> Refresh</button></div>
    </header>

    <div className="mx-auto max-w-[980px] px-5 py-10 md:px-8">
      <p className="text-sm text-muted-foreground">Everyone who opens the link on your resume, LinkedIn, or portfolio shows up here — where they came from, how far they got, and what they typed.</p>

      {loading && <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle size={14} className="animate-spin"/> loading the event stream…</p>}
      {error && <p className="mt-8 text-sm text-[color:var(--color-neg)]">{error}</p>}

      {data && <>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="status-chip status-blue"><i/>{data.total_visitors} visitors</span>
          <span className="status-chip status-blue"><i/>{data.reached_console} reached the console</span>
          <span className="status-chip status-green"><i/>{data.ran_scout} ran Scout</span>
          <span className="status-chip"><i/>{data.total_events} events</span>
        </div>

        <section className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
          <div className="p-5 md:p-6"><h2 className="mb-4 text-sm font-semibold">Visitors</h2>
            {data.visitors.length === 0 && <p className="text-sm text-muted-foreground">Nobody yet — share the link and check back.</p>}
            {data.visitors.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-xs">
              <thead className="border-y border-border font-mono text-[10px] uppercase text-muted-foreground"><tr><th className="py-3">Came from</th><th>How far they got</th><th>What they typed</th><th>First seen</th><th>Last seen</th><th>Id</th></tr></thead>
              <tbody>{data.visitors.map(v => { const f = funnel(v); return <tr key={v.visitor} className="border-b border-border align-top">
                <td className="py-3 pr-3 font-medium">{v.source}</td>
                <td className="pr-3"><span className={`status-chip ${f.cls}`}>{f.label}</span></td>
                <td className="max-w-[260px] pr-3">{v.inputs.length ? v.inputs.map((t, i) => <p key={i} className="truncate text-muted-foreground" title={t}>&ldquo;{t}&rdquo;</p>) : <span className="text-muted-foreground">—</span>}</td>
                <td className="whitespace-nowrap pr-3 font-mono text-[10px] text-muted-foreground">{fmt(v.first_seen)}</td>
                <td className="whitespace-nowrap pr-3 font-mono text-[10px] text-muted-foreground">{fmt(v.last_seen)}</td>
                <td className="font-mono text-[10px] text-muted-foreground">{v.visitor}</td>
              </tr>})}</tbody>
            </table></div>}
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="mb-4 text-sm font-semibold">What people typed</h2>
          {data.recent_inputs.length === 0 && <p className="text-sm text-muted-foreground">No inputs yet.</p>}
          <div className="space-y-3">{data.recent_inputs.map((x, i) => <div key={i} className="border-b border-border pb-3 last:border-0 last:pb-0">
            <p className="text-sm leading-6">&ldquo;{x.text}&rdquo;</p>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">{x.event} · visitor {x.visitor} · {fmt(x.at)}</p>
          </div>)}</div>
        </section>

        <section className="mt-4 rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="mb-4 text-sm font-semibold">Recent events</h2>
          <div className="space-y-1.5">{data.recent_events.map((e, i) => <p key={i} className="font-mono text-[11px] text-muted-foreground"><span className="text-foreground">{e.event}</span>{e.page ? ` (${e.page})` : ''} · {e.visitor} · {fmt(e.at)}</p>)}</div>
        </section>
      </>}
    </div>
  </main>
}
