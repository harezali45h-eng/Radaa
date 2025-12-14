"use client";

import { useMemo, useRef } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import type { BoltBounds, BoltLatLng, BoltLiveMatatu } from "@/src/features/bolt/types";

interface LiveRadarMapProps {
  matatus: BoltLiveMatatu[];
  displayPositions: Record<string, BoltLatLng>;
  bounds: BoltBounds | null;
  onBoundsChange?: (bounds: BoltBounds | null) => void;
  onSelectMatatu?: (id: string) => void;
  focusedMatatuId?: string | null;
  loading?: boolean;
}

const containerStyle: google.maps.MapOptions["backgroundColor"] extends never
  ? { width: string; height: string }
  : { width: string; height: string } = {
  width: "100%",
  height: "100%",
};

const defaultCenter: BoltLatLng = {
  lat: -1.286389,
  lng: 36.817223,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  backgroundColor: "#09141A",
};

export function LiveRadarMap({
  matatus,
  displayPositions,
  bounds,
  onBoundsChange,
  onSelectMatatu,
  focusedMatatuId,
  loading,
}: LiveRadarMapProps) {
  const rawKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const apiKey =
    rawKey && rawKey.toLowerCase().includes("your-google-maps-api-key")
      ? ""
      : rawKey;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    id: "radaa-bolt-google-maps-script",
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const center = useMemo<BoltLatLng>(() => {
    if (focusedMatatuId) {
      const focused = matatus.find((m) => m.id === focusedMatatuId);
      if (focused?.location) return focused.location;
    }

    const firstWithLocation = matatus.find(
      (m) => m.location && typeof m.location.lat === "number" && typeof m.location.lng === "number",
    );

    if (firstWithLocation?.location) return firstWithLocation.location;

    return defaultCenter;
  }, [matatus, focusedMatatuId]);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    if (matatus.length > 0) {
      const locations = matatus
        .map((m) => m.location)
        .filter((loc): loc is BoltLatLng => Boolean(loc));
      if (locations.length > 0) {
        const mapBounds = new google.maps.LatLngBounds();
        locations.forEach((loc) => mapBounds.extend(loc));
        map.fitBounds(mapBounds, 64);
      }
    }
  };

  const handleIdle = () => {
    if (!mapRef.current || !onBoundsChange) return;
    const gBounds = mapRef.current.getBounds();
    if (!gBounds) return;

    const ne = gBounds.getNorthEast();
    const sw = gBounds.getSouthWest();

    const nextBounds: BoltBounds = {
      minLat: sw.lat(),
      maxLat: ne.lat(),
      minLng: sw.lng(),
      maxLng: ne.lng(),
    };

    onBoundsChange(nextBounds);
  };

  const hasAnyLocation = useMemo(
    () => matatus.some((m) => m.location),
    [matatus],
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      {(!isLoaded || loading) && !loadError && apiKey && (
        <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
      )}

      {(!apiKey || loadError) && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center text-xs text-amber-200">
          Google Maps failed to load. Please check that your API key is set
          correctly and that the Maps JavaScript API is enabled.
        </div>
      )}

      {isLoaded && !loadError && apiKey && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          options={mapOptions}
          onLoad={handleMapLoad}
          onIdle={handleIdle}
        >
          {matatus.map((m) => {
            const display = displayPositions[m.id] ?? m.location;
            if (!display) return null;

            const isFocused = focusedMatatuId != null && focusedMatatuId === m.id;

            return (
              <Marker
                key={m.id}
                position={display}
                onClick={() => onSelectMatatu && onSelectMatatu(m.id)}
                title={m.plate || m.numberPlate || "Matatu"}
                icon={{
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: isFocused ? 6 : 4.5,
                  fillColor: "#FACC15", // Bolt-style yellow
                  fillOpacity: 1,
                  strokeColor: "#020617",
                  strokeWeight: 1.5,
                  rotation: typeof m.bearing === "number" ? m.bearing : 0,
                }}
              />
            );
          })}
        </GoogleMap>
      )}

      {hasAnyLocation && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
      )}
    </div>
  );
}

export default LiveRadarMap;
