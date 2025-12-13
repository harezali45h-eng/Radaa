"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useSocket } from "@/hooks/useSocket";
import { useDriverRealtime } from "@/hooks/useDriverRealtime";
import {
  acceptRide,
  getNearbyRequests,
  type RideRequest,
} from "@/lib/api/rides";
import { getAssignedPassengers } from "@/lib/api/driver";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";
import MapWrapper from "@/components/MapWrapper";
import DriverRequestCard from "@/components/DriverRequestCard";

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
  const {
    driverOnline,
    currentRequest,
    timeLeftSeconds,
    goOnline,
    goOffline,
    acceptCurrentRequest,
    rejectCurrentRequest,
  } = useDriverRealtime();

  const role = (user as any)?.role as string | undefined;
  const isDriver = role === "driver";
  const driverStatus = (user as any)?.driverStatus as
    | "provisional"
    | "active"
    | "suspended"
    | string
    | undefined;

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
        const message =
          geoError.message || "Unable to determine your current location.";
        setError(message);
        if (typeof console !== "undefined") {
          console.error("[driver-live] geolocation error", geoError);
        }
        addNotification({
          type: "system",
          title: "Location error",
          message,
        });
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
        if (typeof console !== "undefined") {
          console.error("[driver-live] getNearbyRequests error", err);
        }
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
        if (typeof console !== "undefined") {
          console.error("[driver-live] getAssignedPassengers error", err);
        }
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
      try {
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
      } catch (err) {
        if (typeof console !== "undefined") {
          console.error("[driver-live] ride:created handler error", err);
        }
      }
    };

    const handleRideCancelled = (payload: any) => {
      try {
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
      } catch (err) {
        if (typeof console !== "undefined") {
          console.error("[driver-live] ride:cancelled handler error", err);
        }
      }
    };

    const handlePassengerUpdate = (payload: any) => {
      try {
        if (!payload) return;
        const rawId = payload.id ?? payload.rideId;
        if (!rawId) return;
        const id = String(rawId);

        setAssigned((current) => {
          const next = current.map((ride) =>
            (ride._id as any) === id || (ride as any).id === id
              ? ({
                  ...ride,
                  ...(payload as Partial<RideRequest>),
                } as RideRequest)
              : ride,
          );
          return next;
        });
      } catch (err) {
        if (typeof console !== "undefined") {
          console.error("[driver-live] passenger:update handler error", err);
        }
      }
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

  const routeDemand = useMemo(
    () => {
      if (!hasIncoming) {
        return [] as Array<{ id: string; label: string; riderCount: number }>;
      }

      const buckets = new Map<string, { id: string; label: string; riderCount: number }>();

      incoming.forEach((ride) => {
        const anyRide = ride as any;
        const pickup = anyRide.pickup || anyRide.pickupLocation || anyRide.location || null;

        let routeId = "sim-route-default";
        let label = "Sample corridor (simulated)";

        if (pickup && Array.isArray(pickup.coordinates) && pickup.coordinates.length === 2) {
          const [lng, lat] = pickup.coordinates as [number, number];

          if (typeof lat === "number" && typeof lng === "number") {
            const hash = Math.abs(Math.round(lat * 100) + Math.round(lng * 100));
            const idx = (hash % 3) + 1;
            routeId = `sim-route-${idx}`;
            label = `Simulated route ${idx}`;
          }
        }

        const existing = buckets.get(routeId) || {
          id: routeId,
          label,
          riderCount: 0,
        };

        existing.riderCount += 1;
        buckets.set(routeId, existing);
      });

      return Array.from(buckets.values()).sort((a, b) => b.riderCount - a.riderCount);
    },
    [incoming, hasIncoming],
  );

  const passengerMarkers = useMemo(
    () =>
      incoming
        .map((ride) => {
          const rideAny = ride as any;
          const pickup =
            rideAny.pickup ||
            rideAny.pickupLocation ||
            rideAny.location ||
            null;
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
      <div className="space-y-4 text-xs">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Driver live dashboard
          </h1>
          <p className="text-slate-300">
            You must be signed in as a driver to view this dashboard.
          </p>
        </header>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Driver live dashboard
        </h1>
        <p className="text-slate-300">
          Watch incoming ride requests in real time and manage your currently
          assigned passengers.
        </p>
        {driverOnboardEnabled && (
          <p className="text-[11px] text-emerald-200">
            New driver experience is enabled for your account.
          </p>
        )}
        {driverStatus === "provisional" && (
          <p className="text-[11px] text-amber-200">
            You are live while we verify your details. Mpesa payouts and paid
            features unlock after SACCO/admin approval.
          </p>
        )}
        {driverStatus === "suspended" && (
          <p className="text-[11px] text-red-300">
            Your driver account is currently suspended. Contact your SACCO or
            support for assistance.
          </p>
        )}
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-[11px] text-slate-400">
            <span
              className={
                driverOnline
                  ? "h-1.5 w-1.5 rounded-full bg-emerald-400"
                  : "h-1.5 w-1.5 rounded-full bg-slate-500"
              }
            />
            <span>
              {driverOnline
                ? "You are online and visible to nearby riders"
                : "You are offline. Go online to start seeing ride requests."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => (driverOnline ? goOffline() : goOnline())}
            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium transition ${
              driverOnline
                ? "bg-emerald-600/80 text-emerald-50 hover:bg-emerald-500/80"
                : "bg-slate-800 text-slate-100 hover:bg-slate-700"
            }`}
          >
            {driverOnline ? "Go offline" : "Go online"}
          </button>
        </div>
      </header>

      {currentRequest && (
        <section className="border-t border-emerald-700/60 pt-3">
          <DriverRequestCard
            request={currentRequest}
            timeLeftSeconds={timeLeftSeconds}
            onAccept={acceptCurrentRequest}
            onReject={rejectCurrentRequest}
          />
        </section>
      )}

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
        <MapWrapper
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
          showCenterOnMe
        />
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Route-based rider demand (simulated)
            </div>
            <p className="text-[11px] text-slate-400">
              Riders are grouped into sample routes based on pickup location. Counts are simulated
              for this MVP.
            </p>
          </div>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
            {routeDemand.reduce((sum, r) => sum + r.riderCount, 0)} riders total
          </span>
        </div>

        {routeDemand.length === 0 && (
          <p className="text-[11px] text-slate-400">
            No riders waiting on the sampled routes right now.
          </p>
        )}

        {routeDemand.length > 0 && (
          <ul className="divide-y divide-slate-800/80">
            {routeDemand.map((route) => (
              <li key={route.id} className="flex items-center justify-between gap-3 py-2">
                <div className="space-y-0.5 text-[11px]">
                  <div className="font-semibold text-slate-100">{route.label}</div>
                  <div className="text-[10px] text-slate-500">Route ID: {route.id}</div>
                </div>
                <div className="text-right text-[11px] font-medium text-slate-100">
                  {route.riderCount} riders waiting on this route
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-2 text-[10px] text-slate-500">
          This view is powered by an in-memory grouping of nearby requests and is clearly marked as
          simulated while full route analytics are still under construction.
        </p>
      </section>

      {error && (
        <p className="text-[11px] text-red-300">{error}</p>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 border-t border-slate-800/80 pt-3">
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
            <div className="space-y-2">
              <div className="h-6 w-full animate-pulse rounded-full bg-slate-800/70" />
              <div className="h-6 w-full animate-pulse rounded-full bg-slate-800/70" />
            </div>
          )}

          {!loadingIncoming && !hasIncoming && !error && (
            <p className="text-[11px] text-slate-400">
              No nearby ride requests right now. When passengers request rides
              near you, they will appear here.
            </p>
          )}

          {!loadingIncoming && hasIncoming && (
            <div className="divide-y divide-slate-800/80">
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
                    distanceLabel = `${km.toFixed(1)} km · ~${Math.round(
                      etaMinutes,
                    )} min`;
                  }
                }

                return (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-3 py-2"
                  >
                    <div className="space-y-0.5 text-[11px]">
                      <div className="font-medium text-slate-100">
                        {pickupLabel}
                      </div>
                      <div className="text-slate-400">
                        {createdAt
                          ? createdAt.toLocaleString()
                          : "Just now"}
                        {distanceLabel !== "—" && (
                          <span className="text-slate-500">
                            {" "}· {distanceLabel}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAccept(String(id))}
                      className="inline-flex items-center rounded-md border border-emerald-600/60 bg-emerald-600/20 px-2 py-1 text-[11px] font-medium text-emerald-100 transition hover:border-emerald-400 hover:bg-emerald-600/30"
                    >
                      Accept
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-3 border-t border-slate-800/80 pt-3">
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
            <div className="space-y-2">
              <div className="h-6 w-full animate-pulse rounded-full bg-slate-800/70" />
              <div className="h-6 w-full animate-pulse rounded-full bg-slate-800/70" />
            </div>
          )}

          {!loadingAssigned && !hasAssigned && (
            <p className="text-[11px] text-slate-400">
              You have no active assigned passengers. Accepted rides will show
              up here.
            </p>
          )}

          {!loadingAssigned && hasAssigned && (
            <div className="divide-y divide-slate-800/80">
              {assigned.map((ride) => {
                const id = (ride._id as any) || (ride as any).id || "";
                const createdAt = ride.createdAt
                  ? new Date(ride.createdAt)
                  : null;

                return (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-3 py-2"
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
