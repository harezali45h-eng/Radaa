"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { getLiveMatatus, getMapMarkers } from "@/lib/api";
import MapContainer from "@/components/map/MapContainer";
import { useRealtime } from "@/context/realtimeContext";

interface LatLng {
  lat: number;
  lng: number;
}

interface Matatu {
  id: string;
  plate?: string;
  numberPlate?: string;
  route?: string;
  location?: LatLng | null;
  status?: string;
   sacco?: string;
   driverName?: string;
   driverPhone?: string;
   mainPhotoUrl?: string | null;
   rating?: {
     avgRating: number;
     count: number;
   };
}

interface PassengerMarker {
  id: string;
  location: LatLng;
}

interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function haversineDistanceMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return R * c;
}

export default function MapPage() {
  const { connect, on, off } = useSocket();
  const { driverOnline, setDriverOnline } = useRealtime();

  const [matatus, setMatatus] = useState<Matatu[]>([]);
  const [passengers, setPassengers] = useState<PassengerMarker[]>([]);
  const [selectedMatatuId, setSelectedMatatuId] = useState<string | null>(null);
  const [displayPositions, setDisplayPositions] = useState<Record<string, LatLng>>({});
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadInitial = async () => {
      try {
        setLoading(true);

        let array: Matatu[] = [];

        try {
          const markers: any = await getMapMarkers();
          if (cancelled) return;

          const raw = Array.isArray(markers) ? markers : [];

          array = raw.map((m: any) => ({
            id: String(m.id ?? m._id ?? ""),
            plate: m.plate,
            numberPlate: m.numberPlate,
            route: m.route,
            sacco: m.sacco ?? undefined,
            driverName: m.driverName ?? undefined,
            driverPhone: m.driverPhone ?? undefined,
            location: m.location ?? null,
            status: "online",
            mainPhotoUrl: m.mainPhotoUrl ?? null,
            rating: m.rating
          }));
        } catch {
          const data = await getLiveMatatus();
          if (cancelled) return;
          const raw = Array.isArray(data) ? (data as Matatu[]) : [];
          array = raw;
        }

        if (!cancelled) {
          setMatatus(array);
        }
      } catch {
        if (cancelled) return;
        setMatatus([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadInitial();

    connect();

    const handleMatatuUpdate = (payload: any) => {
      const updates: Matatu[] = Array.isArray(payload) ? payload : [payload];

      setMatatus((current) => {
        const map = new Map<string, Matatu>();
        current.forEach((m) => {
          map.set(m.id, m);
        });

        updates.forEach((update) => {
          if (!update || !update.id) return;
          const existing = map.get(update.id) || { id: update.id };
          map.set(update.id, { ...existing, ...update });
        });

        return Array.from(map.values());
      });
    };

    const handleRideAssigned = (payload: any) => {
      if (!payload) return;

      const loc =
        payload.pickupLocation || payload.location || payload.passengerLocation || null;

      if (!loc || typeof loc.lat !== "number" || typeof loc.lng !== "number") {
        return;
      }

      const id = String(
        payload.id || payload.rideId || `${loc.lat},${loc.lng},${Date.now()}`
      );

      setPassengers((current) => {
        if (current.find((p) => p.id === id)) {
          return current;
        }

        return [...current, { id, location: { lat: loc.lat, lng: loc.lng } }];
      });
    };

    const handlePassengersUpdate = (payload: any) => {
      const updates = Array.isArray(payload) ? payload : [payload];

      setPassengers((current) => {
        const byId = new Map<string, PassengerMarker>(current.map((p) => [p.id, p]));

        updates.forEach((update) => {
          if (!update) return;

          const loc =
            update.location || update.pickupLocation || update.passengerLocation || null;

          const rawId = update.id ?? update.passengerId ?? update.rideId;
          const id = rawId != null ? String(rawId) : undefined;

          if (!id) {
            return;
          }

          if (!loc || typeof loc.lat !== "number" || typeof loc.lng !== "number") {
            byId.delete(id);
            return;
          }

          byId.set(id, {
            id,
            location: { lat: loc.lat, lng: loc.lng }
          });
        });

        return Array.from(byId.values());
      });
    };

    on("matatus:live_update", handleMatatuUpdate);
    on("ride:assigned", handleRideAssigned);
    on("passengers:update", handlePassengersUpdate);

    return () => {
      cancelled = true;
      off("matatus:live_update", handleMatatuUpdate);
      off("ride:assigned", handleRideAssigned);
      off("passengers:update", handlePassengersUpdate);
    };
  }, [connect, on, off]);

  useEffect(() => {
    let frameId: number;

    const animate = () => {
      setDisplayPositions((prev) => {
        const next: Record<string, LatLng> = { ...prev };
        const easing = 0.15;

        matatus.forEach((matatu) => {
          if (!matatu.location) return;

          const current = prev[matatu.id] ?? matatu.location;
          const target = matatu.location;

          const lat = current.lat + (target.lat - current.lat) * easing;
          const lng = current.lng + (target.lng - current.lng) * easing;

          next[matatu.id] = { lat, lng };
        });

        return next;
      });

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [matatus]);

  const bounds: Bounds | null = useMemo(() => {
    const locations: LatLng[] = [];

    matatus.forEach((m) => {
      if (m.location && typeof m.location.lat === "number" && typeof m.location.lng === "number") {
        locations.push(m.location);
      }
    });

    passengers.forEach((p) => {
      if (
        p.location &&
        typeof p.location.lat === "number" &&
        typeof p.location.lng === "number"
      ) {
        locations.push(p.location);
      }
    });

    if (userLocation) {
      locations.push(userLocation);
    }

    if (locations.length === 0) {
      return null;
    }

    let minLat = locations[0].lat;
    let maxLat = locations[0].lat;
    let minLng = locations[0].lng;
    let maxLng = locations[0].lng;

    locations.forEach((loc) => {
      if (loc.lat < minLat) minLat = loc.lat;
      if (loc.lat > maxLat) maxLat = loc.lat;
      if (loc.lng < minLng) minLng = loc.lng;
      if (loc.lng > maxLng) maxLng = loc.lng;
    });

    return { minLat, maxLat, minLng, maxLng };
  }, [matatus, passengers, userLocation]);

  const hasAnyLocation = useMemo(() => bounds !== null, [bounds]);

  const project = useCallback(
    (location: LatLng | undefined | null) => {
      if (!location || !bounds) {
        return { left: "50%", top: "50%" };
      }

      const latRange = Math.max(bounds.maxLat - bounds.minLat, 0.0001);
      const lngRange = Math.max(bounds.maxLng - bounds.minLng, 0.0001);

      const x = ((location.lng - bounds.minLng) / lngRange) * 100;
      const y = 100 - ((location.lat - bounds.minLat) / latRange) * 100;

      return {
        left: `${Math.min(100, Math.max(0, x))}%`,
        top: `${Math.min(100, Math.max(0, y))}%`
      };
    },
    [bounds]
  );

  const selectedMatatu = useMemo(
    () => matatus.find((m) => m.id === selectedMatatuId) || null,
    [matatus, selectedMatatuId]
  );

  const selectedMatatuPhotoSrc = useMemo(() => {
    if (!selectedMatatu || !selectedMatatu.mainPhotoUrl) {
      return null;
    }

    const url = selectedMatatu.mainPhotoUrl;
    if (url.startsWith("http")) {
      return url;
    }

    return `${BACKEND_URL}${url}`;
  }, [selectedMatatu]);

  const matatusWithFlags = useMemo(
    () => matatus.map((m) => ({ ...m, isTracked: trackingId != null && m.id === trackingId })),
    [matatus, trackingId]
  );

  const selectedMatatuEta = useMemo(() => {
    if (!selectedMatatu || !selectedMatatu.location || !userLocation) {
      return null;
    }

    const distanceMeters = haversineDistanceMeters(userLocation, selectedMatatu.location);
    const speedKmh = 25;
    const etaMinutes = (distanceMeters / 1000 / speedKmh) * 60;

    return { distanceMeters, etaMinutes };
  }, [selectedMatatu, userLocation]);

  const handleSelectMatatu = useCallback((id: string) => {
    setSelectedMatatuId(id);
  }, []);

  const handleCenterOnMe = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGeoError("Geolocation is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGeoError(null);
      },
      (error) => {
        setGeoError(error.message || "Unable to fetch location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <h1 className="text-lg font-semibold">Live Matatu Map</h1>
        <p className="mt-1 text-xs text-slate-300">
          Live view of matatus and nearby passengers. Positions are updated in real time.
        </p>

        <div className="mt-3 flex items-center justify-between text-[11px]">
          <div className="inline-flex rounded-md border border-slate-700 bg-slate-950/60 p-0.5">
            <button
              type="button"
              onClick={() => setDriverOnline(false)}
              className={`rounded-sm px-2 py-0.5 text-[11px] ${
                !driverOnline
                  ? "bg-slate-800 text-slate-100"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              Passenger
            </button>
            <button
              type="button"
              onClick={() => setDriverOnline(true)}
              className={`ml-1 rounded-sm px-2 py-0.5 text-[11px] ${
                driverOnline
                  ? "bg-emerald-600/70 text-emerald-50"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              Driver
            </button>
          </div>
          <span className="text-[10px] text-slate-400">
            Mode: {driverOnline ? "Driver" : "Passenger"}
          </span>
        </div>

        <MapContainer
          matatus={matatusWithFlags}
          passengers={passengers}
          userLocation={userLocation}
          displayPositions={displayPositions}
          project={project}
          onCenterOnMe={handleCenterOnMe}
          onSelectMatatu={handleSelectMatatu}
          isLoading={loading}
          hasAnyLocation={hasAnyLocation}
          driverMode={driverOnline}
        />

        {geoError && <p className="mt-2 text-[11px] text-amber-300">{geoError}</p>}
      </div>

      <aside className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <h2 className="text-base font-semibold">Matatu details</h2>
        {selectedMatatu ? (
          <div className="space-y-2 text-xs text-slate-200">
            {selectedMatatuPhotoSrc && (
              <div className="overflow-hidden rounded-md border border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedMatatuPhotoSrc}
                  alt="Matatu photo"
                  className="h-28 w-full object-cover"
                />
              </div>
            )}
            <div>
              <span className="text-slate-400">Plate: </span>
              {selectedMatatu.plate || selectedMatatu.numberPlate || "Unknown"}
            </div>
            <div>
              <span className="text-slate-400">Route: </span>
              {selectedMatatu.route || "—"}
            </div>
            {selectedMatatu.driverName && (
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-100">
                  {selectedMatatu.driverName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-slate-400">Driver: </span>
                  {selectedMatatu.driverName}
                  {selectedMatatu.driverPhone && (
                    <span className="text-slate-500"> · {selectedMatatu.driverPhone}</span>
                  )}
                </div>
              </div>
            )}
            {selectedMatatu.sacco && (
              <div>
                <span className="text-slate-400">SACCO: </span>
                {selectedMatatu.sacco}
              </div>
            )}
            {selectedMatatu.rating && (
              <div>
                <span className="text-slate-400">Rating: </span>
                {selectedMatatu.rating.avgRating.toFixed(1)} ★ ({selectedMatatu.rating.count})
              </div>
            )}
            <div>
              <span className="text-slate-400">Lat: </span>
              {selectedMatatu.location?.lat ?? "—"}
            </div>
            <div>
              <span className="text-slate-400">Lng: </span>
              {selectedMatatu.location?.lng ?? "—"}
            </div>
            {selectedMatatuEta && (
              <>
                <div>
                  <span className="text-slate-400">Distance from you: </span>
                  {(selectedMatatuEta.distanceMeters / 1000).toFixed(1)} km
                </div>
                <div>
                  <span className="text-slate-400">ETA (25 km/h): </span>
                  {Math.round(selectedMatatuEta.etaMinutes)} min
                </div>
              </>
            )}
            <button
              type="button"
              onClick={() =>
                setTrackingId((current) =>
                  selectedMatatu ? (current === selectedMatatu.id ? null : selectedMatatu.id) : current
                )
              }
              className="mt-2 inline-flex items-center rounded-md bg-sky-600 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm transition hover:bg-sky-500"
            >
              {trackingId === selectedMatatu.id ? "Stop tracking" : "Track this matatu"}
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-400">Select a matatu marker on the map.</p>
        )}
      </aside>
    </div>
  );
}
