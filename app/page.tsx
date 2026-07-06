"use client";

import { useEffect, useRef, useState } from "react";
import LiveBrief, { type Phase } from "@/components/LiveBrief";
import { MOCK_BRIEF, researchStream, IS_LIVE, type Brief } from "@/lib/brief";

const STAGE_LABEL: Record<string, string> = {
  routing: "routing sources…",
  gathering: "reading sources…",
  synthesizing: "finding the themes…",
  teardown: "scraping competitors…",
  competitive: "building the competitive breakdown…",
};

export default function Home() {
  const [query, setQuery] = useState("Jobber");
  const [mode, setMode] = useState<"product" | "industry">("product");
  const [brief, setBrief] = useState<Brief>(MOCK_BRIEF);
  const [phase, setPhase] = useState<Phase>("done");
  const [lit, setLit] = useState(MOCK_BRIEF.sources.length + 1); // all lit at rest
  const [srcRow, setSrcRow] = useState<string[]>(MOCK_BRIEF.sources);
  const [signals, setSignals] = useState(0);
  const [stage, setStage] = useState<string | undefined>();
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (ticker.current) clearInterval(ticker.current);
    },
    [],
  );

  async function runScout(e: React.FormEvent) {
    e.preventDefault();
    if (ticker.current) clearInterval(ticker.current);

    setPhase("scouting");
    setError(null);
    setLit(0);
    setSignals(0);
    setElapsed(0);
    setStage(STAGE_LABEL.routing);
    setSrcRow(brief.sources); // shown until the router reports the real sources

    const startedAt = Date.now();
    ticker.current = setInterval(
      () => setElapsed(Math.round((Date.now() - startedAt) / 1000)),
      1000,
    );

    let gathered = 0;
    let numSources = brief.sources.length;
    try {
      // Drive the UI from real stream events. Labels lead the stage they START
      // (events fire on completion), so the status reflects what's happening now.
      const final = await researchStream(query.trim(), mode, (ev) => {
        switch (ev.event) {
          case "routed":
            numSources = ev.sources.length;
            setSrcRow(ev.sources);
            setStage(STAGE_LABEL.gathering);
            break;
          case "source":
            gathered += 1;
            setLit(gathered);
            setSignals(ev.pool);
            if (gathered >= numSources) setStage(STAGE_LABEL.synthesizing);
            break;
          case "synthesis":
            setLit(numSources); // all sources in; teardown is next
            setStage(STAGE_LABEL.teardown);
            break;
          case "teardown":
            setStage(STAGE_LABEL.competitive); // teardown done; strategy pass runs now
            break;
        }
      });
      setBrief(final);
      setSrcRow(final.sources);
      setPhase("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scout run failed.");
      setPhase("done");
    } finally {
      if (ticker.current) clearInterval(ticker.current);
    }
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
            className="mt-8 max-w-md"
          >
            {/* mode toggle: research a product, or an industry/space */}
            <div
              role="tablist"
              aria-label="Research mode"
              className="inline-flex hairline rounded-[10px] p-0.5 mb-2.5 font-mono text-[11px]"
            >
              {(["product", "industry"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 rounded-[8px] transition-colors ${
                    mode === m
                      ? "bg-accent text-paper"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5">
            <label htmlFor="subject" className="sr-only">
              {mode === "industry" ? "Industry to research" : "Product to research"}
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                mode === "industry" ? "Enter an industry…" : "Enter a product…"
              }
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
            </div>
          </form>
        </div>

        {/* the live brief — centerpiece */}
        <div className="pb-24">
          {error && (
            <p
              role="alert"
              className="max-w-3xl mx-auto mb-3 text-[12.5px] text-neg font-mono"
            >
              ⚠ {error} — showing the last brief.
            </p>
          )}
          <LiveBrief
            brief={brief}
            phase={phase}
            lit={lit}
            sources={srcRow}
            signals={signals}
            stage={stage}
            elapsed={elapsed}
            live={IS_LIVE}
          />
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
