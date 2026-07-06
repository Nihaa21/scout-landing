"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import LiveBrief, { type Phase } from "@/components/LiveBrief";
import { prettySource, type SourceStatus, type TheaterStage } from "@/components/Theater";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_BRIEF, researchStream, IS_LIVE, type Brief } from "@/lib/brief";

export default function Home() {
  const [query, setQuery] = useState("Jobber");
  const [mode, setMode] = useState<"product" | "industry">("product");
  const [brief, setBrief] = useState<Brief>(MOCK_BRIEF);
  const [phase, setPhase] = useState<Phase>("done");

  // theater state
  const [roster, setRoster] = useState<string[] | null>(null);
  const [statuses, setStatuses] = useState<Record<string, SourceStatus>>({});
  const [stage, setStage] = useState<TheaterStage>("routing");
  const [signals, setSignals] = useState(0);
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
    setRoster(null);
    setStatuses({});
    setSignals(0);
    setElapsed(0);
    setStage("routing");

    const startedAt = Date.now();
    ticker.current = setInterval(
      () => setElapsed(Math.round((Date.now() - startedAt) / 1000)),
      1000,
    );

    let chosen: string[] = [];
    let doneCount = 0;
    try {
      const final = await researchStream(query.trim(), mode, (ev) => {
        switch (ev.event) {
          case "routed": {
            chosen = ev.sources.map(prettySource);
            setRoster(chosen);
            setStatuses(Object.fromEntries(chosen.map((s) => [s, { state: "active" }])));
            setStage("gathering");
            break;
          }
          case "source": {
            const name = prettySource(ev.source);
            doneCount += 1;
            setStatuses((prev) => ({
              ...prev,
              [name]: { state: "done", count: ev.count },
            }));
            setSignals(ev.pool);
            if (doneCount >= chosen.length) setStage("synthesizing");
            break;
          }
          case "synthesis":
            setStage("teardown");
            break;
          case "teardown":
            setStage("competitive");
            break;
        }
      });
      setBrief(final);
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
        Scout is a research agent for 0-to-1 product work. Enter a product or an
        industry and it gathers public feedback across platforms, extracts ranked
        themes with quotes, maps detailed pain points, builds an interview agenda,
        and produces a full competitive breakdown. Below is a live example brief.
      </p>

      {/* masthead */}
      <header className="hairline-b px-5 sm:px-8">
        <div className="max-w-6xl mx-auto py-4 flex items-baseline gap-3">
          <p className="text-[19px] font-medium tracking-[-0.01em]">scout</p>
          <p className="font-mono text-[11px] text-ink-soft">0→1 product research</p>
        </div>
      </header>

      {/* hero */}
      <main className="flex-1 px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl mx-auto pt-14 sm:pt-20 pb-10 sm:pb-14"
        >
          <h1 className="text-[26px] sm:text-[34px] leading-[1.2] font-normal tracking-[-0.01em] max-w-[26ch]">
            Research what the market thinks — before you build it.
          </h1>
          <p className="mt-4 text-[15px] text-ink-soft max-w-[52ch]">
            Scout reads the crowd across platforms, finds the themes, maps the
            pain, and hands you the brief — with the questions worth asking humans.
          </p>

          <form onSubmit={runScout} className="mt-8 max-w-md">
            {/* mode toggle */}
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
                  className={`px-3 py-1 rounded-[8px] transition-colors duration-200 cursor-pointer ${
                    mode === m ? "bg-accent-deep text-ink" : "text-ink-soft hover:text-ink"
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
              <Input
                id="subject"
                name="subject"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={mode === "industry" ? "Enter an industry…" : "Enter a product…"}
                autoComplete="off"
                className="flex-1"
              />
              <Button type="submit" disabled={phase === "scouting"}>
                {phase === "scouting" ? "Scouting…" : "Run Scout"}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* the live brief — centerpiece */}
        <div className="pb-24">
          {error && (
            <p role="alert" className="max-w-6xl mx-auto mb-3 text-[12.5px] text-neg font-mono">
              ⚠ {error} — showing the last brief.
            </p>
          )}
          <LiveBrief
            brief={brief}
            phase={phase}
            roster={roster}
            statuses={statuses}
            stage={stage}
            signals={signals}
            elapsed={elapsed}
            live={IS_LIVE}
          />
        </div>
      </main>

      <footer className="hairline-t px-5 sm:px-8 py-4">
        <p className="font-mono text-[11px] text-ink-faint max-w-6xl mx-auto">
          scout · autonomous voice-of-customer research
        </p>
      </footer>
    </div>
  );
}
