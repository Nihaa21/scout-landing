/**
 * Brief data model + fetch seam.
 *
 * Everything the page renders comes through fetchBrief(). Today it returns
 * MOCK_BRIEF; when the backend is live, swap the marked block below for the
 * real fetch — nothing else on the page changes.
 */

export type Sentiment = "positive" | "mixed" | "negative" | "neutral";

export interface Theme {
  title: string;
  sentiment: Sentiment;
  mentions: number;
  sources: string[];
  quote: string;
  gap: string;
  ask: string;
  gap_type: "researchable" | "ask_human";
}

export interface TeardownRow {
  competitor: string;
  pricing: string;
  rating: string;
  complaint: string;
}

export interface InterviewQ {
  question: string;
  why: string; // the decision this answer unlocks
}

export interface Pain {
  pain: string;
  detail: string; // who feels it, when, what it costs — the real scout
  severity: number; // 1-5
  quote: string;
}

export interface Targets {
  key_players: string[];
  switched_from: string[];
  segments: string[];
  pains_to_mine: string[];
}

/* ── competitive breakdown (the MBA layer) ── */
export interface MapPlayer {
  name: string;
  x: number; // 0-100
  y: number; // 0-100
  is_subject: boolean;
  note: string;
}
export interface Positioning {
  x_axis: { label: string; low: string; high: string };
  y_axis: { label: string; low: string; high: string };
  players: MapPlayer[];
}
export interface Force {
  force: string;
  score: number; // 1-10
  level: string;
  insight: string;
}
export interface BattleRow {
  name: string;
  segment: string;
  pricing: string;
  strength: string;
  weakness: string;
  how_to_win: string;
}
export interface Whitespace {
  opportunity: string;
  why_now: string;
  evidence: string;
}
export interface Strategy {
  beachhead: string;
  wedge: string;
  moat: string;
  first_90_days: string[];
}
export interface Competitive {
  positioning?: Positioning;
  five_forces?: Force[];
  battle_table?: BattleRow[];
  whitespace?: Whitespace[];
  strategy?: Strategy;
}

export interface Brief {
  product: string;
  signals: number;
  sources: string[];
  oneThing: string;
  themes: Theme[];
  teardown: TeardownRow[];
  interview: InterviewQ[];
  pains: Pain[];
  targets: Targets;
  competitive: Competitive;
}

