import type { NextConfig } from "next";

// The console now lives in the Lovable-built app deployed on Vercel. This
// project stays alive for the two crons in vercel.json (/api/keepalive,
// /api/watch-refresh) and the /app/stats page; the public entry points
// forward to the canonical URL so resume/LinkedIn links keep working.
const CONSOLE_URL = "https://scout-vision-console.vercel.app";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/", destination: CONSOLE_URL, permanent: false },
      { source: "/app", destination: CONSOLE_URL, permanent: false },
    ];
  },
};

export default nextConfig;
