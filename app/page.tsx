"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { track } from "@/lib/track";

const SURFACES = [
  {
    id: "radar",
    label: "Radar",
    job: "See what moved in the market since the last listen.",
  },
  {
    id: "competitor",
    label: "Competitor",
    job: "Spot their gaps — complaints, pricing, latest moves — with receipts.",
  },
  {
    id: "interviews",
    label: "Interviews",
    job: "Turn unsettled research into Mom-Test questions you can ask.",
  },
  {
    id: "roadmap",
    label: "Roadmap",
    job: "Rank what to build next against the evidence that closed the assumption.",
  },
] as const;

type SurfaceId = (typeof SURFACES)[number]["id"];

export default function Home() {
  const [active, setActive] = useState<SurfaceId>("radar");

  useEffect(() => {
    track("page_view", {
      page: "landing",
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });
  }, []);

  const surface = SURFACES.find((item) => item.id === active) ?? SURFACES[0];

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const key = event.key;
    if (key !== "ArrowRight" && key !== "ArrowLeft" && key !== "Home" && key !== "End") return;
    event.preventDefault();
    const next =
      key === "ArrowRight"
        ? (index + 1) % SURFACES.length
        : key === "ArrowLeft"
          ? (index - 1 + SURFACES.length) % SURFACES.length
          : key === "Home"
            ? 0
            : SURFACES.length - 1;
    const id = SURFACES[next].id;
    setActive(id);
    document.getElementById(`surface-${id}`)?.focus();
  }

  return (
    <div className="flex flex-1 flex-col">
      <p className="sr-only">
        Scout researches what the market thinks before you build it. The console
        surfaces are Radar, Competitor, Interviews, and Roadmap.
      </p>

      <main className="flex-1 px-5 sm:px-8">
        <div className="mx-auto w-full max-w-[960px] pt-14 pb-16 sm:pt-20 sm:pb-20">
          <p className="text-[15px] font-medium tracking-[-0.02em]">Scout</p>

          <h1 className="mt-8 max-w-[17em] text-[32px] font-medium leading-[1.15] tracking-[-0.035em] text-ink sm:max-w-[20em] sm:text-[40px]">
            Research what the market thinks — before you build it.
          </h1>
          <p className="mt-4 max-w-[40rem] text-[15px] leading-relaxed text-ink-soft">
            Enterpret’s brain, pointed at the market you’re entering.
          </p>

          <section
            className="hairline mt-10 overflow-hidden rounded-[12px] bg-paper"
            aria-label="What’s inside Scout"
          >
            <div role="tablist" aria-label="Console surfaces" className="flex gap-6 overflow-x-auto border-b-[0.5px] border-[var(--color-hairline)] px-4 sm:px-5">
              {SURFACES.map((item, index) => {
                const selected = item.id === active;
                return (
                  <button
                    key={item.id}
                    id={`surface-${item.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="surface-peek"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(item.id)}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                    className={`-mb-px shrink-0 border-b-2 py-3 text-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
                      selected
                        ? "border-accent text-accent"
                        : "border-transparent text-ink-soft hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <p className="min-h-[2.6rem] px-4 pt-3 text-[14px] leading-snug text-ink sm:px-5" aria-live="polite">
              {surface.job}
            </p>

            <div
              id="surface-peek"
              role="tabpanel"
              aria-labelledby={`surface-${surface.id}`}
              className="mt-3 h-[268px] overflow-x-auto overflow-y-hidden border-t-[0.5px] border-[var(--color-hairline)]"
            >
              <div className="flex justify-end px-4 pt-2 sm:px-5">
                <span className="font-mono text-[10px] text-ink-faint">Sample data</span>
              </div>
              {active === "radar" && <RadarPeek />}
              {active === "competitor" && <CompetitorPeek />}
              {active === "interviews" && <InterviewsPeek />}
              {active === "roadmap" && <RoadmapPeek />}
            </div>
          </section>

          <div className="mt-8">
            <Link
              href="/app"
              onClick={() => track("console_click", { from: "hero" })}
              className="inline-flex items-center rounded-[10px] bg-accent px-6 py-3 text-[14px] font-semibold text-white hover:bg-accent-deep transition-colors duration-200"
            >
              Open Scout
            </Link>
            <p className="mt-3 font-mono text-[11px] text-ink-faint">
              paste a pitch, a URL, an industry, competitors, or notes
            </p>
          </div>
        </div>
      </main>

      <footer className="no-print hairline-t px-5 py-4 sm:px-8">
        <p className="mx-auto max-w-[960px] text-center font-mono text-[11px] text-ink-faint">
          Scout · Autonomous Voice-of-Customer Research
        </p>
      </footer>
    </div>
  );
}

function RadarPeek() {
  const rows = [
    ["Research is scattered across tools", "18", "91", "rising", "62 76 91"],
    ["Teams need synthesis before prioritization", "17", "84", "new", ""],
    ["Interview recruiting is the first bottleneck", "16", "77", "stable", ""],
    ["Founders want evidence on roadmap bets", "15", "70", "rising", ""],
    ["Existing tools are archive-first", "14", "63", "fading", ""],
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-2.5 sm:px-5">
        <span className="text-[12px] font-medium">Since last run</span>
        <span className="font-mono text-[10px] text-ink-faint">3 runs · 21 Aug</span>
        <span className="font-mono text-[10px] text-[color:var(--color-pos)]">rising · Scattered research</span>
        <span className="font-mono text-[10px] text-accent">new · Synthesis before prioritization</span>
        <span className="font-mono text-[10px] text-[color:var(--color-mid)]">fading · Archive-first workflows</span>
      </div>
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="border-y-[0.5px] border-[var(--color-hairline)] font-mono text-[10px] text-ink-faint">
            <th className="px-4 py-2 font-normal sm:px-5">Signal</th>
            <th className="w-12 px-2 py-2 font-normal sm:w-14">Freq</th>
            <th className="w-12 px-2 py-2 font-normal sm:w-14">Score</th>
            <th className="w-16 px-2 py-2 font-normal sm:w-28">Trend</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([signal, freq, score, trend, spark]) => (
            <tr key={signal} className="border-b-[0.5px] border-[var(--color-hairline)] text-[12.5px]">
              <td className="px-4 py-2.5 sm:px-5">{signal}</td>
              <td className="px-2 py-2.5 font-mono tabular-nums text-ink-soft">{freq}</td>
              <td className="px-2 py-2.5 font-mono tabular-nums">{score}</td>
              <td className="px-2 py-2.5">
                <span className="inline-flex items-center gap-2">
                  <Trend trend={trend} />
                  {spark ? <Spark series={spark} /> : null}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CompetitorPeek() {
  const rows = [
    ["Dovetail", "$15/seat", "4.6", "Hard to synthesize", "Added AI summaries", "▲ $12 → $15"],
    ["Productboard", "$20/seat", "4.4", "Built for later-stage teams", "Expanded insights", "no change"],
    ["Grain", "$19/seat", "—", "Clips, no ranking", "—", "no change"],
    ["Canny", "usage", "—", "Boards stall before a decision", "New board templates", "▲ templates"],
  ] as const;

  return (
    <div>
      <p className="px-4 pt-1 pb-2 text-[12px] font-medium sm:px-5">Competitor intel</p>
      <div className="sm:hidden">
        {rows.map(([name, pricing, rating, complaint, move, delta]) => (
          <div key={name} className="border-t-[0.5px] border-[var(--color-hairline)] px-4 py-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] font-medium">{name}</span>
              <span className="shrink-0 font-mono text-[11px] text-ink-soft">{pricing} · {rating}</span>
            </div>
            <p className="mt-1 text-[12.5px] text-[color:var(--color-neg)]">{complaint}</p>
            <p className="mt-1 font-mono text-[10px] text-ink-faint">{move} · {delta} · receipt · forum</p>
          </div>
        ))}
      </div>
      <table className="hidden w-full border-collapse text-left sm:table">
        <thead>
          <tr className="border-y-[0.5px] border-[var(--color-hairline)] font-mono text-[10px] text-ink-faint">
            {["Competitor", "Pricing", "Rating", "Top complaint", "Latest move", "Δ"].map((heading) => (
              <th key={heading} className="px-3 py-2 font-normal first:pl-4 first:sm:pl-5">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, pricing, rating, complaint, move, delta]) => (
            <tr key={name} className="border-b-[0.5px] border-[var(--color-hairline)] align-top text-[12.5px]">
              <td className="py-2.5 pr-3 pl-4 font-medium sm:pl-5">{name}</td>
              <td className="px-3 py-2.5 font-mono text-[11px]">{pricing}</td>
              <td className="px-3 py-2.5 font-mono tabular-nums">{rating}</td>
              <td className="px-3 py-2.5 text-[color:var(--color-neg)]">
                {complaint}
                <span className="mt-0.5 block font-mono text-[10px] text-ink-faint">receipt · forum</span>
              </td>
              <td className="px-3 py-2.5 text-ink-soft">{move}</td>
              <td className="px-3 py-2.5 font-mono text-[10px] text-[color:var(--color-mid)]">{delta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InterviewsPeek() {
  const rows = [
    ["Q1", "Walk me through the last time research changed your roadmap.", "Mom-Test clean · behavioral", "pos", "closes a1"],
    ["Q2", "Where do interview notes go after a call?", "Mom-Test clean", "pos", "closes a3"],
    ["Q3", "How do you currently compare competing customer pains?", "Mom-Test clean · behavioral", "pos", "closes a4"],
    ["Q4", "Would you pay for a tool that ranks pains?", "pricing-hypo · 70", "mid", "closes a2"],
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 pt-1 pb-3 sm:px-5">
        <span className="font-mono text-[22px] leading-none tabular-nums text-accent">82%</span>
        <span className="text-[12.5px] text-ink-soft">resolved · 12 web-resolvable · 4 only a human can close</span>
      </div>
      <ol>
        {rows.map(([id, question, score, tone, closes]) => (
          <li key={id} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-2 border-t-[0.5px] border-[var(--color-hairline)] px-4 py-2.5 sm:px-5">
            <span className="font-mono text-[12px] text-accent">{id}</span>
            <div>
              <p className="text-[13px] leading-snug">{question}</p>
              <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px]">
                <span className={tone === "pos" ? "text-[color:var(--color-pos)]" : "text-[color:var(--color-mid)]"}>{score}</span>
                <span className="text-accent">{closes}</span>
                <span className="text-ink-faint">receipt · Reddit</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function RoadmapPeek() {
  const rows = [
    ["01", "Evidence-ranked opportunity brief", "Turns scattered signals into a decision-ready shortlist.", "91%", "closes a4"],
    ["02", "Interview loop with gap-aware questions", "Routes unsettled assumptions into conversations.", "87%", "closes a5"],
    ["03", "Source connectors for research context", "Keeps the original context on every signal.", "79%", "closes a3"],
    ["04", "Decision snapshots for roadmap handoff", "Makes the why behind a bet shareable.", "74%", "closes a6"],
  ] as const;

  return (
    <ol>
      {rows.map(([rank, title, rationale, confidence, closes]) => (
        <li key={rank} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] gap-3 border-t-[0.5px] border-[var(--color-hairline)] px-4 py-3 sm:px-5">
          <span className="font-mono text-[12px] text-accent">{rank}</span>
          <div>
            <p className="text-[13px] font-medium leading-snug">{title}</p>
            <p className="mt-0.5 text-[12px] leading-snug text-ink-soft">{rationale}</p>
            <p className="mt-1 font-mono text-[10px] text-ink-faint">{closes} · receipt on file</p>
          </div>
          <span className="font-mono text-[16px] tabular-nums text-[color:var(--color-pos)]">{confidence}</span>
        </li>
      ))}
    </ol>
  );
}

function Trend({ trend }: { trend: string }) {
  const color =
    trend === "rising"
      ? "text-[color:var(--color-pos)]"
      : trend === "fading"
        ? "text-[color:var(--color-mid)]"
        : trend === "new"
          ? "text-accent"
          : "text-ink-soft";
  return <span className={`font-mono text-[10px] ${color}`}>{trend}</span>;
}

function Spark({ series }: { series: string }) {
  const values = series.split(" ").map(Number);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 52;
      const y = 16 - (value / 100) * 14;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width="52" height="18" viewBox="0 0 52 18" aria-hidden="true" className="hidden text-accent sm:block">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
