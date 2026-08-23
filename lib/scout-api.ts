export type Mode = 'product' | 'industry'
export type ResumeSource = 'manual' | 'gong' | 'mcp' | 'transcripts'
export type SignalTrend = 'new' | 'rising' | 'stable' | 'fading'
export type GapType = 'researchable' | 'ask_human'
export type AssumptionStatus = 'open' | 'supported' | 'refuted' | 'needs_human'
export type AlertKind = 'rising' | 'new' | 'faded' | 'competitor' | 'blue_ocean'
export type Decision = 'build' | 'park' | 'reject'

export type Evidence = { text: string; source: string; url: string; upvotes: number }
export type HistoryPoint = { at: string; score: number }
export type Signal = { signal: string; frequency: number; severity: 1|2|3|4|5; score: number; whitespace: boolean; sentiment: string; quote: string; gap: string; gap_type: GapType; next_step: string; sources: string[]; who: string[]; source_url: string; source_name: string; evidence: Evidence[]; evidence_count: number; trend: SignalTrend; runs_seen: number; history: HistoryPoint[] }
export type SourceStat = { source: string; fetched: number; added: number; hint?: string }
export type Alert = { kind: AlertKind; severity: 1|2|3|4|5; title: string; detail: string; action: string }
export type Pain = { pain: string; detail: string; severity: 1|2|3|4|5; quote: string; who: string; source_url: string; evidence: Evidence[]; evidence_count: number }
export type Question = { question: string; why: string; grounded_in: string[]; closes: string[]; source_url: string; source_name: string }
export type Assumption = { id: string; statement: string; confidence: number; resolution: string; status: AssumptionStatus; evidence: Evidence[] }
export type SinceLastRun = { previous_run_at: string | null; runs_on_record: number; new: string[]; rising: string[]; fading: string[]; gone: string[] }
export type Step4 = { subject: string; mode: Mode; confidence: number; resolvable_count: number; gap_count: number; snapshot_key: number | null; signals_ranked: Signal[]; since_last_run: SinceLastRun; source_stats: SourceStat[]; alerts: Alert[]; pain_map: Pain[]; questions: Question[]; assumptions: Assumption[]; needs_human: Assumption[] }
export type StartResponse = { thread_id: string; status: 'needs_feedback'; subject: string; resume_token: string; log: string[]; step4: Step4 }
export type ProposedFeature = { title: string; confidence: number; rationale: string; evidence: Evidence[]; assumption_id: string }
export type Player = { name: string; x: number; y: number; is_subject: boolean; note: string }
export type Positioning = { x_axis: { label: string; low: string; high: string }; y_axis: { label: string; low: string; high: string }; players?: Player[] }
export type Competitive = { positioning: Positioning; players?: Player[]; five_forces: { force: string; score: number; level: string; insight: string }[]; battle_table: { name: string; segment: string; pricing: string; strength: string; weakness: string; how_to_win: string }[]; whitespace: { opportunity: string; why_now: string; evidence: Evidence[] }[]; strategy: { beachhead: string; wedge: string; moat: string; first_90_days: [string, string, string, string] } }
export type FinalResponse = { subject: string; mode: Mode; snapshot_key: number | null; confidence: number; proposed_features: ProposedFeature[]; ranked_feedback: { item: string; priority: 1|2|3|4|5; kind: 'signal'|'noise'; why: string }[]; signals_ranked: Signal[]; assumptions: Assumption[]; alerts: Alert[]; blue_ocean: { opportunity: string; why: string }[]; competitor_changes: string[]; since_last_run: SinceLastRun; competitive: Competitive; teardown: { competitor: string; pricing: string; rating: string; complaint: string; switched_from: string; news: string }[] }
export type ResumeResponse = { thread_id: string; status: 'done'; proposed_features: ProposedFeature[]; final: FinalResponse }
export type AskResponse = { answer: string; citations: { n: number; text: string; source: string; url: string }[] }
export type RecruitResponse = { outreach: { their_words: string; source: string; url: string; how: string; message: string; closes: string[] }[] }
export type DecisionResponse = { decisions: Record<string, { decision: Decision; assumption_id: string; at: string }> }
export type McpToolsResponse = { tools: { name: string; description: string }[] }
export type ApiError = { detail: string }

export const API_BASE = process.env.NEXT_PUBLIC_SCOUT_API ?? 'https://scout-agent-lea9.onrender.com'
export const MOCK = process.env.NEXT_PUBLIC_SCOUT_MOCK === '1'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } })
  if (!response.ok) throw (await response.json().catch(() => ({ detail: response.statusText }))) as ApiError
  return response.json() as Promise<T>
}

