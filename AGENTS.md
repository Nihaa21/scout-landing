<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Scout landing + crons — rules for every agent

- This repo (`Nihaa21/scout-landing`) is deployed by Vercel as the project
  `scout-landing`. It exists for two things: the **crons** in `vercel.json`
  (`/api/keepalive` daily 06:00 UTC keeps the Render backend awake;
  `/api/watch-refresh` Sundays 12:00 UTC re-listens to stale watched markets)
  and the `/app/stats` visitor page. `/` and `/app` redirect to the canonical
  console `https://scout-vision-console.vercel.app` (see `next.config.ts`).
- The old console under `app/app/` is superseded by the Lovable-built one in
  `github.com/Nihaa21/scout-vision-console`. Don't extend it; remove it only in a
  deliberate PR that keeps `/app/stats` and the redirects working.
- Commands: `npm i`, `npm run dev`, `npm run build` (must pass before pushing).
  `main` is live (Vercel auto-deploys it); pull first, then commit straight to
  `main`. Never force-push.
- Never change the cron schedules or paths without the owner; the backend
  throttles refreshes to once per 20 h per market, so more frequent crons only
  burn API credits.
- Onboarding for new agents: `GROK_HANDOFF.md` in the backend repo.
