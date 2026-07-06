/**
 * Small platform marks. Monochrome by default (colored by `currentColor` —
 * used inline with text), or brand-colored when `colored` is set (used in the
 * research theater so each source reads at a glance).
 */

export default function PlatformLogo({
  name,
  className = "size-[18px]",
  colored = false,
}: {
  name: string;
  className?: string;
  colored?: boolean;
}) {
  const common = { className, viewBox: "0 0 24 24", fill: "none" as const };

  if (colored) {
    switch (name) {
      case "hacker news":
        return (
          <svg {...common} aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="3.5" fill="#FF6600" />
            <path d="M8 6.5l4 5.4 4-5.4M12 11.9V17.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "youtube":
        return (
          <svg {...common} aria-hidden="true">
            <rect x="2" y="5" width="20" height="14" rx="4.5" fill="#FF0000" />
            <path d="M10.3 8.8l5 3.2-5 3.2V8.8z" fill="#fff" />
          </svg>
        );
      case "app store":
        return (
          <svg {...common} aria-hidden="true">
            <defs>
              <linearGradient id="appstore-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#18BFFB" />
                <stop offset="1" stopColor="#2072F3" />
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="20" height="20" rx="4.6" fill="url(#appstore-g)" />
            <path
              d="M8.1 15.2l3.9-6.75 3.9 6.75M7 16.9h10M9.9 8.1l-.9-1.55"
              stroke="#fff"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "bluesky":
        return (
          <svg {...common} aria-hidden="true">
            <path
              d="M12 10.5C10.6 8 8 5.5 6 5c-1.6-.4-2 .6-2 1.8 0 1 .6 4 1 4.8.6 1.2 2 1.6 3.4 1.4-2 .3-3.7 1-1.4 3.5 2.4 2.6 3.4-1 5-3 1.6 2 2.6 5.6 5 3 2.3-2.5.6-3.2-1.4-3.5 1.4.2 2.8-.2 3.4-1.4.4-.8 1-3.8 1-4.8 0-1.2-.4-2.2-2-1.8-2 .5-4.6 3-6 5.5z"
              fill="#1185FE"
            />
          </svg>
        );
      case "open web":
        return (
          <svg {...common} aria-hidden="true">
            <circle cx="12" cy="12" r="9.2" fill="#1F6FBF" />
            <path
              d="M2.8 12h18.4M12 2.8c2.6 2.4 2.6 15.6 0 18.4M12 2.8c-2.6 2.4-2.6 15.6 0 18.4"
              stroke="#fff"
              strokeWidth="1.15"
            />
          </svg>
        );
      default:
        return (
          <svg {...common} aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="var(--color-accent)" />
          </svg>
        );
    }
  }

  switch (name) {
    case "hacker news":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="2.5" y="2.5" width="19" height="19" rx="3" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8 7l4 5.2L16 7M12 12.2V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10.5 9.2l4 2.8-4 2.8V9.2z" fill="currentColor" />
        </svg>
      );
    case "app store":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M16.4 12.9c0-2 1.6-3 1.7-3-.9-1.4-2.4-1.5-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.2 2-1.4 2.4-.4 6 1 8 .7 1 1.4 2 2.4 2 1 0 1.3-.6 2.5-.6 1.2 0 1.5.6 2.5.6 1 0 1.7-1 2.3-1.9.7-1.1 1-2.1 1-2.2 0 0-1.9-.7-2-2.8z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M14.2 6.2c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.2 1.2-.5.6-.9 1.5-.8 2.3.9.1 1.7-.5 2.2-1.1z" fill="currentColor" />
        </svg>
      );
    case "bluesky":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M12 10.5C10.6 8 8 5.5 6 5c-1.6-.4-2 .6-2 1.8 0 1 .6 4 1 4.8.6 1.2 2 1.6 3.4 1.4-2 .3-3.7 1-1.4 3.5 2.4 2.6 3.4-1 5-3 1.6 2 2.6 5.6 5 3 2.3-2.5.6-3.2-1.4-3.5 1.4.2 2.8-.2 3.4-1.4.4-.8 1-3.8 1-4.8 0-1.2-.4-2.2-2-1.8-2 .5-4.6 3-6 5.5z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "open web":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
          <path d="M3 12h18M12 3c2.6 2.4 2.6 15.6 0 18M12 3c-2.6 2.4-2.6 15.6 0 18" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    default:
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
  }
}
