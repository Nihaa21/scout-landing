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

export async function fetchBrief(product: string): Promise<Brief> {
  /* ── API seam ──────────────────────────────────────────────────────
     When the Scout backend is live, replace the mock return with:

       const res = await fetch(
         `${process.env.NEXT_PUBLIC_API_URL}/research?product=${encodeURIComponent(product)}`
       );
       return res.json();

     The component layer only knows the Brief shape — nothing else moves.
     ─────────────────────────────────────────────────────────────────── */
  return { ...MOCK_BRIEF, product: product || MOCK_BRIEF.product };
}