/* Mock data — language lifted from real Scout runs on "Jobber". */
export const MOCK_BRIEF: Brief = {
  product: "Jobber",
  signals: 243,
  sources: ["hacker news", "youtube", "app store"],
  oneThing:
    "Owners run their whole day on Jobber — and feel punished for it at exactly two moments: payouts and the pricing page.",
  themes: [
    {
      title: "Payment holds erode trust at the worst moment",
      sentiment: "negative",
      mentions: 9,
      sources: ["app store"],
      quote:
        "They held an $8,000 payment for six days with no explanation. I had payroll due Friday.",
      gap: "How common are payout holds, and what actually triggers them?",
      ask: "Walk me through the last time a payout was delayed — what did it cost you that week?",
      gap_type: "ask_human",
    },
    {
      title: "Tiered pricing reads as a paywall",
      sentiment: "mixed",
      mentions: 8,
      sources: ["hacker news", "youtube"],
      quote:
        "Every feature I actually need lives one tier up. It feels engineered.",
      gap: "Which locked features drive upgrades vs. resentment?",
      ask: "If your plan price stayed the same but one feature moved down a tier, which one would change your week?",
      gap_type: "ask_human",
    },
    {
      title: "Core scheduling is business-critical — and loved",
      sentiment: "positive",
      mentions: 28,
      sources: ["youtube", "app store"],
      quote:
        "Jobber runs my entire day. If it went down, my business stops moving.",
      gap: "What would it take for an owner to switch away despite this?",
      ask: "What's the one thing Jobber does that you'd rebuild first if you had to leave tomorrow?",
      gap_type: "researchable",
    },
    {
      title: "Competitor comparisons deflect prospects on YouTube",
      sentiment: "negative",
      mentions: 12,
      sources: ["youtube"],
      quote:
        "Well, I'm glad I watched this video, because I was about to sign up with Jobber.",
      gap: "Which objections in comparison videos are factual vs. sponsored spin?",
      ask: "What did the comparison video claim that made you hesitate — and did you verify it?",
      gap_type: "researchable",
    },
  ],
  teardown: [
    {
      competitor: "Housecall Pro",
      pricing: "$59 / $149 / $299 mo",
      rating: "4.3 · 204 reviews",
      complaint: "glitchy mobile app",
    },
    {
      competitor: "ServiceTitan",
      pricing: "unpublished",
      rating: "4.5 · 373 reviews",
      complaint: "steep learning curve",
    },
    {
      competitor: "QuoteIQ",
      pricing: "$30 → $299 mo",
      rating: "0 · 1 review",
      complaint: "information overload",
    },
  ],
  interview: [
    {
      question:
        "Walk me through the last time a payout was delayed — what did it cost you that week, in dollars and in stress?",
      why: "Sizes the payment-hold pain in real money → pricing for an instant-payout tier",
    },
    {
      question:
        "If one locked feature moved down a tier, which would change your week — and why that one?",
      why: "Reveals which paywall actually drives upgrade resentment vs. acceptance",
    },
    {
      question:
        "What did you run your business on before this — and what was the moment you decided that had to change?",
      why: "Maps the real switching trigger, not the marketing version of it",
    },
    {
      question:
        "When your crew loses signal in the field, what do you do right now — walk me through yesterday's workaround.",
      why: "Validates offline-first as a wedge and exposes the workaround cost",
    },
    {
      question:
        "You watched a comparison video and hesitated — what claim made you pause, and did you verify it?",
      why: "Separates factual objections from sponsored spin in the deflection funnel",
    },
    {
      question:
        "Who else touched this decision — spouse, office manager, accountant — and what did they push back on?",
      why: "Surfaces the hidden buying committee in owner-operated businesses",
    },
    {
      question:
        "What's the one report or number you check every Friday, and where do you get it today?",
      why: "Finds the retention hook — the metric the product must own",
    },
    {
      question:
        "If your subscription doubled tomorrow, what would you do Monday morning?",
      why: "Tests true willingness to pay and switching-cost perception",
    },
    {
      question:
        "Tell me about the last time the software embarrassed you in front of a customer.",
      why: "Uncovers trust-breaking moments that reviews rarely articulate",
    },
    {
      question:
        "What do you still keep on paper or in your head — and why hasn't any app earned it?",
      why: "Locates the unserved workflow where the next wedge lives",
    },
  ],
  pains: [
    {
      pain: "Payout holds at payroll time",
      detail:
        "Owners run payroll off weekly card settlements. When a processor flags a large job payment and freezes it for days without a named reason or a human to call, the owner covers wages from personal savings or delays their crew — burning trust in both directions. It's the single moment users describe as 'the day I started shopping for alternatives.'",
      severity: 5,
      quote: "They held an $8,000 payment for six days with no explanation. I had payroll due Friday.",
    },
    {
      pain: "Feature paywalls one tier up",
      detail:
        "The features owners describe as table stakes — automatic review requests, job costing, two-way texting — sit one tier above what they pay. Because the jump is per-user, a 6-person crew faces a 3-4x bill to unlock one workflow, so they bolt on free point tools instead and resent the platform they otherwise like.",
      severity: 4,
      quote: "Every feature I actually need lives one tier up. It feels engineered.",
    },
    {
      pain: "No offline mode in the field",
      detail:
        "Crews work in basements, rural routes, and dead zones daily. When the app can't load a job, techs photograph screens the night before or fall back to paper, then re-enter everything at home. Data loss between site and office is the top-mentioned reliability complaint across all major rivals — and nobody has solved it.",
      severity: 4,
      quote: "",
    },
    {
      pain: "Per-seat pricing punishes growth",
      detail:
        "The pricing model inverts the customer's success: hire two techs for the busy season and the software bill jumps before the revenue does. Owners describe gaming seats — sharing logins, keeping field staff off the system — which quietly destroys the data the platform needs to be useful.",
      severity: 3,
      quote: "",
    },
    {
      pain: "Comparison-video deflection at signup",
      detail:
        "Prospects arrive pre-sold, watch one sponsored 'X vs Y' video during trial, and defect before onboarding finishes. The claims are often stale or paid, but no vendor answers them honestly on their own site, so the cheapest-looking option wins the undecided.",
      severity: 3,
      quote: "Well, I'm glad I watched this video, because I was about to sign up with Jobber.",
    },
  ],
  targets: {
    key_players: ["Housecall Pro", "ServiceTitan", "QuoteIQ", "Workiz", "FieldRoutes"],
    switched_from: ["QuickBooks + spreadsheets", "paper scheduling", "Housecall Pro"],
    segments: [
      "solo home-service operators",
      "2-10 crew field teams",
      "franchise trades",
    ],
    pains_to_mine: [
      "payout holds at payroll time",
      "feature paywalls one tier up",
      "offline mode in the field",
      "per-seat pricing at crew scale",
    ],
  },
  competitive: {
    positioning: {
      x_axis: { label: "Breadth of platform", low: "point tool", high: "all-in-one OS" },
      y_axis: { label: "Target operator size", low: "solo", high: "enterprise fleet" },
      players: [
        { name: "Jobber", x: 62, y: 42, is_subject: true, note: "SMB sweet spot, tier-gated" },
        { name: "ServiceTitan", x: 88, y: 85, is_subject: false, note: "enterprise depth, heavy onboarding" },
        { name: "Housecall Pro", x: 58, y: 38, is_subject: false, note: "closest head-to-head" },
        { name: "QuoteIQ", x: 30, y: 22, is_subject: false, note: "cheap wedge on estimates" },
        { name: "Workiz", x: 48, y: 35, is_subject: false, note: "communications-led" },
      ],
    },
    five_forces: [
      { force: "Competitive rivalry", score: 8, level: "high", insight: "Housecall Pro mirrors Jobber's roadmap and sponsors switch-bait comparisons on YouTube." },
      { force: "Threat of new entrants", score: 6, level: "medium", insight: "AI-first quoting tools (QuoteIQ) enter through one painful workflow at $30/mo." },
      { force: "Buyer power", score: 7, level: "high", insight: "Owners actively comparison-shop; payment holds and tier walls trigger churn conversations." },
      { force: "Supplier power", score: 4, level: "medium", insight: "Payments rails (Stripe et al.) and lead sources (Google LSAs) set the margin floor." },
      { force: "Threat of substitutes", score: 5, level: "medium", insight: "QuickBooks + texting + paper remains the real competitor for solo operators." },
    ],
    battle_table: [
      {
        name: "Housecall Pro",
        segment: "1-15 tech home services",
        pricing: "$59 / $149 / $299 mo",
        strength: "brand + review volume",
        weakness: "glitchy mobile app (top review complaint)",
        how_to_win: "win the field: offline-first mobile + payout speed guarantee",
      },
      {
        name: "ServiceTitan",
        segment: "mid-market → enterprise trades",
        pricing: "unpublished, ~$300+/tech",
        strength: "depth: dispatch, marketing, payroll",
        weakness: "steep learning curve; overkill under ~10 techs",
        how_to_win: "be live in a day — onboard in hours, not a 6-week implementation",
      },
      {
        name: "QuoteIQ",
        segment: "solo operators, price-first",
        pricing: "$30 → $299 mo",
        strength: "cheap entry + AI estimates",
        weakness: "thin beyond quoting; 1-review credibility",
        how_to_win: "match the price wedge with a real platform behind it",
      },
    ],
    whitespace: [
      {
        opportunity: "Instant-payout tier for payroll-critical weeks",
        why_now: "Payment holds are the #1 trust breaker in reviews",
        evidence: '"They held an $8,000 payment for six days — I had payroll due Friday."',
      },
      {
        opportunity: "True offline field mode",
        why_now: "Crews lose connectivity daily; nobody serves it well",
        evidence: "Recurring complaint across app-store reviews of all three leaders",
      },
      {
        opportunity: "Flat-rate crew pricing",
        why_now: "Per-seat pricing punishes exactly the teams that grow",
        evidence: '"Every feature I need lives one tier up. It feels engineered."',
      },
    ],
    strategy: {
      beachhead: "2-10 crew home-service teams outgrowing QuickBooks but allergic to ServiceTitan onboarding",
      wedge: "same-day payouts, guaranteed — the moment competitors break trust",
      moat: "payments volume + job-history data compounding into instant underwriting",
      first_90_days: [
        "Ship offline-first mobile scheduling (top complaint on every rival)",
        "Publish a payout-speed SLA and market it against hold horror stories",
        "Land 25 design partners from r/smallbusiness switching threads",
        "Intercept 'Jobber vs X' searches with honest comparison pages",
      ],
    },
  },
};

