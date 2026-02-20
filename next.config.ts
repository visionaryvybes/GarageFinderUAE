import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove "X-Powered-By: Next.js" header
  poweredByHeader: false,

  // Tree-shake large packages — only import what's actually used
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "recharts",
      "@googlemaps/js-api-loader",
    ],
  },

  // Image optimization
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 3600,
    remotePatterns: [
      { protocol: "https", hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "places.googleapis.com" },
    ],
  },

  // HTTP response headers — caching + security
  async headers() {
    return [
      {
        // Static assets — cache 1 year
        source: "/(.*\\.(?:js|css|woff2|woff|ttf|ico|png|jpg|jpeg|svg|webp))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // API routes — no store by default (overridden per-route where needed)
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
