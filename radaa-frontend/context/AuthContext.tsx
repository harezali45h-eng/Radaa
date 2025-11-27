"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
  login as loginRequest,
  register as registerRequest,
  checkAuth
} from "@/lib/api/auth";

const TOKEN_STORAGE_KEY = "radaa_auth_token";
const TOKEN_COOKIE_NAME = "radaa_token";
const MODE_STORAGE_KEY = "radaa_active_mode";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!storedToken) {
      setLoading(false);

      if (
        !pathname.startsWith("/auth") &&
        pathname !== "/" &&
        !pathname.startsWith("/public")
      ) {
        router.replace("/auth/login");
      }

      return;
    }

    setToken(storedToken);

    const run = async () => {
      try {
        const result = await checkAuth(storedToken);

        if (result.authenticated && result.user) {
          setUser(result.user);
          return;
        }

        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(MODE_STORAGE_KEY);

        if (
          !pathname.startsWith("/auth") &&
          pathname !== "/" &&
          !pathname.startsWith("/public")
        ) {
          router.replace("/auth/login");
        }
      } catch (error) {
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);

        if (
          !pathname.startsWith("/auth") &&
          pathname !== "/" &&
          !pathname.startsWith("/public")
        ) {
          router.replace("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [pathname, router]);

  const login = async (payload: LoginPayload) => {
    setLoading(true);

    try {
      const result = await loginRequest(payload);

      setUser({
        _id: result._id,
        username: result.username,
        handle: result.handle,
        email: result.email,
        phone: result.phone,
        createdAt: result.createdAt,
        role: (result as any).role,
        enabled: (result as any).enabled,
        driverProfile: (result as any).driverProfile,
        driverVerificationStatus: (result as any).driverVerificationStatus,
        saccoProfile: (result as any).saccoProfile
      });

      setToken(result.token);

      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
        window.localStorage.setItem("radaa_user_id", result._id);

        const isSecure = window.location.protocol === "https:";
        const cookieParts = [
          `${TOKEN_COOKIE_NAME}=${result.token}`,
          "Path=/",
          "SameSite=Lax",
          "Max-Age=" + 7 * 24 * 60 * 60
        ];

        if (isSecure) {
          cookieParts.push("Secure");
        }

        document.cookie = cookieParts.join("; ");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);

    try {
      const result = await registerRequest(payload);

      setUser({
        _id: result._id,
        username: result.username,
        handle: result.handle,
        email: result.email,
        phone: result.phone,
        createdAt: result.createdAt,
        role: (result as any).role,
        enabled: (result as any).enabled,
        driverProfile: (result as any).driverProfile,
        driverVerificationStatus: (result as any).driverVerificationStatus
      });

      setToken(result.token);

      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
        window.localStorage.setItem("radaa_user_id", result._id);

        const isSecure = window.location.protocol === "https:";
        const cookieParts = [
          `${TOKEN_COOKIE_NAME}=${result.token}`,
          "Path=/",
          "SameSite=Lax",
          "Max-Age=" + 7 * 24 * 60 * 60
        ];

        if (isSecure) {
          cookieParts.push("Secure");
        }

        document.cookie = cookieParts.join("; ");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(MODE_STORAGE_KEY);
      document.cookie = `${TOKEN_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
    }

    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}
