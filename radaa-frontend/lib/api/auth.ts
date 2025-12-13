/* lib/api/auth.ts - created by instruction
   Exports: login, register, checkAuth
   These return the inner data object from the backend so AuthContext can use it directly.
*/
import API from "../api";

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
  driverStatus?: "provisional" | "active" | "suspended" | string;
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
  try {
    const res = await API.post<AuthApiResponse>("/auth/login", payload);
    return res.data;
  } catch (error: any) {
    const maybeError = (error?.response?.data ?? {}) as { message?: unknown };
    const message =
      (typeof maybeError.message === "string" && maybeError.message) ||
      error?.message ||
      "Login failed";
    throw new Error(message);
  }
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthApiResponse> {
  try {
    const res = await API.post<AuthApiResponse>("/auth/register", payload);
    return res.data;
  } catch (error: any) {
    const maybeError = (error?.response?.data ?? {}) as { message?: unknown };
    const message =
      (typeof maybeError.message === "string" && maybeError.message) ||
      error?.message ||
      "Registration failed";
    throw new Error(message);
  }
}

/*
  checkAuth(token?)
  Tries to call protected profile endpoint if token provided; otherwise falls back to health.
  Returns { authenticated: bool, user?: object }
*/
export async function checkAuth(token?: string): Promise<CheckAuthResult> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      const res = await API.get("/auth/profile", { headers });
      const json = res.data as unknown;

      if (json && typeof json === "object") {
        const fromData = (json as { data?: unknown }).data;
        const fromUser = (json as { user?: unknown }).user;
        const finalUser = (fromData ?? fromUser ?? json) as AuthUser;
        return { authenticated: true, user: finalUser };
      }

      return { authenticated: true };
    } catch (error: any) {
      try {
        const healthRes = await API.get("/auth/health", { headers });
        return {
          authenticated: false,
          health: healthRes.data,
        };
      } catch {
        return { authenticated: false };
      }
    }
  } catch {
    return { authenticated: false };
  }
}

export async function getProfile(token: string): Promise<AuthUser> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const res = await API.get<AuthUser>("/auth/profile", { headers });
    return res.data;
  } catch (error: any) {
    const maybeError = (error?.response?.data ?? {}) as { message?: unknown };
    const message =
      (typeof maybeError.message === "string" && maybeError.message) ||
      error?.message ||
      "Failed to load profile";
    throw new Error(message);
  }
}