export const startRun = (body: { raw: string; mode: Mode; budget: number }) => request<StartResponse>('/brain/start', { method: 'POST', body: JSON.stringify(body) })
export const resumeRun = (body: { thread_id: string; resume_token: string; source: ResumeSource; answers: string[]; notes: string; gong?: { call_ids: string[]; from?: string; to?: string }; mcp?: { url: string; token: string; tool: string; args: Record<string, unknown> }; transcripts?: { title: string; transcript: string }[] }) => request<ResumeResponse>('/brain/resume', { method: 'POST', body: JSON.stringify(body) })
export const askScout = (body: { thread_id: string; question: string; resume_token: string }) => request<AskResponse>('/brain/ask', { method: 'POST', body: JSON.stringify(body) })
export const recruitOutreach = (body: { thread_id: string; resume_token: string }) => request<RecruitResponse>('/brain/recruit', { method: 'POST', body: JSON.stringify(body) })
export const saveDecision = (body: { subject: string; mode: Mode; snapshot_key: number | null; title: string; decision: Decision; assumption_id: string }) => request<void>('/brain/decision', { method: 'POST', body: JSON.stringify(body) })
export const getDecisions = (query: { subject: string; mode: Mode; snapshot_key: number | null }) => request<DecisionResponse>(`/brain/decision?subject=${encodeURIComponent(query.subject)}&mode=${encodeURIComponent(query.mode)}${query.snapshot_key != null ? `&snapshot_key=${query.snapshot_key}` : ''}`)
export const discoverMcpTools = (body: { url: string; token: string }) => request<McpToolsResponse>('/brain/mcp/tools', { method: 'POST', body: JSON.stringify(body) })

const ev = (text: string, source: string, url: string, upvotes: number): Evidence => ({ text, source, url, upvotes })
const evidence = [
  ev('I have three docs open and none of them agree on what to do next.', 'Reddit / r/ProductManagement', 'https://www.reddit.com/r/ProductManagement/comments/1a2b3c/research-synthesis/', 126),
  ev('The hard part is not finding interviews. It is turning them into a decision.', 'Product Hunt discussion', 'https://www.producthunt.com/discussions/turning-interviews-into-decisions', 84),
  ev('We keep a giant research repository that nobody checks before roadmap planning.', 'Linear community', 'https://linear.app/community/t/research-repositories/4821', 67),
  ev('Every insight loses context once it leaves the call transcript.', 'Indie Hackers', 'https://www.indiehackers.com/post/research-context-loss-7c31a2', 52),
]
const makeSignal = (signal: string, i: number, trend: SignalTrend, gap_type: GapType = 'researchable'): Signal => ({ signal, frequency: 18-i, severity: (5-i%3) as 1|2|3|4|5, score: 91-i*7, whitespace: i < 3, sentiment: i < 3 ? 'frustrated' : 'curious', quote: evidence[i%4].text, gap: gap_type === 'ask_human' ? 'Needs direct customer validation.' : 'Existing tools stop before the decision.', gap_type, next_step: gap_type === 'ask_human' ? 'Interview 4–6 product leaders.' : 'Compare workflow patterns across teams.', sources: ['Reddit', 'Linear community', 'Product Hunt'], who: ['seed-stage PMs', 'founding teams'], source_url: evidence[i%4].url, source_name: evidence[i%4].source, evidence: i === 0 ? evidence : evidence.slice(0, 2), evidence_count: i === 0 ? 4 : 2, trend, runs_seen: i < 2 ? 3 : 1, history: i === 0 ? [{ at: '2026-06-01', score: 62 }, { at: '2026-07-01', score: 76 }, { at: '2026-08-21', score: 91 }] : [{ at: '2026-08-21', score: 91-i*7 }] })

