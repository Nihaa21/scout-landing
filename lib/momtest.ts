// Client-side Mom-Test scorer — mirror of app/brain/momtest.py. Live runs carry
// the backend's `mom_test`; this is the fallback for mock data and older cached
// runs so the badges always render. Pure, no network.
import type { MomTest, MomFlag } from './scout-api'

const RULES: [RegExp, string, string, string][] = [
  [/\bwould you pay\b|\bhow much would you (pay|spend)\b|\bwould you buy\b/i, 'pricing-hypo', 'asks about hypothetical spend', 'Ask what they pay for the current solution today, not what they’d pay you.'],
  [/\bwould you\b|\bcould you see yourself\b|\bwill you\b|\bif (you|there) (had|was|were|could)\b|\bimagine\b/i, 'hypothetical', 'hypothetical — people are bad at predicting their own behavior', 'Anchor to a real past event: “Tell me about the last time you…”.'],
  [/\bdo you (think|like|feel|believe|prefer)\b|\bis (this|it|that) a (good|useful|great)\b|\bwould you want\b|\bhow do you feel about\b/i, 'opinion', 'asks for an opinion about your idea', 'Facts beat opinions — ask what they actually did and why.'],
  [/\b(don'?t|doesn'?t|wouldn'?t|isn'?t|aren'?t) (you|it|they|that)\b|\bwouldn'?t you agree\b|,?\s*right\?\s*$/i, 'leading', 'leading — plants the answer', 'Drop the lead-in and let them reach the conclusion.'],
]
const CLOSED = /^\s*(do|does|did|are|is|was|were|have|has|had|can|could|will|would|should)\b/i
const OPEN = /^\s*(how|what|why|when|where|tell me|walk me|describe|which)\b/i
const BEHAVIORAL = /\btell me about the last time\b|\bwalk me through\b|\bwhen did you last\b|\bhow do you (currently|today)\b|\bwhat have you (tried|done|used)\b|\bthe last time\b|\bwhat happened\b|\bhow are you (handling|doing)\b/i

export function scoreQuestion(question: string): MomTest {
  const q = (question || '').trim()
  const flags: MomFlag[] = []
  let score = 100
  for (const [re, type, why, fix] of RULES) {
    if (re.test(q)) { flags.push({ type, why, fix }); score -= (type === 'leading') ? 25 : 30 }
  }
  const behavioral = BEHAVIORAL.test(q)
  if (behavioral) score = Math.min(100, score + 10)
  else if (CLOSED.test(q) && !OPEN.test(q) && flags.length === 0) {
    flags.push({ type: 'closed', why: 'closed yes/no framing', fix: 'Open it up: start with “How”, “What”, or “Tell me about…”.' })
    score -= 12
  }
  score = Math.max(0, Math.min(100, score))
  const verdict = score >= 80 ? 'clean' : score >= 55 ? 'soft' : 'leading'
  return { score, verdict, behavioral, flags }
}
