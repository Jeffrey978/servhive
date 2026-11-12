import type { NextConfig } from "next";

// Cache Components is intentionally OFF: almost every route reads the Clerk
// session, so the classic dynamic-by-default model is simpler and safer here.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
  experimental: {
    // Work photos / ID docs are downscaled client-side (≤ ~600KB each) and sent as data URLs
    // until object storage is wired up.
    serverActions: { bodySizeLimit: "4mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