export const mockStep4: Step4 = {
  subject: 'Evidence-backed product discovery for early teams', mode: 'product', confidence: .82, resolvable_count: 12, gap_count: 4, snapshot_key: 1766300000000000000,
  signals_ranked: [makeSignal('Research is scattered across tools and hard to revisit', 0, 'rising'), makeSignal('Teams need synthesis before prioritization', 1, 'new', 'ask_human'), makeSignal('Interview recruiting is the first bottleneck', 2, 'stable'), makeSignal('Founders want evidence attached to roadmap bets', 3, 'rising'), makeSignal('Existing research tools are archive-first', 4, 'fading'), makeSignal('Small teams share discovery duties', 5, 'stable')],
  since_last_run: { previous_run_at: '2026-07-18T10:00:00Z', runs_on_record: 3, new: ['Synthesis before prioritization'], rising: ['Scattered research'], fading: ['Archive-first workflows'], gone: [] },
  source_stats: [{ source: 'Reddit', fetched: 142, added: 18, hint: 'Strong practitioner language' }, { source: 'Linear community', fetched: 84, added: 11 }, { source: 'Product Hunt', fetched: 61, added: 7 }, { source: 'Indie Hackers', fetched: 38, added: 4 }],
  alerts: [{ kind: 'rising', severity: 5, title: 'Scattered research is accelerating', detail: 'Mentions rose 38% since the last run.', action: 'Ask about current synthesis habits.' }, { kind: 'new', severity: 4, title: 'Decision context is a new pain', detail: 'Teams want evidence attached to roadmap bets.', action: 'Validate with product leads.' }, { kind: 'faded', severity: 2, title: 'Repository complaints faded', detail: 'People are describing a decision problem now.', action: 'Deprioritize archive features.' }, { kind: 'competitor', severity: 3, title: 'Competitors cluster around storage', detail: 'Most alternatives stop at repositories.', action: 'Explore a decision-first wedge.' }, { kind: 'blue_ocean', severity: 5, title: 'Interview-to-roadmap whitespace', detail: 'No clear tool closes the loop from transcript to ranked bet.', action: 'Test the full loop in interviews.' }],
  pain_map: [{ pain: 'Research scattered', detail: 'Signals live in tabs, docs, and calls.', severity: 5, quote: evidence[0].text, who: 'seed-stage PMs', source_url: evidence[0].url, evidence, evidence_count: 4 }, { pain: 'Synthesis is manual', detail: 'Teams repeatedly re-read transcripts.', severity: 4, quote: evidence[1].text, who: 'founding teams', source_url: evidence[1].url, evidence: evidence.slice(1, 3), evidence_count: 2 }],
  questions: Array.from({ length: 8 }, (_, i) => ({ question: ['Walk me through the last time research changed your roadmap.', 'Where do interview notes go after a call?', 'What makes a signal trustworthy enough to act on?', 'Who owns recruiting and scheduling interviews?', 'How do you compare competing customer pains?', 'What happens when your team disagrees on evidence?', 'Which research tools do you pay for today?', 'What would make this workflow indispensable?'][i], why: 'This closes a confidence gap in the market snapshot.', grounded_in: ['Research is scattered across tools and hard to revisit', 'Teams need synthesis before prioritization', 'Interview recruiting is the first bottleneck', 'Founders want evidence attached to roadmap bets', 'Existing research tools are archive-first', 'Small teams share discovery duties'][i%6] ? [['Research is scattered across tools and hard to revisit', 'Teams need synthesis before prioritization', 'Interview recruiting is the first bottleneck', 'Founders want evidence attached to roadmap bets', 'Existing research tools are archive-first', 'Small teams share discovery duties'][i%6]] : [], closes: [['workflow', 'urgency', 'buyer', 'switching_cost'][i%4]], source_url: evidence[i%4].url, source_name: evidence[i%4].source })),
  assumptions: [], needs_human: []
}
mockStep4.assumptions = [
  { id: 'a1', statement: 'Seed-stage teams will share research context before roadmap planning.', confidence: .62, resolution: 'Ask how often evidence is revisited.', status: 'open', evidence: evidence.slice(0, 2) },
  { id: 'a2', statement: 'PMs, not founders, will own the discovery workflow.', confidence: .44, resolution: 'Interview both roles.', status: 'needs_human', evidence: [] },
  { id: 'a3', statement: 'Teams already have transcripts available to connect.', confidence: .57, resolution: 'Ask which call tools they use.', status: 'needs_human', evidence: evidence.slice(2, 3) },
  { id: 'a4', statement: 'Evidence-backed ranking is more valuable than a searchable archive.', confidence: .78, resolution: 'Compare reactions to a ranked shortlist.', status: 'supported', evidence: evidence.slice(0, 2) },
  { id: 'a5', statement: 'Four interviews can resolve the current gaps.', confidence: .51, resolution: 'Run the interview loop.', status: 'needs_human', evidence: [] },
  { id: 'a6', statement: 'A decision snapshot can fit existing team rituals.', confidence: .33, resolution: 'Test export and handoff behavior.', status: 'refuted', evidence: evidence.slice(3, 4) },
]
mockStep4.needs_human = mockStep4.assumptions.filter((a) => a.status === 'needs_human')

