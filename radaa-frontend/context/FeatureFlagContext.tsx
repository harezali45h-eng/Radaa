"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getFeatureFlags } from "@/lib/api";

export interface FeatureFlagState {
  enabled: boolean;
  rolloutPercent?: number;
}

export type FeatureFlagMap = Record<string, FeatureFlagState>;

interface FeatureFlagContextValue {
  flags: FeatureFlagMap | null;
  loading: boolean;
  error: string | null;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | undefined>(
  undefined,
);

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlagMap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getFeatureFlags();
        if (cancelled) return;

        if (data && typeof data === "object") {
          setFlags(data as FeatureFlagMap);
        } else {
          setFlags({});
        }
      } catch (err) {
        if (cancelled) return;
        // Keep new UI safely OFF if flags cannot be loaded
        setFlags({});
        const message =
          err instanceof Error ? err.message : "Failed to load feature flags";
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  const value: FeatureFlagContextValue = useMemo(
    () => ({ flags, loading, error }),
    [flags, loading, error],
  );

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags(): FeatureFlagContextValue {
  const ctx = useContext(FeatureFlagContext);

  if (!ctx) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagProvider",
    );
  }

  return ctx;
}

export function useIsFeatureEnabled(
  key: string,
  fallbackEnabled = false,
): boolean {
  const { flags, loading } = useFeatureFlags();

  const flagsLoaded = !loading && Boolean(flags);

  if (key === "ui_revamp_v1" && !flagsLoaded) {
    return true;
  }

  if (loading || !flags) {
    return fallbackEnabled;
  }

  const entry = flags[key];

  if (!entry) {
    if (key === "ui_revamp_v1") {
      return true;
    }
    return false;
  }

  return Boolean(entry.enabled);
}

interface FeatureGateProps {
  flagKey: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export function FeatureGate({
  flagKey,
  fallback = null,
  children,
}: FeatureGateProps) {
  const enabled = useIsFeatureEnabled(flagKey, false);

  if (!enabled) return <>{fallback}</>;

  return <>{children}</>;
}
