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

    const headerBgClass = isDriver
      ? "border-b border-slate-800/70 bg-gradient-to-r from-radaa-mint/20 via-radaa-teal/15 to-radaa-gold/10 backdrop-blur"
      : isSacco
        ? "border-b border-slate-800/70 bg-gradient-to-r from-radaa-gold/20 via-radaa-orange/15 to-radaa-mint/10 backdrop-blur"
        : "border-b border-slate-800/70 bg-gradient-to-r from-radaa-blue/25 via-radaa-purple/20 to-radaa-mint/10 backdrop-blur";

    const primaryButtonClass = isDriver
      ? "radaa-btn-primary bg-gradient-to-r from-radaa-mint to-radaa-teal shadow-glow-mint"
      : isSacco
        ? "radaa-btn-primary bg-gradient-to-r from-radaa-gold to-radaa-orange shadow-glow-blue"
        : "radaa-btn-primary bg-gradient-to-r from-radaa-blue to-radaa-purple shadow-glow-blue";

    const subtleButtonClass = "radaa-btn-secondary";

    const cardSurfaceClass = isDriver
      ? "radaa-card border-radaa-mint/40"
      : isSacco
        ? "radaa-card border-radaa-gold/40"
        : "radaa-card";

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
