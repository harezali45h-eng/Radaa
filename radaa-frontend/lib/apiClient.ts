import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
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

export default api;
