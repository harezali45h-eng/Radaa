import type { RideRequest } from "./rides";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined
      });

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      let data: any = null;

      if (isJson) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      const isWrappedSuccess =
        isJson &&
        data &&
        typeof data === "object" &&
        "success" in (data as any) &&
        (data as any).success === true &&
        "data" in (data as any);

      if (!response.ok) {
        const message =
          (data && typeof data === "object" && ((data as any).message || (data as any).error)) ||
          (typeof data === "string" && data) ||
          "Request failed";

        if (response.status >= 500 && attempt < maxAttempts) {
          lastError = new Error(message);
          continue;
        }

        throw new Error(message);
      }

      if (isWrappedSuccess) {
        return (data as any).data as T;
      }

      return data as T;
    } catch (error) {
      lastError = error;

      // eslint-disable-next-line no-console
      console.error("API ERROR:", (error as any)?.response?.data || error);

      if (attempt >= maxAttempts) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed");
}

export type { RideLocation, RequestRidePayload, RideRequest } from "./rides";
export { requestRide } from "./rides";

export interface NearbyMatatuLocation {
  lat?: number;
  lng?: number;
}

export interface NearbyMatatu {
  id?: string;
  _id?: string;
  plate?: string;
  numberPlate?: string;
  route?: string;
  location?: NearbyMatatuLocation;
  etaMinutes?: number;
  [key: string]: any;
}

export async function cancelRide(id: string, token: string): Promise<RideRequest> {
  return request<RideRequest>(`/api/rides/${id}/cancel`, {
    method: "POST",
    token
  });
}

export async function getNearbyMatatus(token?: string | null): Promise<NearbyMatatu[]> {
  const matatus = await request<NearbyMatatu[]>("/matatus/live", {
    method: "GET",
    token: token ?? null
  });

  return Array.isArray(matatus) ? matatus : [];
}
