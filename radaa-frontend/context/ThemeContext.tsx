"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useRealtime } from "./realtimeContext";

type UiVariant = "passenger" | "driver" | "sacco" | "generic";

interface ThemeContextValue {
  variant: UiVariant;
  isPassenger: boolean;
  isDriver: boolean;
  isSacco: boolean;
  headerBgClass: string;
  primaryButtonClass: string;
  subtleButtonClass: string;
  cardSurfaceClass: string;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { activeMode } = useRealtime();

  const role = (user as any)?.role as string | undefined;

  const variant: UiVariant = useMemo(() => {
    if (role === "admin") return "sacco";
    if (role === "driver" && activeMode === "driver") return "driver";
    if (!role) return "generic";
    return "passenger";
  }, [role, activeMode]);

  const value: ThemeContextValue = useMemo(() => {
    const isPassenger = variant === "passenger" || variant === "generic";
    const isDriver = variant === "driver";
    const isSacco = variant === "sacco";

    const headerBgClass =
      "border-b border-[rgba(155,179,199,0.45)] bg-[rgba(9,20,26,0.94)] backdrop-blur";

    const primaryButtonClass = "radaa-btn-primary";

    const subtleButtonClass = "radaa-btn-secondary";

    const cardSurfaceClass = "radaa-card";

    return {
      variant,
      isPassenger,
      isDriver,
      isSacco,
      headerBgClass,
      primaryButtonClass,
      subtleButtonClass,
      cardSurfaceClass,
    };
  }, [variant]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return ctx;
}
