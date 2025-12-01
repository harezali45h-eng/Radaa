import API from "./api";

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

  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await API.request<T>({
      url: path,
      method,
      data: body,
      headers
    });

    return response.data as T;
  } catch (error: any) {
    const data = error?.response?.data;

    const message =
      (data && typeof data === "object" && ((data as any).message || (data as any).error)) ||
      error?.message ||
      "Request failed";

    throw new Error(message);
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResult> {
  return request<AuthResult>("/auth/register", {
    method: "POST",
    body: payload
  });
}

export async function login(payload: LoginPayload): Promise<AuthResult> {
  return request<AuthResult>("/auth/login", {
    method: "POST",
    body: payload
  });
}

export async function getProfile(token: string): Promise<AuthUser> {
  return request<AuthUser>("/auth/profile", {
    method: "GET",
    token
  });
}

export async function checkAuth(token: string): Promise<CheckAuthResponse> {
  return request<CheckAuthResponse>("/auth/check", {
    method: "GET",
    token
  });
}

export async function validateSession(token: string): Promise<CheckAuthResponse> {
  return checkAuth(token);
}
