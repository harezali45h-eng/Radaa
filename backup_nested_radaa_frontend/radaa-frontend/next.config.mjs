const isProd = process.env.NODE_ENV === "production";

// Centralize public env configuration for the frontend. We keep backward
// compatibility with the previous NEXT_PUBLIC_API_URL / NEXT_PUBLIC_ENV names,
// but expose the canonical variables expected by the app:
//   - NEXT_PUBLIC_API_BASE_URL
//   - NEXT_PUBLIC_SOCKET_URL
//   - NEXT_PUBLIC_APP_ENV
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
    // Canonical API base URL for all client-side requests
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      (isProd
        ? "https://radaa-1.onrender.com/api"
        : "http://localhost:5001/api"),

    // Backwards-compat alias so older code that still references
    // NEXT_PUBLIC_API_URL keeps working in non-production environments.
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      (isProd
        ? "https://radaa-1.onrender.com/api"
        : "http://localhost:5001/api"),

    // Socket connection base URL
    NEXT_PUBLIC_SOCKET_URL:
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      (isProd ? "wss://radaa-1.onrender.com" : "ws://localhost:5001"),

    // Public app environment flag ("production" | "staging" | "development")
    NEXT_PUBLIC_APP_ENV:
      process.env.NEXT_PUBLIC_APP_ENV ||
      process.env.NEXT_PUBLIC_ENV ||
      (isProd ? "production" : "development"),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
