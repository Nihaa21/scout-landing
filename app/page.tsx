"use client";

import { useEffect, useRef, useState } from "react";
import LiveBrief, { type Phase } from "@/components/LiveBrief";
import { MOCK_BRIEF, fetchBrief, type Brief } from "@/lib/brief";

const STEP_MS = 700; // per-source light-up
const TEARDOWN_MS = 1100; // the teardown step takes a beat longer

export default function Home() {
  const [query, setQuery] = useState("Jobber");
  const [brief, setBrief] = useState<Brief>(MOCK_BRIEF);
  const [phase, setPhase] = useState<Phase>("done");
  const [lit, setLit] = useState(MOCK_BRIEF.sources.length + 1); // all lit at rest
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function runScout(e: React.FormEvent) {
    e.preventDefault();
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const steps = brief.sources.length; // sources, then teardown
    setPhase("scouting");
    setLit(0);

    for (let i = 1; i <= steps; i++) {
      timers.current.push(setTimeout(() => setLit(i), i * STEP_MS));
    }
    timers.current.push(
      setTimeout(
        async () => {
          setLit(steps + 1);
          const next = await fetchBrief(query.trim());
          setBrief(next);
          setPhase("done");
        },
        steps * STEP_MS + TEARDOWN_MS,
      ),
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <p className="sr-only">
        Scout is a research agent for 0-to-1 product work. Enter a product name
        and it gathers public feedback from Hacker News, YouTube and app
        reviews, extracts the dominant themes with quotes, routes each open
        question to research or a user interview, and builds a competitive
        teardown. Below is a live example brief for Jobber.
      </p>

      {/* masthead */}
      <header className="hairline-b px-5 sm:px-8">
        <div className="max-w-3xl mx-auto py-4 flex items-baseline gap-3">
          <p className="text-[19px] font-medium tracking-[-0.01em]">scout</p>
          <p className="font-mono text-[11px] text-ink-soft">
            0→1 product research
          </p>
        </div>
      </header>

      {/* hero */}
      <main className="flex-1 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto pt-14 sm:pt-20 pb-10 sm:pb-14">
          <h1 className="text-[26px] sm:text-[34px] leading-[1.2] font-normal tracking-[-0.01em] max-w-[26ch] text-ink">
            Research what the market thinks — before you build it.
          </h1>
          <p className="mt-4 text-[15px] text-ink-soft max-w-[52ch]">
            Scout reads Hacker News, YouTube and app reviews, finds the themes,
            and hands you the brief — with the questions worth asking humans.
          </p>

          <form
            onSubmit={runScout}
            className="mt-8 flex flex-col sm:flex-row gap-2.5 max-w-md"
          >
            <label htmlFor="product" className="sr-only">
              Product to research
            </label>
            <input
              id="product"
              name="product"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a product…"
              autoComplete="off"
              className="hairline rounded-[12px] bg-transparent px-4 py-2.5 text-[14px] flex-1 placeholder:text-ink-faint focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={phase === "scouting"}
              className="rounded-[12px] bg-accent text-paper px-5 py-2.5 text-[14px] font-medium transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {phase === "scouting" ? "Scouting…" : "Run Scout"}
            </button>
          </form>
        </div>

        {/* the live brief — centerpiece */}
        <div className="pb-24">
          <LiveBrief brief={brief} phase={phase} lit={lit} />
        </div>
      </main>

      <footer className="hairline-t px-5 sm:px-8 py-4">
        <p className="font-mono text-[11px] text-ink-faint max-w-3xl mx-auto">
          scout · autonomous voice-of-customer research · local preview
        </p>
      </footer>
    </div>
  );
}
