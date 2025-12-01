import API from "../api";

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await API.request<{ success?: boolean; data?: T } | T>({
        url: path,
        method,
        data: body,
        headers
      });

      const data: any = response.data;
      const isJson = data !== null && typeof data !== "undefined";

      const isWrappedSuccess =
        isJson &&
        data &&
        typeof data === "object" &&
        "success" in (data as any) &&
        (data as any).success === true &&
        "data" in (data as any);

      if (isWrappedSuccess) {
        return (data as any).data as T;
      }

      return data as T;
    } catch (error: any) {
      lastError = error;
      // eslint-disable-next-line no-console
      console.error("API ERROR:", error?.response?.data || error);

      const status = error?.response?.status as number | undefined;
      const data = error?.response?.data;
      const message =
        (data && typeof data === "object" && ((data as any).message || (data as any).error)) ||
        error?.message ||
        "Request failed";

      if (status && status >= 500 && attempt < maxAttempts) {
        lastError = new Error(message);
        continue;
      }

      throw new Error(message);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed");
}

export interface EphemeralRequestMeta {
  note?: string;
  routeName?: string;
  tags?: string[];
  estimatedFare?: number;
  vehicleType?: string;
}

export interface EphemeralRequestSummary {
  id: string;
  pickupPoint: {
    lat: number;
    lng: number;
  };
  partySize: number;
  meta?: EphemeralRequestMeta;
  nearestMatatu?: {
    driverId: string | null;
    matatuId: string;
    distanceMeters: number;
    saccoId: string | null;
  } | null;
}

export interface CreateEphemeralRequestPayload {
  pickup: {
    lat: number;
    lng: number;
  };
  partySize?: number;
  meta?: EphemeralRequestMeta;
}

export async function createEphemeralRequest(
  payload: CreateEphemeralRequestPayload,
  token: string
): Promise<EphemeralRequestSummary> {
  return request<EphemeralRequestSummary>("/requests", {
    method: "POST",
    body: payload,
    token
  });
}

export interface PingLocationPayload {
  lat: number;
  lng: number;
}

export async function pingPassengerLocation(
  requestId: string,
  location: PingLocationPayload,
  token: string
): Promise<void> {
  await request<void>(`/requests/${requestId}/ping-location`, {
    method: "POST",
    body: { location },
    token
  });
}
