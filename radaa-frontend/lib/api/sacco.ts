const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "";

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: HeadersInit = {};

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined
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
    throw new Error(message);
  }

  if (isWrappedSuccess) {
    return (data as any).data as T;
  }

  return data as T;
}

export interface SaccoOverview {
  saccoId: string | null;
  activeMatatus: number;
  activeTrips: number;
  completedTripsLastHour: number;
  averageOccupancy: number | null;
}

export interface SaccoDriver {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
  enabled: boolean;
  driverProfile?: {
    saccoName?: string;
    vehicleRegistration?: string;
    licenseNumber?: string;
  };
  driverVerificationStatus?: "pending" | "approved" | "rejected";
}

export interface SaccoMatatu {
  _id: string;
  plate: string;
  route: string;
  numberPlate?: string;
  sacco?: string;
  driver?: string;
  approvalStatus?: "pending" | "approved" | "rejected";
  photos?: {
    url: string;
    status?: string;
  }[];
}

export async function getSaccoOverview(id: string, token?: string | null): Promise<SaccoOverview> {
  return request<SaccoOverview>(`/api/sacco/${id}/overview`, { method: "GET", token: token ?? null });
}

export async function getSaccoDrivers(id: string, token?: string | null): Promise<SaccoDriver[]> {
  const data = await request<SaccoDriver[]>(`/api/sacco/${id}/drivers`, {
    method: "GET",
    token: token ?? null
  });

  return Array.isArray(data) ? data : [];
}

export async function getSaccoMatatus(
  id: string,
  options: { status?: string } = {},
  token?: string | null
): Promise<SaccoMatatu[]> {
  const params = new URLSearchParams();
  if (options.status) {
    params.set("status", options.status);
  }

  const qs = params.toString();

  const data = await request<SaccoMatatu[]>(`/api/sacco/${id}/matatus${qs ? `?${qs}` : ""}`, {
    method: "GET",
    token: token ?? null
  });

  return Array.isArray(data) ? data : [];
}

export async function uploadSaccoDoc(
  id: string,
  type: "logo" | "permit" | "insurance" | "compliance",
  file: File,
  token?: string | null
): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  return request<any>(`/api/sacco/${id}/docs`, {
    method: "POST",
    body: formData,
    token: token ?? null
  });
}

export async function setDriverEnabled(
  saccoId: string,
  driverId: string,
  enabled: boolean,
  token?: string | null
): Promise<SaccoDriver> {
  return request<SaccoDriver>(`/api/sacco/${saccoId}/driver/${driverId}/disable`, {
    method: "POST",
    body: { enabled },
    token: token ?? null
  });
}

export async function setDriverVerification(
  saccoId: string,
  driverId: string,
  status: "pending" | "approved" | "rejected",
  token?: string | null
): Promise<SaccoDriver> {
  return request<SaccoDriver>(`/api/sacco/${saccoId}/driver/${driverId}/verification`, {
    method: "POST",
    body: { status },
    token: token ?? null
  });
}

export async function setMatatuApproval(
  saccoId: string,
  matatuId: string,
  status: "pending" | "approved" | "rejected",
  token?: string | null
): Promise<SaccoMatatu> {
  return request<SaccoMatatu>(`/api/sacco/${saccoId}/matatu/${matatuId}/approval`, {
    method: "POST",
    body: { status },
    token: token ?? null
  });
}
