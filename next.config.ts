import type { NextConfig } from "next";

// `/` is the public landing. `/app` still forwards to the Lovable console so
// existing entry links keep working. Crons and /app/stats stay on this project.
const CONSOLE_URL = "https://scout-vision-console.vercel.app";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/app", destination: CONSOLE_URL, permanent: false }];
  },
};

export default nextConfig;
