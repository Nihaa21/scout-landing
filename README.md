# scout — landing site

Editorial, single-page landing for the Scout research agent. Warm paper, ink
text, one muted blue accent, hairline borders — a research instrument, not a
marketing site.

**Status: local preview only.** Not wired to git, GitHub, or Vercel yet.

## Run

```bash
npm install
npm run dev        # → http://localhost:3000
```

## What's on the page

1. Mono wordmark — `scout / 0→1 product research`
2. Hero — headline, one-line subhead, product input + **Run Scout**
3. **The live brief** (centerpiece) — header (`product · live · N signals`),
   sources that light up sequentially on a run, "the one thing" insight,
   theme cards (sentiment dot · mentions · serif quote · `gap → ask` reveal),
   and a hairline competitive-teardown table
4. Footer

"Run Scout" replays the source-lighting animation and re-populates the brief.

## Data

Everything renders from `lib/brief.ts` (`MOCK_BRIEF` — language taken from real
Scout runs on "Jobber"). The API seam is `fetchBrief()` in the same file: when
the backend is live, replace the mock return with

```ts
const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/research?product=...`
);
return res.json();
```

Nothing outside that function needs to change. `NEXT_PUBLIC_API_URL` is the one
reserved env var.

## Stack

Next.js (app router) · Tailwind v4 · Geist / Geist Mono via `next/font`
(serif quotes use the system Georgia stack).
