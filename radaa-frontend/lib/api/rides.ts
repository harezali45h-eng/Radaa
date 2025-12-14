import API from "../api";

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
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
        headers,
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
        (data &&
          typeof data === "object" &&
          ((data as any).message || (data as any).error)) ||
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

export interface RideLocation {
  lat: number;
  lng: number;
}

export interface RequestRidePayload {
  pickup: RideLocation;
  destination?: RideLocation;
  saccoId?: string;
  matatuId?: string;
  routeId?: string;
  stageId?: string;
}

export interface RideRequest {
  _id: string;
  status: string;
  routeId?: string | null;
  stageId?: string | null;
  pickup?: {
    type: string;
    coordinates: [number, number];
  };
  destination?: {
    type: string;
    coordinates: [number, number];
  } | null;
  requester?: string;
  assignedDriver?: string | null;
  createdAt?: string;
  [key: string]: any;
}

export interface FareEstimateRequest {
  pickup: RideLocation;
  destination?: RideLocation;
  partySize?: number;
  routeName?: string;
  routeId?: string;
  stageId?: string;
}

export interface FareEstimateResponse {
  pickup: RideLocation;
  destination: RideLocation | null;
  distanceMeters: number;
  distanceKm: number;
  suggestedFare: number;
  minFare: number;
  maxFare: number;
  currency: string;
  isPeak: boolean;
  routeName: string | null;
  partySize: number;
}

export async function requestRide(
  payload: RequestRidePayload,
  token: string,
): Promise<RideRequest> {
  return request<RideRequest>("/rides/request", {
    method: "POST",
    body: payload,
    token,
  });
}

export async function estimateFare(
  payload: FareEstimateRequest,
  token: string,
): Promise<FareEstimateResponse> {
  return request<FareEstimateResponse>("/rides/estimate-fare", {
    method: "POST",
    body: payload,
    token,
  });
}

export interface NearbyRequestParams {
  lat: number;
  lng: number;
  radiusMeters?: number;
}

export async function getNearbyRequests(
  params: NearbyRequestParams,
  token: string,
): Promise<RideRequest[]> {
  const searchParams = new URLSearchParams();
  searchParams.set("lat", String(params.lat));
  searchParams.set("lng", String(params.lng));
  if (typeof params.radiusMeters === "number") {
    searchParams.set("radius", String(params.radiusMeters));
  }

  const path = `/rides/nearby?${searchParams.toString()}`;

  return request<RideRequest[]>(path, {
    method: "GET",
    token,
  });
}

export async function acceptRide(
  id: string,
  token: string,
): Promise<RideRequest> {
  return request<RideRequest>(`/rides/${id}/accept`, {
    method: "POST",
    token,
  });
}
