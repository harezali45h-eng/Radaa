"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import RideRequestButton from "@/components/RideRequestButton";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useSocket } from "@/hooks/useSocket";
import { useRealtime } from "@/context/realtimeContext";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";
import { getNearbyMatatus, type NearbyMatatu } from "@/lib/api/passenger";
import MatatuSwipeDeck, {
  type SwipeMatatu,
} from "@/components/map/MatatuSwipeDeck";
import {
  createEphemeralRequest,
  pingPassengerLocation,
  type EphemeralRequestSummary,
} from "@/lib/api/requests";
import {
  haversineDistanceMeters,
  type LatLng,
} from "@/lib/location/distance";
import { ActiveRequestWatcher } from "@/components/requests/ActiveRequestWatcher";

export default function PassengerLiveDashboardPage() {
  const { token } = useAuth();
  const { addNotification } = useNotifications();
  const { on, off, emit } = useSocket();
  const { matatus: realtimeMatatus } = useRealtime();

  const driverRequestsEnabled = useIsFeatureEnabled(
    "DRIVER_REQUESTS_V1",
    false,
  );
  const autoCancelEnabled = useIsFeatureEnabled("AUTO_CANCEL_V1", false);
  const uiRevampEnabled = useIsFeatureEnabled("ui_revamp_v1", false);

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [nearby, setNearby] = useState<NearbyMatatu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rideStatus, setRideStatus] = useState<string>("Idle");
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [autoCancelMessage, setAutoCancelMessage] = useState<string | null>(
    null,
  );
  const pingTimerRef = useRef<number | null>(null);

  const getFriendlyGeoError = (geoError: any): string => {
    const code =
      geoError && typeof geoError.code === "number" ? (geoError.code as number) : 0;

    if (code === 1) {
      return "Location access is blocked. Turn on location for Radaa in your browser settings, then refresh this page.";
    }
    if (code === 2) {
      return "We couldn't get a GPS fix. Check that location is turned on and you have a good network signal, then try again.";
    }
    if (code === 3) {
      return "It is taking a bit long to find you. Move closer to a window or check your network, then try again.";
    }

    return (
      geoError?.message ||
      "Unable to determine your current location. Turn on location to see matatus near you."
    );
  };

  const rideStatusChipClass =
    rideStatus === "Accepted" ||
    rideStatus === "Requested" ||
    rideStatus === "Requesting"
      ? "border-emerald-600/60 bg-emerald-600/15 text-emerald-100"
      : rideStatus === "Cancelled" ||
          rideStatus === "Auto-cancelled" ||
          rideStatus === "Auto-cancel warning"
        ? "border-amber-500/60 bg-amber-500/10 text-amber-100"
        : "border-slate-700 bg-slate-900/70 text-slate-300";

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("You need to be signed in to view live passenger data.");
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      setLoading(false);
      setError(
        "Location is not available in this browser. Turn on location or try a different device to see matatus near you.",
      );
      return;
    }

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return;

        const loc: LatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
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
            const message =
              err instanceof Error
                ? err.message
                : "Failed to load nearby matatus";
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
        setError(getFriendlyGeoError(geoError));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token || !driverRequestsEnabled || !autoCancelEnabled) {
      if (pingTimerRef.current != null) {
        window.clearInterval(pingTimerRef.current);
        pingTimerRef.current = null;
      }
      return;
    }

    if (!activeRequestId) {
      if (pingTimerRef.current != null) {
        window.clearInterval(pingTimerRef.current);
        pingTimerRef.current = null;
      }
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      return;
    }

    const intervalId = window.setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          void pingPassengerLocation(
            activeRequestId,
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            token,
          ).catch(() => {
            // errors are logged by the API helper and should not block UI
          });
        },
        () => {
          // ignore streaming errors; main flow already handles geolocation errors
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000,
        },
      );
    }, 5000);

    pingTimerRef.current = intervalId;

    return () => {
      if (pingTimerRef.current != null) {
        window.clearInterval(pingTimerRef.current);
        pingTimerRef.current = null;
      }
    };
  }, [token, driverRequestsEnabled, autoCancelEnabled, activeRequestId]);

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
          lng: position.coords.longitude,
        };

        emit("passenger:update_location", {
          lat: loc.lat,
          lng: loc.lng,
        });
      },
      () => {
        // ignore streaming errors; main flow already handles geolocation errors
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => {
      if (
        watchId != null &&
        typeof window !== "undefined" &&
        navigator.geolocation
      ) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [token, emit]);

  useEffect(() => {
    const handleRideAccepted = (payload: any) => {
      const id = payload?.id || payload?._id;
      if (activeRequestId && id && String(id) !== activeRequestId) {
        return;
      }

      setRideStatus("Accepted");
      setAutoCancelMessage(null);
      addNotification({
        type: "trip",
        title: "Driver on the way",
        message: "Your ride has been accepted.",
      });
    };

    const handleRideCancelled = (payload: any) => {
      const id = payload?.id || payload?._id || payload?.requestId;
      if (activeRequestId && id && String(id) !== activeRequestId) {
        return;
      }

      setRideStatus("Cancelled");
      setActiveRequestId(null);
      setAutoCancelMessage(null);
      addNotification({
        type: "trip",
        title: "Ride cancelled",
        message: "Your current ride was cancelled. You can request another.",
      });
    };

    const handleAutoCancelWarning = (payload: any) => {
      const requestId = payload?.requestId;
      if (
        !requestId ||
        !activeRequestId ||
        String(requestId) !== activeRequestId
      ) {
        return;
      }

      setRideStatus("Auto-cancel warning");
      setAutoCancelMessage(
        "You have moved away from your pickup point. Stay nearby to avoid auto-cancel.",
      );

      addNotification({
        type: "trip",
        title: "Stay near your pickup",
        message:
          "You moved away from your pickup point. The request may auto-cancel soon.",
      });
    };

    const handleAutoCancelled = (payload: any) => {
      const requestId = payload?.requestId;
      if (
        !requestId ||
        !activeRequestId ||
        String(requestId) !== activeRequestId
      ) {
        return;
      }

      setRideStatus("Auto-cancelled");
      setActiveRequestId(null);
      setAutoCancelMessage(
        "Your request was auto-cancelled because you moved too far away.",
      );

      addNotification({
        type: "trip",
        title: "Ride auto-cancelled",
        message:
          "Your ride request was auto-cancelled after moving away from the pickup.",
      });
    };

    on("ride:accepted", handleRideAccepted as any);
    on("ride:cancelled", handleRideCancelled as any);
    on("ride:auto_cancel_warning", handleAutoCancelWarning as any);
    on("ride:auto_cancelled", handleAutoCancelled as any);

    return () => {
      off("ride:accepted", handleRideAccepted as any);
      off("ride:cancelled", handleRideCancelled as any);
      off("ride:auto_cancel_warning", handleAutoCancelWarning as any);
      off("ride:auto_cancelled", handleAutoCancelled as any);
    };
  }, [on, off, addNotification, activeRequestId]);

  const nearestMatatus = useMemo(() => {
    const source = nearby.length > 0 ? nearby : realtimeMatatus;

    if (!userLocation || !Array.isArray(source)) {
      return [] as Array<
        NearbyMatatu & { distanceMeters: number; etaMinutes: number | null }
      >;
    }

    const items = source
      .map((m) => {
        const loc = m.location;
        if (
          !loc ||
          typeof loc.lat !== "number" ||
          typeof loc.lng !== "number"
        ) {
          return null;
        }

        const distanceMeters = haversineDistanceMeters(userLocation, {
          lat: loc.lat,
          lng: loc.lng,
        });

        const speedKmh = 25;
        const etaMinutes = (distanceMeters / 1000 / speedKmh) * 60;

        return {
          ...m,
          distanceMeters,
          etaMinutes,
        };
      })
      .filter(Boolean) as Array<
      NearbyMatatu & { distanceMeters: number; etaMinutes: number | null }
    >;

    items.sort((a, b) => a.distanceMeters - b.distanceMeters);

    return items.slice(0, 5);
  }, [nearby, realtimeMatatus, userLocation]);

  const hasMatatus = nearestMatatus.length > 0;

  const swipeItems: SwipeMatatu[] = useMemo(
    () =>
      nearestMatatus.map((m) => ({
        id: String(m.id || m._id || "-"),
        plate: m.plate,
        numberPlate: m.numberPlate,
        route: m.route,
        sacco: (m as any).sacco,
        mainPhotoUrl: (m as any).mainPhotoUrl ?? null,
        rating: (m as any).rating,
        distanceMeters: m.distanceMeters,
        etaMinutes: m.etaMinutes,
      })),
    [nearestMatatus],
  );

  const handleSmartRequest = () => {
    if (!token) {
      addNotification({
        type: "system",
        title: "Sign in required",
        message: "You need to be signed in to request a ride.",
      });
      return;
    }

    if (!driverRequestsEnabled || !autoCancelEnabled) {
      addNotification({
        type: "system",
        title: "Smart requests disabled",
        message:
          "Smart auto-cancel requests are not enabled on this environment yet.",
      });
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      addNotification({
        type: "system",
        title: "Location unavailable",
        message:
          "Location is not available in this browser. Turn on location for Radaa or try a different device.",
      });
      return;
    }

    setRideStatus("Requesting");
    setAutoCancelMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const pickup = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const summary: EphemeralRequestSummary = await createEphemeralRequest(
            {
              pickup,
              partySize: 1,
              meta: {},
            },
            token,
          );

          setActiveRequestId(summary.id);
          setUserLocation(pickup);
          setRideStatus("Requested");

          addNotification({
            type: "trip",
            title: "Ride requested",
            message: "We are finding a nearby driver for you.",
          });
        } catch (error: any) {
          const message =
            error instanceof Error ? error.message : "Failed to request ride";
          setRideStatus("Idle");
          setActiveRequestId(null);
          setAutoCancelMessage(null);
          addNotification({
            type: "system",
            title: "Ride request failed",
            message,
          });
        }
      },
      (geoError) => {
        const message = getFriendlyGeoError(geoError);
        setRideStatus("Idle");
        setActiveRequestId(null);
        setAutoCancelMessage(null);
        addNotification({
          type: "system",
          title: "Location error",
          message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Passenger live dashboard
        </h1>
        <p className="text-xs text-slate-300">
          Request a ride, see nearby matatus, and watch live ETA updates as
          vehicles move.
        </p>
      </header>

      <section className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Request a ride
          </div>
          <p className="text-[11px] text-slate-300">
            We will use your current location to find the closest available
            matatu.
          </p>
        </div>
        <div className="flex flex-none items-center gap-2">
          <span
            className={`rounded-full px-2 py-1 text-[10px] ${rideStatusChipClass}`}
          >
            Status: {rideStatus}
          </span>
          <RideRequestButton />
          {driverRequestsEnabled && autoCancelEnabled && (
            <button
              type="button"
              onClick={handleSmartRequest}
              className="rounded-md border border-emerald-600/60 bg-emerald-600/15 px-3 py-2 text-[11px] font-medium text-emerald-100 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-600/25"
            >
              Smart request
            </button>
          )}
        </div>
      </section>

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          Loading nearby matatus...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-[11px] text-amber-100">
          <div className="font-semibold">
            Turn on location to see matatus near you
          </div>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {autoCancelMessage && !loading && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-[11px] text-amber-100">
          {autoCancelMessage}
        </div>
      )}

      {!loading && !error && (
        <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Nearest matatus
              </h2>
              <p className="text-[11px] text-slate-400">
                Based on your current location and live matatu positions.
              </p>
            </div>
          </div>

          {uiRevampEnabled && hasMatatus && swipeItems.length > 0 && (
            <MatatuSwipeDeck
              items={swipeItems}
              onSelect={(id) => {
                addNotification({
                  type: "system",
                  title: "Matatu saved",
                  message: "We highlighted this matatu in your nearby list.",
                });
              }}
            />
          )}

          {!hasMatatus && (
            <p className="text-[11px] text-slate-400">
              There are no live matatus near you right now. Try again in a few
              minutes.
            </p>
          )}

          {hasMatatus && (
            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/70">
              <table className="min-w-full border-collapse text-[11px]">
                <thead className="bg-slate-900/80 text-slate-300">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Matatu</th>
                    <th className="px-3 py-2 text-left font-medium">Route</th>
                    <th className="px-3 py-2 text-right font-medium">
                      Distance
                    </th>
                    <th className="px-3 py-2 text-right font-medium">ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {nearestMatatus.map((m) => {
                    const id = String(m.id || m._id || "-");
                    const eta =
                      m.etaMinutes != null ? Math.round(m.etaMinutes) : null;
                    const distanceKm = m.distanceMeters / 1000;

                    return (
                      <tr key={id} className="border-t border-slate-800/80">
                        <td className="px-3 py-2 text-slate-100">
                          {m.plate || m.numberPlate || id.slice(0, 6)}
                        </td>
                        <td className="px-3 py-2 text-slate-300">
                          {m.route ?? "—"}
                        </td>
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

      {autoCancelEnabled && activeRequestId && userLocation && (
        <ActiveRequestWatcher
          requestId={activeRequestId}
          pickupLocation={userLocation}
        />
      )}
    </div>
  );
}