export const mockFinal: FinalResponse = {
  subject: mockStep4.subject, mode: 'product', snapshot_key: mockStep4.snapshot_key, confidence: .89, proposed_features: [
    { title: 'Evidence-ranked opportunity brief', confidence: .91, rationale: 'Turns scattered signals into a decision-ready shortlist.', evidence: evidence.slice(0, 3), assumption_id: 'a4' },
    { title: 'Interview loop with gap-aware questions', confidence: .87, rationale: 'Routes unresolved assumptions into focused conversations.', evidence: evidence.slice(1, 4), assumption_id: 'a5' },
    { title: 'Source connectors for research context', confidence: .79, rationale: 'Keeps the original context attached to every signal.', evidence: evidence.slice(0, 2), assumption_id: 'a3' },
    { title: 'Decision snapshots for roadmap handoff', confidence: .74, rationale: 'Makes the why behind a bet durable and shareable.', evidence: evidence.slice(2, 4), assumption_id: 'a6' },
    { title: 'Signal history and change alerts', confidence: .68, rationale: 'Shows what is newly important versus merely loud.', evidence: evidence.slice(0, 2), assumption_id: 'a1' },
  ], ranked_feedback: [{ item: 'Evidence-ranked opportunity brief', priority: 5, kind: 'signal', why: 'Repeated high-severity pain.' }, { item: 'Generic research repository', priority: 1, kind: 'noise', why: 'Archive language is fading.' }], signals_ranked: mockStep4.signals_ranked, assumptions: mockStep4.assumptions, alerts: mockStep4.alerts, blue_ocean: [{ opportunity: 'Interview-to-roadmap loop', why: 'No competitor closes the evidence loop.' }], competitor_changes: ['Dovetail expanded repository workflows.', 'Productboard emphasized prioritization templates.'], since_last_run: mockStep4.since_last_run,
  competitive: { positioning: { x_axis: { label: 'Archive depth', low: 'Lightweight', high: 'Deep' }, y_axis: { label: 'Decision support', low: 'Storage', high: 'Action' }, players: [{ name: 'Dovetail', x: 74, y: 42, is_subject: false, note: 'Deep repository' }, { name: 'Productboard', x: 62, y: 68, is_subject: false, note: 'Roadmap-first' }, { name: 'Grain', x: 38, y: 34, is_subject: false, note: 'Conversation clips' }, { name: 'Notion', x: 57, y: 46, is_subject: false, note: 'Flexible docs' }, { name: 'UserTesting', x: 82, y: 31, is_subject: false, note: 'Research scale' }, { name: 'Canny', x: 49, y: 59, is_subject: false, note: 'Feedback boards' }, { name: 'Scout', x: 27, y: 86, is_subject: true, note: 'Evidence to action' }] }, five_forces: ['Rivalry', 'New entrants', 'Buyer power', 'Supplier power', 'Substitutes'].map((force, i) => ({ force, score: [7, 6, 8, 4, 7][i], level: ['high', 'medium', 'high', 'low', 'high'][i], insight: 'Evidence-backed discovery changes the leverage here.' })), battle_table: [{ name: 'Dovetail', segment: 'Research teams', pricing: '$15/seat', strength: 'Repository depth', weakness: 'Synthesis overhead', how_to_win: 'Decision-first output' }, { name: 'Productboard', segment: 'Scale-ups', pricing: '$20/seat', strength: 'Roadmap workflow', weakness: 'Upstream discovery gap', how_to_win: 'Start before users' }, { name: 'Grain', segment: 'Modern teams', pricing: '$19/seat', strength: 'Clips', weakness: 'No ranking', how_to_win: 'Close the loop' }], whitespace: [{ opportunity: 'Decision snapshots', why_now: 'Teams are drowning in context.', evidence: evidence.slice(0, 2) }], strategy: { beachhead: 'Seed-stage product teams', wedge: 'Evidence-ranked discovery before roadmap', moat: 'Longitudinal signal history', first_90_days: ['Recruit 20 PMs', 'Validate question closes', 'Ship source connectors', 'Test roadmap handoff'] } },
  teardown: [{ competitor: 'Dovetail', pricing: '$15/seat', rating: '4.6/5', complaint: 'Hard to synthesize', switched_from: 'Notion', news: 'Added AI summaries' }, { competitor: 'Productboard', pricing: '$20/seat', rating: '4.4/5', complaint: 'Built for later-stage teams', switched_from: 'Spreadsheets', news: 'Expanded insights' }]
}

export const mockStartResponse: StartResponse = { thread_id: 'thread_linear_01', status: 'needs_feedback', subject: mockStep4.subject, resume_token: 'resume_linear_01', log: ['Parsed product brief', 'Searched Linear-flavored sources', 'Ranked six signals', 'Paused for human interviews'], step4: mockStep4 }
export const mockResumeResponse: ResumeResponse = { thread_id: 'thread_linear_01', status: 'done', proposed_features: mockFinal.proposed_features, final: mockFinal }
export const mockDecisions: DecisionResponse = { decisions: {} }
