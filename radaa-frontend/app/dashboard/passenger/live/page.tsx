"use client";

import { useEffect, useMemo, useState } from "react";
import RideRequestButton from "@/components/RideRequestButton";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useSocket } from "@/hooks/useSocket";
import { useRealtime } from "@/context/realtimeContext";
import { getNearbyMatatus, type NearbyMatatu } from "@/lib/api/passenger";

interface LatLng {
  lat: number;
  lng: number;
}

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

export default function PassengerLiveDashboardPage() {
  const { token } = useAuth();
  const { addNotification } = useNotifications();
  const { on, off, emit } = useSocket();
  const { matatus: realtimeMatatus } = useRealtime();

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [nearby, setNearby] = useState<NearbyMatatu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rideStatus, setRideStatus] = useState<string>("Idle");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("You need to be signed in to view live passenger data.");
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      setLoading(false);
      setError("Geolocation is not available in this browser.");
      return;
    }

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return;

        const loc: LatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        setUserLocation(loc);
        setLoading(true);
        setError(null);

        const run = async () => {
          try {
            const data = await getNearbyMatatus(token);
            if (cancelled) return;
            setNearby(Array.isArray(data) ? data : []);
          } catch (err) {
            if (cancelled) return;
            const message = err instanceof Error ? err.message : "Failed to load nearby matatus";
            setError(message);
          } finally {
            if (!cancelled) {
              setLoading(false);
            }
          }
        };

        void run();
      },
      (geoError) => {
        if (cancelled) return;
        setLoading(false);
        setError(geoError.message || "Unable to determine your current location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      return;
    }

    let watchId: number | null = null;

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const loc: LatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        emit("passenger:update_location", {
          lat: loc.lat,
          lng: loc.lng
        });
      },
      () => {
        // ignore streaming errors; main flow already handles geolocation errors
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000
      }
    );

    return () => {
      if (watchId != null && typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [token, emit]);

  useEffect(() => {
    const handleRideAccepted = (payload: any) => {
      void payload;
      setRideStatus("Accepted");
      addNotification({
        type: "trip",
        title: "Driver on the way",
        message: "Your ride has been accepted."
      });
    };

    const handleRideCancelled = (payload: any) => {
      void payload;
      setRideStatus("Cancelled");
      addNotification({
        type: "trip",
        title: "Ride cancelled",
        message: "Your current ride was cancelled. You can request another."
      });
    };

    on("ride:accepted", handleRideAccepted as any);
    on("ride:cancelled", handleRideCancelled as any);

    return () => {
      off("ride:accepted", handleRideAccepted as any);
      off("ride:cancelled", handleRideCancelled as any);
    };
  }, [on, off, addNotification]);

  const nearestMatatus = useMemo(() => {
    const source = nearby.length > 0 ? nearby : realtimeMatatus;

    if (!userLocation || !Array.isArray(source)) {
      return [] as Array<NearbyMatatu & { distanceMeters: number; etaMinutes: number | null }>;
    }

    const items = source
      .map((m) => {
        const loc = m.location;
        if (!loc || typeof loc.lat !== "number" || typeof loc.lng !== "number") {
          return null;
        }

        const distanceMeters = haversineDistanceMeters(userLocation, {
          lat: loc.lat,
          lng: loc.lng
        });

        const speedKmh = 25;
        const etaMinutes = (distanceMeters / 1000 / speedKmh) * 60;

        return {
          ...m,
          distanceMeters,
          etaMinutes
        };
      })
      .filter(Boolean) as Array<NearbyMatatu & { distanceMeters: number; etaMinutes: number | null }>;

    items.sort((a, b) => a.distanceMeters - b.distanceMeters);

    return items.slice(0, 5);
  }, [nearby, realtimeMatatus, userLocation]);

  const hasMatatus = nearestMatatus.length > 0;

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Passenger live dashboard</h1>
        <p className="text-xs text-slate-300">
          Request a ride, see nearby matatus, and watch live ETA updates as vehicles move.
        </p>
      </header>

      <section className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Request a ride
          </div>
          <p className="text-[11px] text-slate-300">
            We will use your current location to find the closest available matatu.
          </p>
        </div>
        <div className="flex flex-none items-center gap-2">
          <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-300">
            Status: {rideStatus}
          </span>
          <RideRequestButton />
        </div>
      </section>

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          Loading nearby matatus...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && (
        <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Nearest matatus</h2>
              <p className="text-[11px] text-slate-400">
                Based on your current location and live matatu positions.
              </p>
            </div>
          </div>

          {!hasMatatus && (
            <p className="text-[11px] text-slate-400">
              There are no live matatus near you right now. Try again in a few minutes.
            </p>
          )}

          {hasMatatus && (
            <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950/70">
              <table className="min-w-full border-collapse text-[11px]">
                <thead className="bg-slate-900/80 text-slate-300">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Matatu</th>
                    <th className="px-3 py-2 text-left font-medium">Route</th>
                    <th className="px-3 py-2 text-right font-medium">Distance</th>
                    <th className="px-3 py-2 text-right font-medium">ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {nearestMatatus.map((m) => {
                    const id = String(m.id || m._id || "-");
                    const eta = m.etaMinutes != null ? Math.round(m.etaMinutes) : null;
                    const distanceKm = m.distanceMeters / 1000;

                    return (
                      <tr key={id} className="border-t border-slate-800/80">
                        <td className="px-3 py-2 text-slate-100">
                          {m.plate || m.numberPlate || id.slice(0, 6)}
                        </td>
                        <td className="px-3 py-2 text-slate-300">{m.route ?? "—"}</td>
                        <td className="px-3 py-2 text-right text-slate-300">
                          {distanceKm.toFixed(1)} km
                        </td>
                        <td className="px-3 py-2 text-right text-slate-200">
                          {eta !== null ? `${eta} min` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
