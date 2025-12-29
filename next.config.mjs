const isProd = process.env.NODE_ENV === "production";

const resolveApiBaseUrl = () => {
  const fromPublicEnv =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;

  if (fromPublicEnv) {
    return fromPublicEnv.replace(/\/+$/, "");
  }
  const fromServerEnv = process.env.API_BASE_URL;

  if (fromServerEnv) {
    return fromServerEnv.replace(/\/+$/, "");
  }

  if (isProd) {
    throw new Error(
      "API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL or API_BASE_URL before building.",
    );
  }

  const fallback = "http://localhost:5001/api";
  return fallback.replace(/\/+$/, "");
};

const apiBaseUrl = resolveApiBaseUrl();

const resolveSocketUrl = () => {
  const fromEnv = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/+$/, "");
  }

  if (apiBaseUrl) {
    const wsBase = apiBaseUrl
      .replace(/^http:/, "ws:")
      .replace(/^https:/, "wss:")
      .replace(/\/api$/, "");
    return wsBase.replace(/\/+$/, "");
  }

  return isProd ? "" : "ws://localhost:5001";
};

const socketUrl = resolveSocketUrl();

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
    NEXT_PUBLIC_API_BASE_URL: apiBaseUrl,

    // Backwards-compat alias so older code that still references
    // NEXT_PUBLIC_API_URL keeps working.
    NEXT_PUBLIC_API_URL: apiBaseUrl,

    // Socket connection base URL
    NEXT_PUBLIC_SOCKET_URL: socketUrl,

    // Public app environment flag ("production" | "staging" | "development")
    NEXT_PUBLIC_APP_ENV:
      process.env.NEXT_PUBLIC_APP_ENV ||
      process.env.NEXT_PUBLIC_ENV ||
      (isProd ? "production" : "development"),

    // Frontend canonical URL (optional, but exposed for consistency)
    NEXT_PUBLIC_FRONTEND_URL:
      process.env.NEXT_PUBLIC_FRONTEND_URL || "",

    // Google Maps key is exposed as-is so that client code can rely on it.
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
