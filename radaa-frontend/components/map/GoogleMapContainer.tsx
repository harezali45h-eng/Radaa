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

const darkMapStyles: google.maps.MapTypeStyle[] = [
  {
    elementType: "geometry",
    stylers: [{ color: "#0b1722" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#9fb3c8" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#020617" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#59738a" }],
  },
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#102a1f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4caf50" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#304155" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#3f546b" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#4b6584" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d1e4ff" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#061018" }],
  },
];

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  backgroundColor: "#020617",
  styles: darkMapStyles,
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
  const rawKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const apiKey =
    rawKey && rawKey.toLowerCase().includes("your-google-maps-api-key")
      ? ""
      : rawKey;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    id: "radaa-google-maps-script",
    libraries: ["places"],
  });

  const center = useMemo<LatLng>(() => {
    if (userLocation) return userLocation;

    const firstWithLocation = matatus.find(
      (m) =>
        m.location &&
        typeof m.location.lat === "number" &&
        typeof m.location.lng === "number",
    );

    if (firstWithLocation && firstWithLocation.location) {
      return firstWithLocation.location;
    }

    return defaultCenter;
  }, [userLocation, matatus]);

  const showEmptyState = !isLoading && !hasAnyLocation;

  return (
    <div className="relative mt-4 min-h-[320px] h-[55vh] md:h-[65vh] overflow-hidden rounded-lg bg-slate-950">
      {(!isLoaded || isLoading) && !loadError && apiKey && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
          <div className="absolute inset-4 rounded-lg border border-slate-800/60" />
        </div>
      )}

      {(!apiKey || loadError) && (
        <div className="flex h-full items-center justify-center px-4 text-center text-xs text-amber-200">
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
        >
          {matatus.map((m) => {
            if (!m.location) return null;

            let icon: google.maps.Icon | undefined;

            if (
              typeof window !== "undefined" &&
              typeof window.btoa === "function"
            ) {
              const svg = window.btoa(
                `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                   <g fill="none" fill-rule="evenodd">
                     <circle cx="16" cy="16" r="14" fill="#020617" fill-opacity="0.9"/>
                     <path d="M8 19.5c0-4.5 2.7-8.5 8-8.5s8 4 8 8.5c0 1.1-.9 2-2 2H10c-1.1 0-2-.9-2-2z" fill="#FFD400"/>
                     <rect x="11" y="12" width="10" height="5" rx="2" fill="#1F2937"/>
                   </g>
                 </svg>`,
              );

              icon = {
                url: `data:image/svg+xml;base64,${svg}`,
                scaledSize: new google.maps.Size(36, 36),
                anchor: new google.maps.Point(18, 18),
              };
            }

            return (
              <Marker
                key={m.id}
                position={m.location}
                onClick={() => onSelectMatatu(m.id)}
                title={m.plate || m.numberPlate || "Matatu"}
                icon={icon}
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
                fillColor: "#00BFFF",
                fillOpacity: 1,
                strokeColor: "#0B1F2A",
                strokeWeight: 2,
              }}
            />
          ))}

          {userLocation && (
            <Marker
              position={userLocation}
              title="You"
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                fillColor: "#EAF6FF",
                fillOpacity: 1,
                strokeColor: "#00BFFF",
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
