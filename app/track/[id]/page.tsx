"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import MapContainer from "@/components/map/MapContainer";
import { useRealtime } from "@/context/realtimeContext";
import { haversineDistanceMeters, type LatLng } from "@/lib/location/distance";

interface PassengerPoint {
  id: string;
  location: LatLng;
}

export default function TrackMatatuPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;
  const matatuId = typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : "";

  const { matatus } = useRealtime();

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGeoError("Geolocation is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGeoError(null);
      },
      (error) => {
        setGeoError(error.message || "Unable to fetch your location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }, []);

  const tracked = useMemo(
    () => matatus.find((m) => m.id === matatuId) || null,
    [matatus, matatuId],
  );

  const passengers: PassengerPoint[] = [];

  const locationsForBounds: LatLng[] = [];
  if (tracked?.location) locationsForBounds.push(tracked.location);
  if (userLocation) locationsForBounds.push(userLocation);

  const hasAnyLocation = locationsForBounds.length > 0;

  const project = (location: LatLng | null | undefined) => {
    if (!location || locationsForBounds.length === 0) {
      return { left: "50%", top: "50%" };
    }

    let minLat = locationsForBounds[0].lat;
    let maxLat = locationsForBounds[0].lat;
    let minLng = locationsForBounds[0].lng;
    let maxLng = locationsForBounds[0].lng;

    locationsForBounds.forEach((loc) => {
      if (loc.lat < minLat) minLat = loc.lat;
      if (loc.lat > maxLat) maxLat = loc.lat;
      if (loc.lng < minLng) minLng = loc.lng;
      if (loc.lng > maxLng) maxLng = loc.lng;
    });

    const latRange = Math.max(maxLat - minLat, 0.0001);
    const lngRange = Math.max(maxLng - minLng, 0.0001);

    const x = ((location.lng - minLng) / lngRange) * 100;
    const y = 100 - ((location.lat - minLat) / latRange) * 100;

    return {
      left: `${Math.min(100, Math.max(0, x))}%`,
      top: `${Math.min(100, Math.max(0, y))}%`,
    };
  };

  const displayPositions: Record<string, LatLng> = tracked?.location
    ? { [tracked.id]: tracked.location }
    : {};

  const distanceInfo = useMemo(() => {
    if (!tracked?.location || !userLocation) return null;

    const distanceMeters = haversineDistanceMeters(userLocation, tracked.location);
    if (!Number.isFinite(distanceMeters)) return null;

    const speedKmh = 25;
    const etaMinutes = (distanceMeters / 1000 / speedKmh) * 60;

    return {
      distanceMeters,
      etaMinutes,
    };
  }, [tracked, userLocation]);

  const isLoadingMap = false;

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Live tracking</h1>
        <p className="text-xs text-slate-300">
          Watch this matatu move in real time and see your estimated arrival.
        </p>
        {tracked && (
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
            <span className="radaa-pill bg-slate-900/80 text-slate-100">
              Plate: {tracked.plate || tracked.numberPlate || tracked.id}
            </span>
            {tracked.route && (
              <span className="radaa-pill bg-slate-900/80 text-slate-200">
                Route: {tracked.route}
              </span>
            )}
            {distanceInfo && (
              <span className="radaa-pill bg-slate-900/80 text-slate-100">
                {(distanceInfo.distanceMeters / 1000).toFixed(1)} km away · ~
                {Math.round(distanceInfo.etaMinutes)} min
              </span>
            )}
          </div>
        )}
      </header>

      <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs">
        {!tracked && (
          <p className="text-[11px] text-slate-400">
            We could not find live data for this matatu yet. It may be offline or
            not sharing location.
          </p>
        )}

        {tracked && (
          <MapContainer
            matatus={[
              {
                ...tracked,
                isTracked: true,
              } as any,
            ]}
            passengers={passengers}
            userLocation={userLocation}
            displayPositions={displayPositions}
            project={project}
            onCenterOnMe={() => {
              if (typeof window === "undefined" || !navigator.geolocation) {
                setGeoError("Geolocation is not available in this browser.");
                return;
              }

              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  });
                  setGeoError(null);
                },
                () => {
                  // ignore error; main error surface is geoError below
                },
                {
                  enableHighAccuracy: true,
                  timeout: 10000,
                },
              );
            }}
            onSelectMatatu={() => {}}
            isLoading={isLoadingMap}
            hasAnyLocation={hasAnyLocation}
            driverMode={false}
          />
        )}
      </section>

      {geoError && (
        <p className="text-[11px] text-amber-300">{geoError}</p>
      )}
    </div>
  );
}
