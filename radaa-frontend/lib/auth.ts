const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export interface AuthUser {
  _id: string;
  username: string;
  handle?: string;
  email: string;
  phone?: string;
  createdAt: string;
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

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      "Request failed";

    throw new Error(message);
  }

  return data as T;
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
