import API from "../api";

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

export class LiveRequestError extends Error {
  code?: string;
  details?: unknown;
  status?: number;
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
    const status = error?.response?.status as number | undefined;
    const data = error?.response?.data;
    const message =
      (data &&
        typeof data === "object" &&
        ((data as any).message || (data as any).error)) ||
      error?.message ||
      "Request failed";

    const err = new LiveRequestError(message);
    err.status = status;

    if (data && typeof data === "object") {
      err.code = (data as any).code;
      err.details = (data as any).details ?? null;
    }

    throw err;
  }
}

export interface LiveRequestLocation {
  lat: number;
  lng: number;
}

export interface LiveRequest {
  id: string;
  userId: string | null;
  stageId: string | null;
  corridorId: string | null;
  location: LiveRequestLocation | null;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface VisibleLiveRequest extends LiveRequest {
  distanceFromDriverMeters: number | null;
}

export async function createLiveRequest(
  location: LiveRequestLocation,
  token: string,
): Promise<LiveRequest> {
  return request<LiveRequest>("/live-requests", {
    method: "POST",
    body: { location },
    token,
  });
}

export async function getActiveLiveRequest(
  token: string,
): Promise<LiveRequest | null> {
  return request<LiveRequest | null>("/live-requests/active", {
    method: "GET",
    token,
  });
}

export async function cancelLiveRequest(
  id: string,
  token: string,
): Promise<LiveRequest> {
  return request<LiveRequest>(`/live-requests/${id}/cancel`, {
    method: "POST",
    token,
  });
}

export async function getVisibleLiveRequests(
  location: LiveRequestLocation,
  token: string,
): Promise<VisibleLiveRequest[]> {
  const searchParams = new URLSearchParams();
  searchParams.set("lat", String(location.lat));
  searchParams.set("lng", String(location.lng));

  const path = `/live-requests/visible?${searchParams.toString()}`;

  return request<VisibleLiveRequest[]>(path, {
    method: "GET",
    token,
  });
}
