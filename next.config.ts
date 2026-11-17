import type { NextConfig } from "next";

// Cache Components is intentionally OFF: almost every route reads the Clerk
// session, so the classic dynamic-by-default model is simpler and safer here.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.clerk.com" },
      // Public Vercel Blob store — work photos and profile photos (A.9).
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    // Uploads are downscaled client-side to small JPEGs, then the server action
    // uploads them to Vercel Blob (public photos / private ID docs). The limit
    // still covers the in-flight data URL during that hop.
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
