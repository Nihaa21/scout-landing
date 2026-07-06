"use client";

/** Downloads the brief as a PDF via the browser's own renderer (highest
 *  fidelity — perfect fonts, SVG, colors). Print CSS in globals.css isolates
 *  the brief and expands all sections. */
export default function DownloadPdf() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-1.5 hairline rounded-[8px] px-2.5 py-1 text-[11.5px] text-ink-soft hover:text-accent hover:border-accent/50 transition-colors duration-200 cursor-pointer"
      aria-label="Download this brief as a PDF"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[14px]" aria-hidden="true">
        <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      PDF
    </button>
  );
}
