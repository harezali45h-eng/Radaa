import axios from 'axios';

const RAW_API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  '';

if (!RAW_API_BASE_URL) {
  throw new Error(
    'API base URL is not configured for the mobile app. Set EXPO_PUBLIC_API_BASE_URL, NEXT_PUBLIC_API_BASE_URL, or API_BASE_URL before building.',
  );
}

export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const setAuthToken = (token?: string) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};
