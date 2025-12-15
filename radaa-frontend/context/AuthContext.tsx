"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  login as apiLogin,
  register as apiRegister,
  checkAuth,
  type RegisterPayload,
} from "@/lib/api/auth";

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

type LoginCredentialsPayload = {
  email: string;
  password: string;
};

type LoginResponsePayload = User & {
  token: string;
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    payload: LoginCredentialsPayload | LoginResponsePayload,
    rememberOrOptions?: boolean | { remember?: boolean },
  ) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const USER_STORAGE_KEY = "user";
const TOKEN_STORAGE_KEY = "token";
const TOKEN_COOKIE_NAME = "radaa_token";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const localUserRaw = window.localStorage.getItem(USER_STORAGE_KEY);
      const sessionUserRaw = window.sessionStorage.getItem(USER_STORAGE_KEY);

      let hydratedUser: User | null = null;
      let hydratedToken: string | null = null;

      if (localUserRaw) {
        const parsed = JSON.parse(localUserRaw) as User;
        if (
          parsed &&
          typeof parsed._id === "string" &&
          typeof parsed.token === "string"
        ) {
          hydratedUser = parsed;
          hydratedToken = parsed.token;
        }
      }

      if (!hydratedUser && sessionUserRaw) {
        const parsed = JSON.parse(sessionUserRaw) as User;
        if (
          parsed &&
          typeof parsed._id === "string" &&
          typeof parsed.token === "string"
        ) {
          hydratedUser = parsed;
          hydratedToken = parsed.token;
        }
      }

      if (!hydratedToken) {
        const storedToken =
          window.localStorage.getItem(TOKEN_STORAGE_KEY) ||
          window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
        if (storedToken && typeof storedToken === "string") {
          hydratedToken = storedToken;
        }
      }

      if (hydratedUser) {
        setUser(hydratedUser);
      }
      if (hydratedToken) {
        setToken(hydratedToken);
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    const validate = async () => {
      try {
        const result = await checkAuth(token);

        if (cancelled) {
          return;
        }

        if (!result.authenticated) {
          setUser(null);
          setToken(null);

          if (typeof window !== "undefined") {
            window.localStorage.removeItem(USER_STORAGE_KEY);
            window.localStorage.removeItem(TOKEN_STORAGE_KEY);
            window.sessionStorage.removeItem(USER_STORAGE_KEY);
            window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
            window.localStorage.removeItem("radaa_user_id");
            document.cookie = `${TOKEN_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
            router.push("/auth/login");
          }
        } else if (result.user) {
          setUser((prev) => {
            const merged = {
              ...(prev || {}),
              ...result.user,
            } as User;

            return merged;
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    validate();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (
    payload: LoginCredentialsPayload | LoginResponsePayload,
    rememberOrOptions?: boolean | { remember?: boolean },
  ) => {
    setLoading(true);
    try {
      let loginResult: any = payload;

      if (!("token" in payload)) {
        loginResult = await apiLogin({
          email: payload.email,
          password: payload.password,
        });
      }

      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.log("AUTH LOGIN RESPONSE", loginResult);
      }

      const tokenValue = (loginResult as any)?.token;

      if (!loginResult || typeof tokenValue !== "string") {
        const message = (loginResult as any)?.message || "Invalid login response";
        throw new Error(message);
      }

      const normalizedRole = (loginResult as any).role
        ? String((loginResult as any).role).toLowerCase()
        : undefined;

      const userData: User = {
        _id: loginResult._id,
        email: loginResult.email,
        token: tokenValue,
        username: loginResult.username,
        handle: loginResult.handle,
        phone: loginResult.phone,
        createdAt: loginResult.createdAt,
        role: normalizedRole,
        enabled: (loginResult as any).enabled,
        driverProfile: (loginResult as any).driverProfile,
        driverVerificationStatus: (loginResult as any).driverVerificationStatus,
        driverStatus: (loginResult as any).driverStatus,
        saccoProfile: (loginResult as any).saccoProfile,
      };

      setUser(userData);
      setToken(userData.token);

      if (typeof window !== "undefined") {
        let remember = false;

        if (typeof rememberOrOptions === "boolean") {
          remember = rememberOrOptions;
        } else if (
          rememberOrOptions &&
          typeof rememberOrOptions === "object" &&
          "remember" in rememberOrOptions
        ) {
          remember = Boolean(rememberOrOptions.remember);
        }

        const storage = remember
          ? window.localStorage
          : window.sessionStorage;

        storage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        storage.setItem(TOKEN_STORAGE_KEY, userData.token);
        window.localStorage.setItem("radaa_user_id", userData._id);

        if (remember) {
          window.sessionStorage.removeItem(USER_STORAGE_KEY);
          window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        } else {
          window.localStorage.removeItem(USER_STORAGE_KEY);
          window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        }

        const isSecure = window.location.protocol === "https:";
        const cookieParts = [
          `${TOKEN_COOKIE_NAME}=${userData.token}`,
          "Path=/",
          "SameSite=Lax",
          "Max-Age=" + 7 * 24 * 60 * 60,
        ];

        if (isSecure) {
          cookieParts.push("Secure");
        }

        document.cookie = cookieParts.join("; ");
        // TODO: Replace client-managed token cookie with an HttpOnly, secure cookie set by the backend plus a refresh-token flow.
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const result = await apiRegister(payload as any);
      const normalizedRole = (result as any).role
        ? String((result as any).role).toLowerCase()
        : undefined;
      const userData: User = {
        _id: result._id,
        email: result.email,
        token: result.token,
        username: result.username,
        handle: result.handle,
        phone: result.phone,
        createdAt: result.createdAt,
        role: normalizedRole,
        enabled: (result as any).enabled,
        driverProfile: (result as any).driverProfile,
        driverVerificationStatus: (result as any).driverVerificationStatus,
        driverStatus: (result as any).driverStatus,
        saccoProfile: (result as any).saccoProfile,
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
          "Max-Age=" + 7 * 24 * 60 * 60,
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
      window.sessionStorage.removeItem(USER_STORAGE_KEY);
      window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      window.localStorage.removeItem("radaa_user_id");
      document.cookie = `${TOKEN_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token),
        login,
        register,
        logout,
      }}
    >
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
