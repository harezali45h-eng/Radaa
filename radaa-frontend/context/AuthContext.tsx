"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import { login as apiLogin, register as apiRegister, type RegisterPayload } from "@/lib/api/auth";

interface User {
  _id: string;
  email: string;
  token: string;
  username?: string;
  handle?: string;
  phone?: string;
  createdAt?: string;
  role?: string;
  enabled?: boolean;
  driverProfile?: {
    licenseNumber?: string;
    saccoName?: string;
    vehicleRegistration?: string;
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

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const USER_STORAGE_KEY = "user";
const TOKEN_STORAGE_KEY = "radaa_auth_token";
const TOKEN_COOKIE_NAME = "radaa_token";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = window.localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as User;
        if (parsed && typeof parsed._id === "string" && typeof parsed.token === "string") {
          setUser(parsed);
          setToken(parsed.token);
        }
      }

      const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedToken && typeof storedToken === "string") {
        setToken(storedToken);
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);
  const login = async (payload: { email: string; password: string }) => {
    setLoading(true);
    try {
      const result = await apiLogin(payload);
      const userData: User = {
        _id: result._id,
        email: result.email,
        token: result.token,
        username: result.username,
        handle: result.handle,
        phone: result.phone,
        createdAt: result.createdAt,
        role: (result as any).role,
        enabled: (result as any).enabled,
        driverProfile: (result as any).driverProfile,
        driverVerificationStatus: (result as any).driverVerificationStatus,
        saccoProfile: (result as any).saccoProfile
      };

      setUser(userData);
      setToken(userData.token);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        window.localStorage.setItem(TOKEN_STORAGE_KEY, userData.token);
        window.localStorage.setItem("radaa_user_id", userData._id);

        const isSecure = window.location.protocol === "https:";
        const cookieParts = [
          `${TOKEN_COOKIE_NAME}=${userData.token}`,
          "Path=/",
          "SameSite=Lax",
          "Max-Age=" + 7 * 24 * 60 * 60
        ];

        if (isSecure) {
          cookieParts.push("Secure");
        }

        document.cookie = cookieParts.join("; ");
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const result = await apiRegister(payload as any);
      const userData: User = {
        _id: result._id,
        email: result.email,
        token: result.token,
        username: result.username,
        handle: result.handle,
        phone: result.phone,
        createdAt: result.createdAt,
        role: (result as any).role,
        enabled: (result as any).enabled,
        driverProfile: (result as any).driverProfile,
        driverVerificationStatus: (result as any).driverVerificationStatus,
        saccoProfile: (result as any).saccoProfile
      };

      setUser(userData);
      setToken(userData.token);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        window.localStorage.setItem(TOKEN_STORAGE_KEY, userData.token);
        window.localStorage.setItem("radaa_user_id", userData._id);

        const isSecure = window.location.protocol === "https:";
        const cookieParts = [
          `${TOKEN_COOKIE_NAME}=${userData.token}`,
          "Path=/",
          "SameSite=Lax",
          "Max-Age=" + 7 * 24 * 60 * 60
        ];

        if (isSecure) {
          cookieParts.push("Secure");
        }

        document.cookie = cookieParts.join("; ");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_STORAGE_KEY);
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.localStorage.removeItem("radaa_user_id");
      document.cookie = `${TOKEN_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
