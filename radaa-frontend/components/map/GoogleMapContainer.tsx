"use client";

import { useMemo } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import type { LatLng, MatatuLike } from "@/lib/map/markerHelpers";

interface PassengerPoint {
  id: string;
  location: LatLng;
}

interface Matatu extends MatatuLike {
  id: string;
  status?: string;
  location?: LatLng | null;
  isTracked?: boolean;
}

interface GoogleMapContainerProps {
  matatus: Matatu[];
  passengers: PassengerPoint[];
  userLocation: LatLng | null;
  onCenterOnMe: () => void;
  onSelectMatatu: (id: string) => void;
  isLoading: boolean;
  hasAnyLocation: boolean;
  driverMode?: boolean;
  showCenterOnMe?: boolean;
}

const containerStyle: google.maps.MapOptions["backgroundColor"] extends never
  ? { width: string; height: string }
  : { width: string; height: string } = {
  width: "100%",
  height: "100%",
};

const defaultCenter: LatLng = {
  lat: -1.286389,
  lng: 36.817223,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  backgroundColor: "#020617",
};

export default function GoogleMapContainer({
  matatus,
  passengers,
  userLocation,
  onCenterOnMe,
  onSelectMatatu,
  isLoading,
  hasAnyLocation,
  showCenterOnMe = true,
}: GoogleMapContainerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    id: "radaa-google-maps-script",
  });

  const center = useMemo<LatLng>(() => {
    if (userLocation) return userLocation;

    const firstWithLocation = matatus.find(
      (m) => m.location && typeof m.location.lat === "number" && typeof m.location.lng === "number",
    );

    if (firstWithLocation && firstWithLocation.location) {
      return firstWithLocation.location;
    }

    return defaultCenter;
  }, [userLocation, matatus]);

  const showEmptyState = !isLoading && !hasAnyLocation;

  return (
    <div className="relative mt-4 min-h-[320px] h-[55vh] md:h-[65vh] overflow-hidden rounded-lg bg-slate-950">
      {(!isLoaded || isLoading) && !loadError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
          <div className="absolute inset-4 rounded-lg border border-slate-800/60" />
        </div>
      )}

      {loadError && (
        <div className="flex h-full items-center justify-center px-4 text-center text-xs text-amber-200">
          Google Maps failed to load. Please check your API key and network
          connection.
        </div>
      )}

      {isLoaded && !loadError && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          options={mapOptions}
        >
          {matatus.map((m) => {
            if (!m.location) return null;
            return (
              <Marker
                key={m.id}
                position={m.location}
                onClick={() => onSelectMatatu(m.id)}
                title={m.plate || m.numberPlate || "Matatu"}
              />
            );
          })}

          {passengers.map((p) => (
            <Marker
              key={p.id}
              position={p.location}
              title="Passenger"
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 4,
                fillColor: "#FBBF24",
                fillOpacity: 1,
                strokeColor: "#1F2937",
                strokeWeight: 1,
              }}
            />
          ))}

          {userLocation && (
            <Marker
              position={userLocation}
              title="You"
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5.5,
                fillColor: "#0EA5E9",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
              }}
            />
          )}
        </GoogleMap>
      )}

      {showEmptyState && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-slate-400">
          Waiting for live location data...
        </div>
      )}

      {showCenterOnMe && (
        <button
          type="button"
          onClick={onCenterOnMe}
          className="absolute bottom-3 right-3 z-10 inline-flex items-center rounded-md border border-sky-600/60 bg-sky-600/20 px-2.5 py-1 text-[10px] font-medium text-sky-100 shadow hover:border-sky-400 hover:bg-sky-600/30"
        >
          Center on me
        </button>
      )}
    </div>
  );
}
