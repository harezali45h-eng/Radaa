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
    const data = error?.response?.data;
    const message =
      (data &&
        typeof data === "object" &&
        ((data as any).message || (data as any).error)) ||
      error?.message ||
      "Request failed";

    throw new Error(message);
  }
}

export interface MatatuPhoto {
  _id: string;
  url: string;
  status?: "pending" | "approved" | "rejected";
  caption?: string;
}

export async function getMatatuPhotos(
  id: string,
  token?: string | null,
): Promise<MatatuPhoto[]> {
  const data = await request<MatatuPhoto[]>(`/matatus/${id}/photos`, {
    method: "GET",
    token: token ?? null,
  });

  return Array.isArray(data) ? data : [];
}

export async function uploadMatatuPhoto(
  id: string,
  file: File,
  options: { caption?: string } = {},
  token?: string | null,
): Promise<MatatuPhoto[]> {
  const formData = new FormData();
  formData.append("photo", file);
  if (options.caption) {
    formData.append("caption", options.caption);
  }

  const data = await request<MatatuPhoto[]>(`/matatus/${id}/photos`, {
    method: "POST",
    body: formData,
    token: token ?? null,
  });

  return Array.isArray(data) ? data : [];
}
