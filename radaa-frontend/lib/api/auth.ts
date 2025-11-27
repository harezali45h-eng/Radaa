const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export interface AuthUser {
  _id: string;
  username: string;
  handle?: string;
  email: string;
  phone?: string;
  createdAt: string;
  role?: "user" | "driver" | "admin";
  enabled?: boolean;
  driverProfile?: {
    saccoName?: string;
    vehicleRegistration?: string;
    licenseNumber?: string;
    profilePhotoUrl?: string;
  };
  driverVerificationStatus?: "pending" | "approved" | "rejected";
  saccoProfile?: {
    saccoName?: string;
    registrationNumber?: string;
    logoUrl?: string;
    permitUrl?: string;
    insuranceUrl?: string;
    complianceDocUrl?: string;
  };
}

export interface AuthResult extends AuthUser {
  token: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  phone?: string;
  handle?: string;
  role?: "user" | "driver" | "admin";
  saccoName?: string;
  vehicleRegistration?: string;
  licenseNumber?: string;
  profilePhoto?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CheckAuthResponse {
  authenticated: boolean;
  user?: AuthUser;
}

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

  // Simple retry for transient failures (network issues / 5xx responses)
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

      console.error("API ERROR:", (error as any)?.response?.data || error);

      if (attempt >= maxAttempts) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed");
}

export async function register(payload: RegisterPayload): Promise<AuthResult> {
  return request<AuthResult>("/api/auth/register", {
    method: "POST",
    body: payload
  });
}

export async function login(payload: LoginPayload): Promise<AuthResult> {
  return request<AuthResult>("/api/auth/login", {
    method: "POST",
    body: payload
  });
}

export async function getProfile(token: string): Promise<AuthUser> {
  return request<AuthUser>("/api/auth/profile", {
    method: "GET",
    token
  });
}

export async function checkAuth(token: string): Promise<CheckAuthResponse> {
  return request<CheckAuthResponse>("/api/auth/check", {
    method: "GET",
    token
  });
}

export async function validateSession(token: string): Promise<CheckAuthResponse> {
  return checkAuth(token);
}
