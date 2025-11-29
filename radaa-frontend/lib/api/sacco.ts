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
    const data = error?.response?.data;
    const message =
      (data && typeof data === "object" && ((data as any).message || (data as any).error)) ||
      error?.message ||
      "Request failed";

    throw new Error(message);
  }
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
  return request<SaccoOverview>(`/sacco/${id}/overview`, { method: "GET", token: token ?? null });
}

export async function getSaccoDrivers(id: string, token?: string | null): Promise<SaccoDriver[]> {
  const data = await request<SaccoDriver[]>(`/sacco/${id}/drivers`, {
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

  const data = await request<SaccoMatatu[]>(`/sacco/${id}/matatus${qs ? `?${qs}` : ""}`, {
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

  return request<any>(`/sacco/${id}/docs`, {
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
  return request<SaccoDriver>(`/sacco/${saccoId}/driver/${driverId}/disable`, {
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
  return request<SaccoDriver>(`/sacco/${saccoId}/driver/${driverId}/verification`, {
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
  return request<SaccoMatatu>(`/sacco/${saccoId}/matatu/${matatuId}/approval`, {
    method: "POST",
    body: { status },
    token: token ?? null
  });
}
