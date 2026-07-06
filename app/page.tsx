"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import LiveBrief, { type Phase } from "@/components/LiveBrief";
import { prettySource, type SourceStatus, type TheaterStage } from "@/components/Theater";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { researchStream, IS_LIVE, type Brief } from "@/lib/brief";

const SUGGESTIONS: { label: string; mode: "product" | "industry" }[] = [
  { label: "Jobber", mode: "product" },
  { label: "Notion", mode: "product" },
  { label: "on-device AI agents", mode: "industry" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"product" | "industry">("product");
  const [brief, setBrief] = useState<Brief | null>(null);
  const [subject, setSubject] = useState(""); // what the current/last run is about
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
    const q = query.trim();
    if (!q) return;
    if (ticker.current) clearInterval(ticker.current);

    setSubject(q);
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
      const final = await researchStream(q, mode, (ev) => {
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

  const showBrief = phase === "scouting" || brief !== null;

  return (
    <div className="flex flex-1 flex-col">
      <p className="sr-only">
        Scout is a research agent for 0-to-1 product work. Enter a product or an
        industry and it gathers public feedback across platforms live, extracts
        ranked themes with quotes, maps detailed pain points, builds an interview
        agenda, and produces a full competitive breakdown.
      </p>

      <main className="flex-1 px-5 sm:px-8">
        {/* centered identity + input */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`no-print max-w-2xl mx-auto text-center ${showBrief ? "pt-12 sm:pt-16 pb-10" : "pt-24 sm:pt-36 pb-16"}`}
        >
          {/* branding — big, center */}
          <p className="text-[52px] sm:text-[68px] leading-none font-semibold tracking-[-0.04em]">
            Scout
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[var(--color-hairline)]" />
            <p className="font-mono text-[13px] sm:text-[14px] tracking-[0.12em] uppercase text-ink-soft">
              <span className="text-accent font-semibold">0→1</span> product research
            </p>
            <span className="h-px w-8 bg-[var(--color-hairline)]" />
          </div>

          <h1 className="mt-8 text-[17px] sm:text-[19px] font-normal text-ink-soft leading-relaxed max-w-[46ch] mx-auto">
            Research what the market thinks — before you build it.
            <span className="block mt-2">
              Scout reads the crowd live, finds the themes, maps the pain,
              writes your user interview questions, and hands you the brief.
            </span>
          </h1>

          <form onSubmit={runScout} className="mt-9 max-w-md mx-auto">
            {/* mode toggle — centered */}
            <div
              role="tablist"
              aria-label="Research mode"
              className="inline-flex hairline rounded-[10px] p-0.5 mb-3 text-[12px] font-semibold"
            >
              {(["product", "industry"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className={`px-3.5 py-1 rounded-[8px] capitalize transition-colors duration-200 cursor-pointer ${
                    mode === m ? "bg-accent text-white shadow-sm" : "text-ink-soft hover:text-ink"
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
                className="flex-1 text-center sm:text-left"
              />
              <Button type="submit" disabled={phase === "scouting" || !query.trim()}>
                {phase === "scouting" ? "Scouting…" : "Run Scout"}
              </Button>
            </div>

            {/* suggestions — not dummy data, just one-tap starts */}
            {!showBrief && (
              <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
                <span className="font-mono text-[10.5px] text-ink-faint">try</span>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => {
                      setQuery(s.label);
                      setMode(s.mode);
                    }}
                    className="hairline rounded-full px-3 py-1 text-[11.5px] text-ink-soft hover:text-ink hover:border-accent/50 transition-colors duration-200 cursor-pointer"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </form>
        </motion.div>

        {/* the live brief — only exists once a run starts */}
        {showBrief && (
          <div className="pb-24">
            {error && (
              <p role="alert" className="max-w-6xl mx-auto mb-3 text-[12.5px] text-neg font-mono">
                ⚠ {error}
              </p>
            )}
            <LiveBrief
              product={subject}
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
        )}
      </main>

      <footer className="no-print hairline-t px-5 sm:px-8 py-4">
        <p className="font-mono text-[11px] text-ink-faint max-w-6xl mx-auto text-center">
          scout · autonomous voice-of-customer research
        </p>
      </footer>
    </div>
  );
}
