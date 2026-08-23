// Anonymous usage tracking for the landing + console.
// A share link like https://…/?s=alex tags every event that visitor ever
// fires (the tag is kept in localStorage so it survives the click-through to
// /app), and the visitor id is a random string — no PII is collected.
import { API_BASE } from './scout-api'

const VISITOR_KEY = 'scout-visitor'
const SHARE_KEY = 'scout-share'

function visitorId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) { id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); localStorage.setItem(VISITOR_KEY, id) }
    return id
  } catch { return '' }
}

export function shareTag(): string {
  if (typeof window === 'undefined') return ''
  try {
    const q = new URLSearchParams(window.location.search)
    const fromUrl = q.get('s') || q.get('ref') || q.get('share') || ''
    if (fromUrl) localStorage.setItem(SHARE_KEY, fromUrl.slice(0, 64))
    return fromUrl || localStorage.getItem(SHARE_KEY) || ''
  } catch { return '' }
}

export function track(event: string, meta: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return
  try {
    fetch(`${API_BASE}/track`, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, visitor: visitorId(), share: shareTag(), path: window.location.pathname, meta }),
    }).catch(() => {})
  } catch {}
}
