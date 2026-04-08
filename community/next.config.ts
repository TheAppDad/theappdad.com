import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Deploy on Vercel or a second Cloudflare Pages project; see README */
  // Lets you open the app as either localhost or 127.0.0.1 without cross-origin / HMR issues.
  allowedDevOrigins: [
    "http://127.0.0.1:3001",
    "http://localhost:3001",
  ],
  // Dev self-proxy can be slow on first compile; avoid cutting off too early.
  experimental: {
    proxyTimeout: 120_000,
  },
  ...(process.env.NODE_ENV === "development" && {
    // Keep compiled pages in memory longer in dev to reduce stale chunk fetches after edits.
    onDemandEntries: {
      maxInactiveAge: 5 * 60 * 1000,
      pagesBufferLength: 8,
    },
  }),
};

export default nextConfig;
