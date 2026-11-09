"use client";

import { Fragment, useEffect, useState, type KeyboardEvent } from "react";
import { track } from "@/lib/track";
import PlatformLogo from "@/components/PlatformLogo";

const OPEN_SCOUT_HREF =
  "https://scout-vision-console.vercel.app/?from=landing&cta=open_scout";

const SOURCES = [
  { key: "hacker news", label: "Hacker News" },
  { key: "reddit", label: "Reddit" },
  { key: "youtube", label: "YouTube" },
  { key: "web", label: "Web" },
  { key: "g2", label: "G2" },
  { key: "github", label: "GitHub" },
  { key: "app store", label: "App Store" },
  { key: "bluesky", label: "Bluesky" },
] as const;

const STEPS = [
  {
    n: "1",
    title: "Name the market",
    body: "Paste a pitch, URL, industry, or competitors.",
  },
  {
    n: "2",
    title: "Scout listens",
    body: "Eight public sources light up as voices are gathered — with receipts.",
  },
  {
    n: "3",
    title: "Decide with evidence",
    body: "Radar → Competitor → Interviews → Roadmap, each claim checkable.",
  },
] as const;

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
        When you have no customers of your own, Scout listens to the market’s.
        Open Scout, then look at Radar, Competitor, Interviews, and Roadmap.
      </p>

      <main className="flex-1 px-6 md:px-12">
        <div className="mx-auto w-full max-w-[1040px] pt-[120px] pb-16">
          <p className="text-[18px] font-bold tracking-[-0.03em]">Scout</p>

          <p className="mt-8 font-mono text-[12px] leading-4 font-medium text-ink-soft">0→1 market research</p>
          <h1 className="type-display mt-3 max-w-[640px] text-balance text-ink">
            When you have no customers of your own, Scout listens to the market’s.
          </h1>
          <p className="mt-4 max-w-[640px] text-pretty text-[15px] font-normal leading-6 tracking-[-0.003em] text-ink-soft">
            Enterpret’s brain, pointed at the market you’re entering — built for 0→1 when you have no users of your own.
          </p>

          <div className="mt-8">
            <OpenScoutLink from="hero" />
            <p className="meta mt-3">
              paste a pitch, a URL, an industry, competitors, or notes
            </p>
          </div>

          <SourceStrip />

          <section className="mt-20 md:mt-[120px]" aria-labelledby="how-it-works">
            <h2 id="how-it-works" className="section-title">
              How it works
            </h2>
            <ol className="mt-4 grid sm:grid-cols-3">
              {STEPS.map((step, index) => (
                <li
                  key={step.n}
                  className={`py-4 sm:px-6 sm:py-0 ${
                    index > 0
                      ? "border-t border-hairline sm:border-t-0 sm:border-l"
                      : ""
                  } ${index === 0 ? "sm:pl-0" : ""} ${index === STEPS.length - 1 ? "sm:pr-0" : ""}`}
                >
                  <p className="num text-[13px] leading-[18px] text-accent-text">{step.n}</p>
                  <h3 className="card-title mt-3">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-6 text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-20 md:mt-[120px]" aria-labelledby="peeks-heading">
            <h2 id="peeks-heading" className="section-title">
              One run. Four places to look.
            </h2>
            <div
              className="hairline mt-4 overflow-hidden rounded-lg bg-surface"
              aria-label="What’s inside Scout"
            >
              <div role="tablist" aria-label="Console surfaces" className="flex gap-6 overflow-x-auto overflow-y-hidden border-b border-hairline px-4 sm:px-5">
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
                      className={`shrink-0 border-b-2 py-3 text-body-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
                        selected
                          ? "border-accent-text text-accent-text"
                          : "border-transparent text-ink-soft hover:text-ink"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <p className="text-body-sm min-h-12 px-4 pt-3 text-ink sm:px-5" aria-live="polite">
                {surface.job}
              </p>

              <div
                id="surface-peek"
                role="tabpanel"
                aria-labelledby={`surface-${surface.id}`}
                className="mt-3 border-t border-hairline"
              >
                <div className="flex justify-end px-4 pt-2 sm:px-5">
                  <span className="num text-[12px] leading-4 text-ink-faint">Sample data</span>
                </div>
                {active === "radar" && <RadarPeek />}
                {active === "competitor" && <CompetitorPeek />}
                {active === "interviews" && <InterviewsPeek />}
                {active === "roadmap" && <RoadmapPeek />}
              </div>
            </div>
          </section>

          <section className="mt-20 max-w-[640px] md:mt-[120px]" aria-label="Open Scout">
            <p className="card-title text-balance">
              For teams doing research without a research team.
            </p>
            <p className="mt-3 text-[15px] leading-6 text-ink-soft">
              Watchtower keeps listening to markets you care about.
            </p>
            <div className="mt-6">
              <OpenScoutLink from="closing" />
            </div>
          </section>
        </div>
      </main>

      <footer className="no-print hairline-t px-6 py-4 md:px-12">
        <p className="meta mx-auto max-w-[1040px] text-center">
          Scout · 0→1 market research
        </p>
      </footer>
    </div>
  );
}

function OpenScoutLink({ from }: { from: "hero" | "closing" }) {
  return (
    <a
      href={OPEN_SCOUT_HREF}
      onClick={() =>
        track("console_click", from === "hero" ? { from: "hero" } : { from: "closing" })
      }
      className="elev-1 inline-flex h-11 items-center rounded-[999px] bg-accent-fill px-6 text-[15px] leading-5 font-semibold text-white transition-[background-color,transform] duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-accent-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent active:scale-[0.98] active:bg-accent-deep"
    >
      Open Scout
    </a>
  );
}

function SourceStrip() {
  return (
    <div className="mt-10">
      <ul
        aria-label="Listening across Hacker News, Reddit, YouTube, Web, G2, GitHub, App Store, and Bluesky"
        className="flex flex-wrap gap-5"
      >
        {SOURCES.map((source) => (
          <li
            key={source.key}
            className="inline-flex items-center gap-2 text-[13px] leading-[18px] text-ink-soft"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-hairline">
              <PlatformLogo name={source.key} className="size-[18px] shrink-0 text-ink-soft" />
            </span>
            {source.label}
          </li>
        ))}
      </ul>
      <p className="meta mt-3">8 sources · public market voices</p>
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
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2 sm:px-5">
        <span className="text-[12px] leading-4 font-semibold">Since last run</span>
        <span className="num text-[12px] leading-4 text-ink-faint">3 runs · 21 Aug</span>
        <span className="num text-[12px] leading-4 text-pos">rising · Scattered research</span>
        <span className="num text-[12px] leading-4 text-new">new · Synthesis before prioritization</span>
        <span className="num text-[12px] leading-4 text-mid">fading · Archive-first workflows</span>
      </div>
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="border-y border-hairline-strong text-[12px] leading-4 font-semibold text-ink-faint">
            <th className="px-4 py-2 font-semibold sm:px-5">Signal</th>
            <th className="w-12 px-2 py-2 font-semibold sm:w-14">Freq</th>
            <th className="w-12 px-2 py-2 font-semibold sm:w-14">Score</th>
            <th className="w-16 px-2 py-2 font-semibold sm:w-28">Trend</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([signal, freq, score, trend, spark], index) => (
            <Fragment key={signal}>
              <tr className="border-b border-hairline text-body-sm">
                <td className="px-4 py-2.5 sm:px-5">{signal}</td>
                <td className="num px-2 py-2.5 text-ink-soft">{freq}</td>
                <td className="num px-2 py-2.5">{score}</td>
                <td className="overflow-hidden px-2 py-2.5">
                  <span className="inline-flex items-center gap-2">
                    <Trend trend={trend} />
                    {spark ? <Spark series={spark} /> : null}
                  </span>
                </td>
              </tr>
              {index === 0 ? (
                <tr className="border-b border-hairline">
                  <td colSpan={4} className="px-4 pt-1 pb-3 sm:px-5">
                    <p className="text-[15px] leading-6 italic text-ink">
                      “I have three docs open and none of them agree on what to do next.”
                    </p>
                    <p className="num mt-1 text-[12px] leading-4 text-ink-faint">Reddit · 18 mentions</p>
                  </td>
                </tr>
              ) : null}
            </Fragment>
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
      <p className="px-4 pt-1 pb-2 text-[12px] leading-4 font-semibold sm:px-5">Competitor intel</p>
      <div className="sm:hidden">
        {rows.map(([name, pricing, rating, complaint, move, delta]) => (
          <div key={name} className="border-t border-hairline px-4 py-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-body-sm font-medium">{name}</span>
              <span className="num shrink-0 text-[12px] leading-4 text-ink-soft">{pricing} · {rating}</span>
            </div>
            <p className="text-body-sm mt-1 text-mid">{complaint}</p>
            <p className="num mt-1 text-[12px] leading-4 text-ink-faint">{move} · {delta} · receipt · forum</p>
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-y border-hairline-strong text-[12px] leading-4 font-semibold text-ink-faint">
              {["Competitor", "Pricing", "Rating", "Top complaint", "Latest move", "Δ"].map((heading) => (
                <th key={heading} className="px-3 py-2 font-semibold first:pl-4 first:sm:pl-5">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, pricing, rating, complaint, move, delta]) => (
              <tr key={name} className="border-b border-hairline align-top text-body-sm">
                <td className="py-2.5 pr-3 pl-4 font-medium sm:pl-5">{name}</td>
                <td className="num px-3 py-2.5 text-[12px] leading-4">{pricing}</td>
                <td className="num px-3 py-2.5">{rating}</td>
                <td className="px-3 py-2.5 text-mid">
                  {complaint}
                  <span className="num mt-1 block text-[12px] leading-4 text-ink-faint">receipt · forum</span>
                </td>
                <td className="px-3 py-2.5 text-ink-soft">{move}</td>
                <td className="num px-3 py-2.5 text-[12px] leading-4 text-mid">{delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InterviewsPeek() {
  const rows = [
    ["Q1", "Walk me through the last time research changed your roadmap.", "", "closes a1"],
    ["Q2", "Where do interview notes go after a call?", "", "closes a3"],
    ["Q3", "How do you currently compare competing customer pains?", "", "closes a4"],
    ["Q4", "Would you pay for a tool that ranks pains?", "asks about hypothetical spend", "closes a2"],
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 pt-1 pb-2 sm:px-5">
        <span className="type-stat text-accent-text">82%</span>
        <span className="meta">resolved · 12 web-resolvable · 4 only a human can close</span>
      </div>
      <ol>
        {rows.map(([id, question, flag, closes]) => (
          <li key={id} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-2 border-t border-hairline px-4 py-2 sm:px-5">
            <span className="num self-start text-[13px] leading-[18px] text-accent-text">{id}</span>
            <div>
              <p className="text-body-sm">{question}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] leading-4">
                {flag ? (
                  <>
                    <span className="inline-flex h-6 items-center rounded-[999px] bg-warn-soft px-2 text-[12px] leading-4 font-semibold text-warn-text">Mom-Test flagged</span>
                    <span className="text-[13px] leading-[18px] text-ink-soft">{flag}</span>
                  </>
                ) : (
                  <span className="num text-ink-faint">Mom-Test clean</span>
                )}
                <span className="num text-accent-text">{closes}</span>
                <span className="num text-ink-faint">receipt · Reddit</span>
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
        <li key={rank} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] gap-3 border-t border-hairline px-4 py-3 sm:px-5">
          <span className="num self-start text-[13px] leading-[18px] text-accent-text">{rank}</span>
          <div>
            <p className="text-body-sm font-medium">{title}</p>
            <p className="text-body-sm mt-1 text-ink-soft">{rationale}</p>
            <p className="num mt-1 text-[12px] leading-4 text-ink-faint">{closes} · receipt on file</p>
          </div>
          <span className="num text-[13px] leading-[18px] text-pos">{confidence}</span>
        </li>
      ))}
    </ol>
  );
}

function Trend({ trend }: { trend: string }) {
  const color =
    trend === "rising"
      ? "text-pos"
      : trend === "fading"
        ? "text-mid"
        : trend === "new"
          ? "text-new"
          : "text-ink-muted";
  return <span className={`num text-[12px] leading-4 ${color}`}>{trend}</span>;
}

function Spark({ series }: { series: string }) {
  const values = series.split(" ").map(Number);
  const points = values
    .map((value, index) => {
      // 44 of 52 keeps the 1.25 stroke inside the trend cell's 8px padding.
      const x = (index / (values.length - 1)) * 44;
      const y = 16 - (value / 100) * 14;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width="52" height="18" viewBox="0 0 52 18" aria-hidden="true" className="hidden overflow-hidden text-accent sm:block">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
