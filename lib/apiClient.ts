import axios from "axios";

const API = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

if (API) {
  axios.defaults.baseURL = API;
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
