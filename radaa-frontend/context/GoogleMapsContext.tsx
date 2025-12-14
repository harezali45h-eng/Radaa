"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useLoadScript } from "@react-google-maps/api";

interface GoogleMapsContextValue {
  isLoaded: boolean;
  loadError: Error | null;
  apiKey: string;
}

const GoogleMapsContext = createContext<GoogleMapsContextValue | undefined>(
  undefined,
);

const rawKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const sanitizedKey =
  rawKey && rawKey.toLowerCase().includes("your-google-maps-api-key")
    ? ""
    : rawKey;

export function GoogleMapsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: sanitizedKey,
    id: "radaa-google-maps-script",
    libraries: ["places"],
  });

  const value: GoogleMapsContextValue = useMemo(
    () => ({
      isLoaded: Boolean(sanitizedKey) && isLoaded && !loadError,
      loadError: loadError ?? null,
      apiKey: sanitizedKey,
    }),
    [isLoaded, loadError],
  );

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMaps(): GoogleMapsContextValue {
  const ctx = useContext(GoogleMapsContext);

  if (!ctx) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }

  return ctx;
}