/** True when a real backend is configured. Exposed so the UI can show an honest
 *  "this takes a few minutes" state only when it's actually calling the agent. */
export const IS_LIVE = Boolean(process.env.NEXT_PUBLIC_API_URL);

export async function fetchBrief(
  product: string,
  mode: "product" | "industry" = "product",
): Promise<Brief> {
  const base = process.env.NEXT_PUBLIC_API_URL;

  // No backend configured → instant mock (great for a snappy demo).
  if (!base) {
    return { ...MOCK_BRIEF, product: product || MOCK_BRIEF.product };
  }

  // Live: call the Scout agent (non-streaming JSON).
  const res = await fetch(`${base.replace(/\/$/, "")}/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product, mode }),
  });
  if (!res.ok) {
    throw new Error(`Scout API returned ${res.status}`);
  }
  const d = await res.json();

  return mapBrief(d, product);
}

/** Map the API payload to the Brief shape. Only rename: one_thing → oneThing;
 *  everything else lines up 1:1. */
function mapBrief(d: Record<string, unknown>, product: string): Brief {
  const t = (d.targets as Partial<Targets>) ?? {};
  return {
    product: (d.product as string) ?? product,
    signals: (d.signals as number) ?? 0,
    sources: (d.sources as string[]) ?? [],
    oneThing: (d.one_thing as string) ?? "",
    themes: ((d.themes as Theme[]) ?? []).map((t) => ({
      ...t,
      sources: t.sources ?? [],
      gap_type: t.gap_type ?? "researchable",
    })),
    teardown: (d.teardown as TeardownRow[]) ?? [],
    interview: (d.interview as InterviewQ[]) ?? [],
    pains: (d.pains as Pain[]) ?? [],
    targets: {
      key_players: t.key_players ?? [],
      switched_from: t.switched_from ?? [],
      segments: t.segments ?? [],
      pains_to_mine: t.pains_to_mine ?? [],
    },
    competitive: (d.competitive as Competitive) ?? {},
  };
}

/** Progress events streamed by the agent while a run is in flight. */
export type ScoutEvent =
  | { event: "routed"; sources: string[] }
  | { event: "source"; source: string; count: number; pool: number }
  | { event: "synthesis"; themes_count: number }
  | { event: "teardown"; count: number }
  | { event: "competitive"; ok: boolean }
  | { event: "cached" }
  | { event: "error"; detail?: string }
  | { event: "brief"; brief: Record<string, unknown> };

/**
 * Run a research request, calling `onEvent` as each stage completes so the UI can
 * show partial progress. Resolves with the final Brief.
 *
 * Live: consumes the backend's SSE stream. Mock: simulates the same events with
 * small delays so the animation still plays with no backend.
 */
export async function researchStream(
  product: string,
  mode: "product" | "industry",
  onEvent: (e: ScoutEvent) => void,
): Promise<Brief> {
  const base = process.env.NEXT_PUBLIC_API_URL;

  // ── Mock: replay a plausible event sequence, then return the mock brief. ──
  if (!base) {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    onEvent({ event: "routed", sources: MOCK_BRIEF.sources });
    let pool = 0;
    for (const s of MOCK_BRIEF.sources) {
      await sleep(650);
      pool += 30;
      onEvent({ event: "source", source: s, count: 30, pool });
    }
    await sleep(650);
    onEvent({ event: "synthesis", themes_count: MOCK_BRIEF.themes.length });
    await sleep(500);
    onEvent({ event: "teardown", count: MOCK_BRIEF.teardown.length });
    return { ...MOCK_BRIEF, product: product || MOCK_BRIEF.product };
  }

  // ── Live: consume Server-Sent Events from POST /research. ──
  const res = await fetch(`${base.replace(/\/$/, "")}/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({ product, mode }),
  });
  if (!res.ok || !res.body) {
    throw new Error(`Scout API returned ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalBrief: Brief | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line.
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";
    for (const frame of frames) {
      const dataLine = frame.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      const payload = dataLine.slice(5).trim();
      if (!payload) continue;
      let ev: ScoutEvent;
      try {
        ev = JSON.parse(payload);
      } catch {
        continue;
      }
      onEvent(ev);
      if (ev.event === "error") throw new Error(ev.detail ?? "Scout run failed");
      if (ev.event === "brief") finalBrief = mapBrief(ev.brief, product);
    }
  }

  if (!finalBrief) throw new Error("No brief received from Scout");
  return finalBrief;
}
