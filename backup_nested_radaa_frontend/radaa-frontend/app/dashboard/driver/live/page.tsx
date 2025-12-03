"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useSocket } from "@/hooks/useSocket";
import { useRealtime } from "@/context/realtimeContext";
import {
  acceptRide,
  getNearbyRequests,
  type RideRequest,
} from "@/lib/api/rides";
import { getAssignedPassengers } from "@/lib/api/driver";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";
import MapContainer from "@/components/map/MapContainer";

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

  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return R * c;
}

export default function DriverLiveDashboardPage() {
  const { user, token, loading } = useAuth();
  const { addNotification } = useNotifications();
  const { on, off, emit } = useSocket();
  const { driverOnline, setDriverOnline } = useRealtime();

  const role = (user as any)?.role as string | undefined;
  const isDriver = role === "driver";

  const driverOnboardEnabled = useIsFeatureEnabled("driver_onboard_v1", false);

  const [coords, setCoords] = useState<LatLng | null>(null);
  const [incoming, setIncoming] = useState<RideRequest[]>([]);
  const [assigned, setAssigned] = useState<RideRequest[]>([]);
  const [loadingIncoming, setLoadingIncoming] = useState<boolean>(true);
  const [loadingAssigned, setLoadingAssigned] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !isDriver) {
      setLoadingIncoming(false);
      setLoadingAssigned(false);
      if (!token) {
        setError("You need to be signed in as a driver to view this page.");
      }
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      setLoadingIncoming(false);
      setError("Geolocation is not available in this browser.");
      return;
    }

    let cancelled = false;
    let watchId: number | null = null;

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (cancelled) return;
        const loc: LatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCoords(loc);

        emit("driver:update_location", {
          lat: loc.lat,
          lng: loc.lng,
        });
      },
      (geoError) => {
        if (cancelled) return;
        setLoadingIncoming(false);
        setError(
          geoError.message || "Unable to determine your current location.",
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => {
      cancelled = true;
      if (
        watchId != null &&
        typeof window !== "undefined" &&
        navigator.geolocation
      ) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [token, emit, isDriver]);

  useEffect(() => {
    if (!token || !coords || !isDriver) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoadingIncoming(true);
      setError(null);

      try {
        const data = await getNearbyRequests(
          {
            lat: coords.lat,
            lng: coords.lng,
          },
          token,
        );

        if (cancelled) return;
        setIncoming(Array.isArray(data) ? data : []);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load nearby requests";
        setError(message);
      } finally {
        if (!cancelled) {
          setLoadingIncoming(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [token, coords, isDriver]);

  useEffect(() => {
    if (!token || !isDriver) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoadingAssigned(true);
      try {
        const data = await getAssignedPassengers(token);
        if (cancelled) return;
        setAssigned(Array.isArray(data) ? data : []);
      } catch (err) {
        if (cancelled) return;
      } finally {
        if (!cancelled) {
          setLoadingAssigned(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [token, isDriver]);

  useEffect(() => {
    if (!isDriver) {
      return;
    }

    const handleRideCreated = (payload: any) => {
      if (!payload) return;

      const id = payload?.id || payload?._id;

      setIncoming((current) => {
        const exists = current.some(
          (r) => (r._id as any) === id || (r as any).id === id,
        );
        if (exists) return current;
        const next: RideRequest = {
          ...(payload as RideRequest),
          _id: (payload?._id || id || "") as string,
        };
        return [next, ...current];
      });

      addNotification({
        type: "trip",
        title: "New nearby ride request",
        message: "A passenger near you has requested a ride.",
      });
    };

    const handleRideCancelled = (payload: any) => {
      const id = payload?.id || payload?._id;
      if (!id) return;

      setIncoming((current) =>
        current.filter((r) => (r._id as any) !== id && (r as any).id !== id),
      );
      setAssigned((current) =>
        current.filter((r) => (r._id as any) !== id && (r as any).id !== id),
      );

      addNotification({
        type: "trip",
        title: "Ride cancelled",
        message: "A ride in your area was cancelled.",
      });
    };

    const handlePassengerUpdate = (payload: any) => {
      if (!payload) return;
      const rawId = payload.id ?? payload.rideId;
      if (!rawId) return;
      const id = String(rawId);

      setAssigned((current) => {
        const next = current.map((ride) =>
          (ride._id as any) === id || (ride as any).id === id
            ? ({ ...ride, ...(payload as Partial<RideRequest>) } as RideRequest)
            : ride,
        );
        return next;
      });
    };

    on("ride:created", handleRideCreated as any);
    on("ride:cancelled", handleRideCancelled as any);
    on("passenger:update", handlePassengerUpdate as any);

    return () => {
      off("ride:created", handleRideCreated as any);
      off("ride:cancelled", handleRideCancelled as any);
      off("passenger:update", handlePassengerUpdate as any);
    };
  }, [on, off, addNotification, isDriver]);

  const handleAccept = async (id: string) => {
    if (!token) {
      addNotification({
        type: "system",
        title: "Sign in required",
        message: "You need to be signed in as a driver to accept rides.",
      });
      return;
    }

    try {
      await acceptRide(id, token);
      setIncoming((current) =>
        current.filter((r) => (r._id as any) !== id && (r as any).id !== id),
      );
      addNotification({
        type: "trip",
        title: "Ride accepted",
        message: "The passenger has been notified of your acceptance.",
      });

      const updatedAssigned = await getAssignedPassengers(token);
      setAssigned(Array.isArray(updatedAssigned) ? updatedAssigned : []);
    } catch (error: any) {
      const message =
        error instanceof Error ? error.message : "Failed to accept ride";
      addNotification({
        type: "system",
        title: "Could not accept ride",
        message,
      });
    }
  };

  const hasIncoming = incoming.length > 0;
  const hasAssigned = assigned.length > 0;

  const passengerMarkers = useMemo(
    () =>
      incoming
        .map((ride) => {
          const pickup = (ride as any).pickup;
          if (
            !pickup ||
            !Array.isArray(pickup.coordinates) ||
            pickup.coordinates.length !== 2
          ) {
            return null;
          }

          const [lng, lat] = pickup.coordinates as [number, number];

          if (typeof lat !== "number" || typeof lng !== "number") {
            return null;
          }

          const id = (ride._id as any) || (ride as any).id || `${lat},${lng}`;
          return {
            id: String(id),
            location: { lat, lng },
          };
        })
        .filter(Boolean) as { id: string; location: LatLng }[],
    [incoming],
  );

  const bounds = useMemo(() => {
    const locations: LatLng[] = [];

    if (coords) {
      locations.push(coords);
    }

    passengerMarkers.forEach((p) => {
      if (
        p.location &&
        typeof p.location.lat === "number" &&
        typeof p.location.lng === "number"
      ) {
        locations.push(p.location);
      }
    });

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
  }, [coords, passengerMarkers]);

  const hasAnyLocation = useMemo(() => bounds !== null, [bounds]);

  const project = (location: LatLng | null | undefined) => {
    if (!location || !bounds) {
      return { left: "50%", top: "50%" };
    }

    const latRange = Math.max(bounds.maxLat - bounds.minLat, 0.0001);
    const lngRange = Math.max(bounds.maxLng - bounds.minLng, 0.0001);

    const x = ((location.lng - bounds.minLng) / lngRange) * 100;
    const y = 100 - ((location.lat - bounds.minLat) / latRange) * 100;

    return {
      left: `${Math.min(100, Math.max(0, x))}%`,
      top: `${Math.min(100, Math.max(0, y))}%`,
    };
  };

  const displayPositions: Record<string, LatLng> = {};

  if (loading || !user || !isDriver) {
    return (
      <div className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Driver live dashboard
          </h1>
          <p className="text-xs text-slate-300">
            You must be signed in as a driver to view this dashboard.
          </p>
        </header>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Driver live dashboard
        </h1>
        <p className="text-xs text-slate-300">
          Watch incoming ride requests in real time and manage your currently
          assigned passengers.
        </p>
        {driverOnboardEnabled && (
          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-600/60 bg-emerald-600/10 px-3 py-1 text-[10px] text-emerald-100">
            <span
              className={
                driverOnline
                  ? "h-1.5 w-1.5 rounded-full bg-emerald-400"
                  : "h-1.5 w-1.5 rounded-full bg-slate-500"
              }
            />
            <span>
              {driverOnline
                ? "You're visible to nearby riders"
                : "Go online to start seeing ride requests"}
            </span>
          </div>
        )}
      </header>

      <section className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs">
        <div className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Driver status
          </div>
          <div className="text-[11px] text-slate-300">
            You are currently{" "}
            <span
              className={driverOnline ? "text-emerald-400" : "text-slate-100"}
            >
              {driverOnline ? "Online" : "Offline"}
            </span>
            . When online, nearby passengers can see and request you.
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDriverOnline(!driverOnline)}
          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium transition ${
            driverOnline
              ? "bg-emerald-600/80 text-emerald-50 hover:bg-emerald-500/80"
              : "bg-slate-800 text-slate-100 hover:bg-slate-700"
          }`}
        >
          {driverOnline ? "Go offline" : "Go online"}
        </button>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Nearby passenger map
            </div>
            <p className="text-[11px] text-slate-400">
              Live preview of requests around your current location.
            </p>
          </div>
        </div>
        <MapContainer
          matatus={[]}
          passengers={passengerMarkers}
          userLocation={coords}
          displayPositions={displayPositions}
          project={project}
          onCenterOnMe={() => {
            if (typeof window === "undefined" || !navigator.geolocation) {
              return;
            }

            navigator.geolocation.getCurrentPosition(
              (position) => {
                const loc: LatLng = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                setCoords(loc);
              },
              () => {
                // ignore errors here; main flow already reports geo issues
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
              },
            );
          }}
          onSelectMatatu={() => {}}
          isLoading={loadingIncoming}
          hasAnyLocation={hasAnyLocation}
          driverMode
        />
      </section>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Incoming requests
              </h2>
              <p className="text-[11px] text-slate-400">
                New ride requests near your current location will appear here.
              </p>
            </div>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
              {hasIncoming ? incoming.length : 0}
            </span>
          </div>

          {loadingIncoming && (
            <div className="h-20 animate-pulse rounded-md bg-slate-800/60" />
          )}

          {!loadingIncoming && !hasIncoming && !error && (
            <p className="text-[11px] text-slate-400">
              No nearby ride requests right now. When passengers request rides
              near you, they will appear here.
            </p>
          )}

          {!loadingIncoming && hasIncoming && (
            <div className="overflow-x-auto rounded-md border border-slate-800 bg-slate-950/80">
              <table className="min-w-full border-collapse text-[11px]">
                <thead className="bg-slate-900/80 text-slate-300">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Pickup</th>
                    <th className="px-3 py-2 text-left font-medium">
                      Requested at
                    </th>
                    <th className="px-3 py-2 text-left font-medium">
                      Distance
                    </th>
                    <th className="px-3 py-2 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {incoming.map((ride) => {
                    const id = (ride._id as any) || (ride as any).id || "";
                    const createdAt = ride.createdAt
                      ? new Date(ride.createdAt)
                      : null;

                    const pickup = (ride as any).pickup;
                    let pickupLabel = "—";
                    if (
                      pickup &&
                      Array.isArray(pickup.coordinates) &&
                      pickup.coordinates.length === 2
                    ) {
                      const [lng, lat] = pickup.coordinates as [number, number];
                      pickupLabel = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                    }

                    let distanceLabel = "—";
                    if (
                      coords &&
                      pickup &&
                      Array.isArray(pickup.coordinates) &&
                      pickup.coordinates.length === 2
                    ) {
                      const [lng, lat] = pickup.coordinates as [number, number];
                      const distanceMeters = haversineDistanceMeters(coords, {
                        lat,
                        lng,
                      });
                      if (Number.isFinite(distanceMeters)) {
                        const km = distanceMeters / 1000;
                        const speedKmh = 25;
                        const etaMinutes =
                          (distanceMeters / 1000 / speedKmh) * 60;
                        distanceLabel = `${km.toFixed(1)} km · ~${Math.round(etaMinutes)} min`;
                      }
                    }

                    return (
                      <tr key={id} className="border-t border-slate-800/80">
                        <td className="px-3 py-2 text-slate-100">
                          {pickupLabel}
                        </td>
                        <td className="px-3 py-2 text-slate-300">
                          {createdAt ? createdAt.toLocaleString() : "Just now"}
                        </td>
                        <td className="px-3 py-2 text-slate-300">
                          {distanceLabel}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleAccept(String(id))}
                            className="inline-flex items-center rounded-md border border-emerald-600/60 bg-emerald-600/20 px-2 py-1 text-[11px] font-medium text-emerald-100 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-600/30"
                          >
                            Accept
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Assigned passengers
              </h2>
              <p className="text-[11px] text-slate-400">
                A summary of rides that are currently assigned to you.
              </p>
            </div>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
              {hasAssigned ? assigned.length : 0}
            </span>
          </div>

          {loadingAssigned && (
            <div className="h-20 animate-pulse rounded-md bg-slate-800/60" />
          )}

          {!loadingAssigned && !hasAssigned && (
            <p className="text-[11px] text-slate-400">
              You have no active assigned passengers. Accepted rides will show
              up here.
            </p>
          )}

          {!loadingAssigned && hasAssigned && (
            <div className="space-y-2">
              {assigned.map((ride) => {
                const id = (ride._id as any) || (ride as any).id || "";
                const createdAt = ride.createdAt
                  ? new Date(ride.createdAt)
                  : null;

                return (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/80 px-3 py-2"
                  >
                    <div className="space-y-0.5 text-[11px] text-slate-200">
                      <div className="font-semibold">
                        Ride {String(id).slice(0, 6)}
                      </div>
                      <div className="text-slate-400">
                        Status:{" "}
                        <span className="text-emerald-300">{ride.status}</span>
                      </div>
                      {createdAt && (
                        <div className="text-slate-400">
                          Requested at: {createdAt.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
