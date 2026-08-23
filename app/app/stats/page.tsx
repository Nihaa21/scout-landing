'use client'

import '../console.css'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Clipboard, LoaderCircle, RefreshCw } from 'lucide-react'
import { API_BASE } from '@/lib/scout-api'

type ShareRow = { share: string; visitors: number; console_visitors: number; events: Record<string, number>; last_seen: string }
type Summary = {
  total_events: number
  total_visitors: number
  shares: ShareRow[]
  recent_inputs: { at: string; share: string; event: string; visitor: string; text: string }[]
  recent_events: { at: string; event: string; share: string; visitor: string; page: string }[]
}

const fmt = (at: string) => at ? at.replace('T', ' ').replace('Z', '') : '—'

export default function StatsPage() {
  const [data, setData] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const r = await fetch(`${API_BASE}/track/summary`)
      if (!r.ok) throw new Error(String(r.status))
      setData(await r.json())
    } catch { setError('Could not load stats — is the backend awake?') } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const shareUrl = slug ? `${origin}/?s=${slug}` : ''
  const copy = () => { if (shareUrl) { navigator.clipboard?.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1600) } }

  return <main className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-20 flex min-h-16 w-full items-center justify-between gap-5 border-b border-border bg-background px-5 py-3 md:px-8">
      <div className="flex shrink-0 items-baseline gap-3"><span className="text-xl font-semibold tracking-[-0.04em]">Scout<span className="text-primary">.</span></span><span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:inline">Share stats</span></div>
      <div className="flex items-center gap-2"><Link href="/app" className="ghost-button">← Console</Link><button type="button" className="ghost-button" onClick={load}><RefreshCw size={13}/> Refresh</button></div>
    </header>

    <div className="mx-auto max-w-[980px] px-5 py-10 md:px-8">
      <section className="rounded-xl border border-border bg-card p-5 md:p-6">
        <h2 className="text-sm font-semibold">Make a share link</h2>
        <p className="mt-1 text-xs text-muted-foreground">Tag a link per person — everything they do (landing, inputs, console) shows up under that tag.</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. alex, yc-app, linkedin" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"/>
          {shareUrl && <><code className="rounded-lg bg-muted px-3 py-2 font-mono text-[11px]">{shareUrl}</code><button type="button" className="ghost-button" onClick={copy}><Clipboard size={12}/>{copied ? 'copied ✓' : 'copy'}</button></>}
        </div>
      </section>

      {loading && <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle size={14} className="animate-spin"/> loading the event stream…</p>}
      {error && <p className="mt-8 text-sm text-[color:var(--color-neg)]">{error}</p>}

      {data && <>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="status-chip status-blue"><i/>{data.total_visitors} visitors</span>
          <span className="status-chip"><i/>{data.total_events} events</span>
        </div>

        <section className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
          <div className="p-5 md:p-6"><h2 className="mb-4 text-sm font-semibold">By share link</h2>
            {data.shares.length === 0 && <p className="text-sm text-muted-foreground">No events yet — share a tagged link and check back.</p>}
            {data.shares.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-xs">
              <thead className="border-y border-border font-mono text-[10px] uppercase text-muted-foreground"><tr><th className="py-3">Share</th><th>Visitors</th><th>Reached console</th><th>Activity</th><th>Last seen</th></tr></thead>
              <tbody>{data.shares.map(s => <tr key={s.share} className="border-b border-border">
                <td className="py-3 pr-3 font-mono text-primary">{s.share}</td>
                <td className="pr-3 font-mono tabular-nums">{s.visitors}</td>
                <td className="pr-3 font-mono tabular-nums">{s.console_visitors}</td>
                <td className="pr-3"><span className="flex flex-wrap gap-1.5">{Object.entries(s.events).map(([k, v]) => <span key={k} className="status-chip">{k} ×{v}</span>)}</span></td>
                <td className="whitespace-nowrap font-mono text-[10px] text-muted-foreground">{fmt(s.last_seen)}</td>
              </tr>)}</tbody>
            </table></div>}
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="mb-4 text-sm font-semibold">What people typed</h2>
          {data.recent_inputs.length === 0 && <p className="text-sm text-muted-foreground">No inputs yet.</p>}
          <div className="space-y-3">{data.recent_inputs.map((x, i) => <div key={i} className="border-b border-border pb-3 last:border-0 last:pb-0">
            <p className="text-sm leading-6">&ldquo;{x.text}&rdquo;</p>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">{x.event} · {x.share} · visitor {x.visitor} · {fmt(x.at)}</p>
          </div>)}</div>
        </section>

        <section className="mt-4 rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="mb-4 text-sm font-semibold">Recent events</h2>
          <div className="space-y-1.5">{data.recent_events.map((e, i) => <p key={i} className="font-mono text-[11px] text-muted-foreground"><span className="text-foreground">{e.event}</span>{e.page ? ` (${e.page})` : ''} · {e.share} · {e.visitor} · {fmt(e.at)}</p>)}</div>
        </section>
      </>}
    </div>
  </main>
}
