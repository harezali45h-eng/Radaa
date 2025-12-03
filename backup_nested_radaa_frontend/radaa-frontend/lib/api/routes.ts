import API from "../api";

interface RequestOptions {
  method?: string;
  body?: unknown;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body } = options;

  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await API.request<{ success?: boolean; data?: T } | T>({
        url: path,
        method,
        data: body,
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

export interface TransitRoute {
  _id: string;
  name: string;
  aliases?: string[];
}

export interface RouteSearchResult extends TransitRoute {}

export async function searchRoutes(q: string): Promise<RouteSearchResult[]> {
  const query = q.trim();
  if (!query) return [];

  const searchParams = new URLSearchParams();
  searchParams.set("q", query);

  return request<RouteSearchResult[]>(
    `/search/route?${searchParams.toString()}`,
  );
}

export interface RouteMatatu {
  _id: string;
  plate?: string;
  route?: string;
  lastLocation?: {
    type: string;
    coordinates: [number, number];
  } | null;
  location?: {
    lat?: number;
    lng?: number;
  } | null;
  status?: string;
  isOnline?: boolean;
}

export async function getMatatusOnRoute(
  routeId: string,
  radiusMeters?: number,
): Promise<RouteMatatu[]> {
  const searchParams = new URLSearchParams();
  if (typeof radiusMeters === "number") {
    searchParams.set("radius", String(radiusMeters));
  }

  const suffix = searchParams.toString();
  const path = suffix
    ? `/routes/${routeId}/matatus?${suffix}`
    : `/routes/${routeId}/matatus`;

  return request<RouteMatatu[]>(path);
}
