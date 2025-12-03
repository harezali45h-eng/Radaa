import axios from "axios";

// Prefer the canonical NEXT_PUBLIC_API_BASE_URL but keep support for the
// legacy NEXT_PUBLIC_API_URL name so existing environments continue to work.
const RAW_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "";

const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
}

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const token =
        window.localStorage.getItem("token") ||
        window.sessionStorage.getItem("token");

      if (token) {
        config.headers = config.headers || {};
        if (!config.headers["Authorization"]) {
          (config.headers as any).Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // ignore storage access errors
    }
  }

  return config;
});

export default axios;
