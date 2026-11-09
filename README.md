# scout — landing site

Public landing for the Scout research agent, plus the Vercel crons in
`vercel.json`. Design follows the same system as the console. See the Design
bullet in `AGENTS.md` and `VISUAL-SYSTEM-v2.md`: terracotta ramp (`#E0703A` /
text `#AE4F22` / button `#BF5527`), Inter + JetBrains Mono, 1px hairlines,
radii 8/12/18.

## Run

```bash
npm install
npm run dev        # → http://localhost:3000
npm run build      # must pass before pushing
```

## What's on the page

1. Wordmark — `Scout`
2. Eyebrow — `0→1 market research`
3. Hero — the 0→1 headline, sub, **Open Scout**, and the paste hint
4. Source strip — eight public sources, in locked order
5. How it works — three steps
6. One run. Four places to look — Radar, Competitor, Interviews, Roadmap
7. Closing lines, second Open Scout, and the footer

Open Scout goes to the canonical console. The page copy lives in `app/page.tsx`.

## Stack

Next.js (app router) · Tailwind v4 · Inter / JetBrains Mono via `next/font`
