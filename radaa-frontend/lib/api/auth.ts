/* lib/api/auth.ts - created by instruction
   Exports: login, register, checkAuth
   These return the inner data object from the backend so AuthContext can use it directly.
*/
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5001";

export interface AuthUser {
  _id: string;
  email: string;
  username?: string;
  phone?: string;
  handle?: string;
  createdAt?: string;
  role?: string;
  enabled?: boolean;
  driverProfile?: {
    licenseNumber?: string;
    saccoName?: string;
    vehicleRegistration?: string;
    profilePhotoUrl?: string;
  };
  driverVerificationStatus?: "pending" | "approved" | "rejected" | string;
  saccoProfile?: {
    saccoName?: string;
    registrationNumber?: string;
    logoUrl?: string;
    permitUrl?: string;
    insuranceUrl?: string;
    complianceDocUrl?: string;
  };
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  phone?: string;
  handle?: string;
  role?: "user" | "driver" | "admin" | string;
  saccoName?: string;
  vehicleRegistration?: string;
  licenseNumber?: string;
  profilePhoto?: string;
  registrationNumber?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthApiResponse extends AuthUser {
  token: string;
}

export interface CheckAuthResult {
  authenticated: boolean;
  user?: AuthUser;
  health?: unknown;
}

export async function login(payload: LoginPayload): Promise<AuthApiResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include"
  });
  const json = (await res.json().catch(() => ({}))) as unknown;

  if (!res.ok) {
    const maybeError = json as { message?: unknown };
    const message =
      typeof maybeError.message === "string" ? maybeError.message : "Login failed";
    throw new Error(message);
  }

  return json as AuthApiResponse;
}

export async function register(payload: RegisterPayload): Promise<AuthApiResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include"
  });
  const json = (await res.json().catch(() => ({}))) as unknown;

  if (!res.ok) {
    const maybeError = json as { message?: unknown };
    const message =
      typeof maybeError.message === "string" ? maybeError.message : "Registration failed";
    throw new Error(message);
  }

  return json as AuthApiResponse;
}

/*
  checkAuth(token?)
  Tries to call protected profile endpoint if token provided; otherwise falls back to health.
  Returns { authenticated: bool, user?: object }
*/
export async function checkAuth(token?: string): Promise<CheckAuthResult> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    // try profile (requires valid token); if that fails try health
    const res = await fetch(`${BASE_URL}/api/auth/profile`, {
      method: "GET",
      headers,
      credentials: "include"
    });
    if (!res.ok) {
      // fallback to health (non-auth)
      const health = await fetch(`${BASE_URL}/api/auth/health`, {
        method: "GET",
        headers,
        credentials: "include"
      }).catch(() => null);
      return {
        authenticated: false,
        health: health ? await health.json().catch(() => null) : null
      };
    }
    const json = (await res.json().catch(() => null)) as unknown;

    if (json && typeof json === "object") {
      const fromData = (json as { data?: unknown }).data;
      const fromUser = (json as { user?: unknown }).user;
      const finalUser = (fromData ?? fromUser ?? json) as AuthUser;
      return { authenticated: true, user: finalUser };
    }

    return { authenticated: true };
  } catch {
    return { authenticated: false };
  }
}

export async function getProfile(token: string): Promise<AuthUser> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  const res = await fetch(`${BASE_URL}/api/auth/profile`, {
    method: "GET",
    headers,
    credentials: "include"
  });

  const json = (await res.json().catch(() => ({}))) as unknown;

  if (!res.ok) {
    const maybeError = json as { message?: unknown };
    const message =
      typeof maybeError.message === "string"
        ? maybeError.message
        : "Failed to load profile";
    throw new Error(message);
  }

  return json as AuthUser;
}
