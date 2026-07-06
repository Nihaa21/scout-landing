/**
 * Brief data model + fetch seam.
 *
 * Everything the page renders comes through fetchBrief(). Today it returns
 * MOCK_BRIEF; when the backend is live, swap the marked block below for the
 * real fetch — nothing else on the page changes.
 */

export type Sentiment = "positive" | "mixed" | "negative";

export interface Theme {
  title: string;
  sentiment: Sentiment;
  mentions: number;
  quote: string;
  gap: string;
  ask: string;
}

export interface TeardownRow {
  competitor: string;
  pricing: string;
  rating: string;
  complaint: string;
}

export interface Brief {
  product: string;
  signals: number;
  sources: string[];
  oneThing: string;
  themes: Theme[];
  teardown: TeardownRow[];
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
      quote:
        "They held an $8,000 payment for six days with no explanation. I had payroll due Friday.",
      gap: "How common are payout holds, and what actually triggers them?",
      ask: "Walk me through the last time a payout was delayed — what did it cost you that week?",
    },
    {
      title: "Tiered pricing reads as a paywall",
      sentiment: "mixed",
      mentions: 8,
      quote:
        "Every feature I actually need lives one tier up. It feels engineered.",
      gap: "Which locked features drive upgrades vs. resentment?",
      ask: "If your plan price stayed the same but one feature moved down a tier, which one would change your week?",
    },
    {
      title: "Core scheduling is business-critical — and loved",
      sentiment: "positive",
      mentions: 28,
      quote:
        "Jobber runs my entire day. If it went down, my business stops moving.",
      gap: "What would it take for an owner to switch away despite this?",
      ask: "What's the one thing Jobber does that you'd rebuild first if you had to leave tomorrow?",
    },
    {
      title: "Competitor comparisons deflect prospects on YouTube",
      sentiment: "negative",
      mentions: 12,
      quote:
        "Well, I'm glad I watched this video, because I was about to sign up with Jobber.",
      gap: "Which objections in comparison videos are factual vs. sponsored spin?",
      ask: "What did the comparison video claim that made you hesitate — and did you verify it?",
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
 *  themes/teardown fields already line up 1:1. */
function mapBrief(d: Record<string, unknown>, product: string): Brief {
  return {
    product: (d.product as string) ?? product,
    signals: (d.signals as number) ?? 0,
    sources: (d.sources as string[]) ?? [],
    oneThing: (d.one_thing as string) ?? "",
    themes: (d.themes as Theme[]) ?? [],
    teardown: (d.teardown as TeardownRow[]) ?? [],
  };
}

/** Progress events streamed by the agent while a run is in flight. */
export type ScoutEvent =
  | { event: "routed"; sources: string[] }
  | { event: "source"; source: string; count: number; pool: number }
  | { event: "synthesis"; themes_count: number }
  | { event: "teardown"; count: number }
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
