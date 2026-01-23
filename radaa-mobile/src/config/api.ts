import axios from 'axios';
import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as {
  apiBaseUrl?: string;
  socketUrl?: string;
};

const RAW_API_BASE_URL = extra.apiBaseUrl;

export const API_BASE_URL = (RAW_API_BASE_URL ?? '').replace(/\/+$/, '');

const RAW_SOCKET_URL_FOR_VALIDATION = extra.socketUrl;
const SOCKET_URL_FOR_VALIDATION = (RAW_SOCKET_URL_FOR_VALIDATION ?? '').replace(/\/+$/, '');

const MISSING_API_BASE_URL_MESSAGE =
  'API base URL is not configured for the mobile app. Set EXPO_PUBLIC_API_BASE_URL before building.';

const MISSING_SOCKET_URL_MESSAGE =
  'Realtime socket URL is not configured for the mobile app. Set EXPO_PUBLIC_SOCKET_URL before building.';

export const ensureApiConfigured = (): void => {
  const problems: string[] = [];

  if (!API_BASE_URL) {
    problems.push(MISSING_API_BASE_URL_MESSAGE);
  }

  if (!SOCKET_URL_FOR_VALIDATION) {
    problems.push(MISSING_SOCKET_URL_MESSAGE);
  }

  if (problems.length > 0) {
    throw new Error(problems.join(' '));
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
