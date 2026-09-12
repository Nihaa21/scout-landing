"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { track } from "@/lib/track";

const PILLARS = [
  {
    k: "Watch",
    title: "Competitor moves, diffed",
    body: "Scout re-reads the market on every run — pricing, launches, complaints — and tells you what changed since last time.",
  },
  {
    k: "Listen",
    title: "The market's crowd, ranked",
    body: "Real voices from forums, reviews, and communities become ranked signals. Every claim carries a receipt back to its source.",
  },
  {
    k: "Understand",
    title: "From gap to roadmap",
    body: "What research can't settle becomes interview questions; what you hear back becomes a ranked, evidence-backed roadmap.",
  },
];

export default function Home() {
  useEffect(() => {
    track("page_view", {
      page: "landing",
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <p className="sr-only">
        Scout is a research agent for 0-to-1 product work. It gathers public
        feedback across platforms, extracts ranked themes with quotes, maps
        pain points, builds an interview agenda, and produces a full
        competitive breakdown — before you build the product.
      </p>

      <div className="no-print absolute top-4 right-5 sm:right-8 z-10">
        <Link
          href="/app"
          onClick={() => track("console_click", { from: "header" })}
          className="hairline rounded-full px-3.5 py-1.5 font-mono text-[11.5px] text-ink-soft hover:text-ink hover:border-accent/50 transition-colors duration-200"
        >
          Open Scout →
        </Link>
      </div>

      <main className="flex-1 px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center pt-24 sm:pt-36 pb-14"
        >
          {/* branding — big, center, with a soft accent glow behind it */}
          <div className="relative inline-block">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[150%] w-[185%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(31,111,191,0.28), rgba(31,111,191,0.09) 45%, transparent 72%)",
              }}
            />
            <p className="text-[52px] sm:text-[70px] leading-none font-semibold tracking-[-0.045em]">
              Scout
            </p>
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[var(--color-hairline)]" />
            <p className="font-mono text-[13px] sm:text-[14px] tracking-[0.12em] uppercase text-accent">
              <span className="font-semibold">0→1</span> product research
            </p>
            <span className="h-px w-8 bg-[var(--color-hairline)]" />
          </div>

          <h1 className="mt-8 text-[17px] sm:text-[19px] font-normal text-ink-soft leading-relaxed max-w-[46ch] mx-auto">
            Research what the market thinks — before you build it.
            <span className="block mt-2">
              Scout reads the crowd, finds the themes, maps the pain, writes
              your user interview questions, and hands you the roadmap.
            </span>
          </h1>

          <div className="mt-10">
            <Link
              href="/app"
              onClick={() => track("console_click", { from: "hero" })}
              className="inline-flex items-center gap-2 rounded-[10px] bg-accent px-6 py-3 text-[14px] font-semibold text-white shadow-sm hover:bg-accent-deep transition-colors duration-200"
            >
              Open Scout →
            </Link>
            <p className="mt-3 font-mono text-[11px] text-ink-faint">
              paste a product idea, a market question, or a competitor — Scout
              does the rest
            </p>
          </div>
        </motion.div>

        {/* the loop, in three moves */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto pb-24"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {PILLARS.map((p, i) => (
              <div key={p.k} className="hairline rounded-[12px] bg-surface/70 p-5 text-left">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                  {String(i + 1).padStart(2, "0")} · {p.k}
                </p>
                <h2 className="mt-2 text-[14.5px] font-semibold">{p.title}</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{p.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="no-print hairline-t px-5 sm:px-8 py-4">
        <p className="font-mono text-[11px] text-ink-faint max-w-6xl mx-auto text-center">
          Scout · Autonomous Voice-of-Customer Research
        </p>
      </footer>
    </div>
  );
}
