"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface RideIntentLocation {
  lat: number;
  lng: number;
}

interface RideIntentState {
  destination: RideIntentLocation | null;
  label: string | null;
}

interface RideIntentContextValue {
  intent: RideIntentState;
  setIntent: (value: RideIntentState) => void;
  clearIntent: () => void;
}

const DEFAULT_INTENT: RideIntentState = {
  destination: null,
  label: null,
};

const STORAGE_KEY = "radaa_ride_intent_v1";

const RideIntentContext = createContext<RideIntentContextValue | undefined>(
  undefined,
);

export function RideIntentProvider({ children }: { children: ReactNode }) {
  const [intent, setInternalIntent] = useState<RideIntentState>(DEFAULT_INTENT);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<RideIntentState>;

      const hasValidDestination =
        parsed.destination == null ||
        (typeof parsed.destination === "object" &&
          parsed.destination !== null &&
          typeof (parsed.destination as any).lat === "number" &&
          typeof (parsed.destination as any).lng === "number");

      const hasValidLabel =
        parsed.label == null || typeof parsed.label === "string";

      if (!hasValidDestination || !hasValidLabel) {
        return;
      }

      setInternalIntent({
        destination:
          parsed.destination &&
          typeof (parsed.destination as any).lat === "number" &&
          typeof (parsed.destination as any).lng === "number"
            ? {
                lat: (parsed.destination as any).lat,
                lng: (parsed.destination as any).lng,
              }
            : null,
        label: parsed.label ?? null,
      });
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(intent));
    } catch {
      return;
    }
  }, [intent]);

  const setIntent = (value: RideIntentState) => {
    setInternalIntent({
      destination: value.destination
        ? { lat: value.destination.lat, lng: value.destination.lng }
        : null,
      label: value.label ?? null,
    });
  };

  const clearIntent = () => {
    setInternalIntent(DEFAULT_INTENT);
  };

  const value = useMemo(
    () => ({
      intent,
      setIntent,
      clearIntent,
    }),
    [intent],
  );

  return (
    <RideIntentContext.Provider value={value}>
      {children}
    </RideIntentContext.Provider>
  );
}

export function useRideIntent(): RideIntentContextValue {
  const ctx = useContext(RideIntentContext);

  if (!ctx) {
    throw new Error("useRideIntent must be used within a RideIntentProvider");
  }

  return ctx;
}
