const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

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

export interface MatatuPhoto {
  _id: string;
  url: string;
  status?: "pending" | "approved" | "rejected";
  caption?: string;
}

export async function getMatatuPhotos(id: string, token?: string | null): Promise<MatatuPhoto[]> {
  const data = await request<MatatuPhoto[]>(`/api/matatus/${id}/photos`, {
    method: "GET",
    token: token ?? null
  });

  return Array.isArray(data) ? data : [];
}

export async function uploadMatatuPhoto(
  id: string,
  file: File,
  options: { caption?: string } = {},
  token?: string | null
): Promise<MatatuPhoto[]> {
  const formData = new FormData();
  formData.append("photo", file);
  if (options.caption) {
    formData.append("caption", options.caption);
  }

  const data = await request<MatatuPhoto[]>(`/api/matatus/${id}/photos`, {
    method: "POST",
    body: formData,
    token: token ?? null
  });

  return Array.isArray(data) ? data : [];
}
