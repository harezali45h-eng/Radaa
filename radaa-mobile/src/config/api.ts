import axios from 'axios';

const RAW_API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  '';

export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

const MISSING_API_BASE_URL_MESSAGE =
  'API base URL is not configured for the mobile app. Set EXPO_PUBLIC_API_BASE_URL, NEXT_PUBLIC_API_BASE_URL, or API_BASE_URL before building.';

export const ensureApiConfigured = (): void => {
  if (!API_BASE_URL) {
    throw new Error(MISSING_API_BASE_URL_MESSAGE);
  }
};

export const apiClient = axios.create({
  // If the base URL is missing, callers should invoke ensureApiConfigured
  // before making requests so we can fail loudly and render a clear error.
  baseURL: API_BASE_URL || undefined,
  timeout: 10000,
});

export const setAuthToken = (token?: string) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};
