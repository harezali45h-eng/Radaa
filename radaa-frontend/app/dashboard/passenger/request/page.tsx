"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useSocket } from "@/hooks/useSocket";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";
import {
  createEphemeralRequest,
  type EphemeralRequestSummary,
} from "@/lib/api/requests";
import { type LatLng } from "@/lib/location/distance";
import { ActiveRequestWatcher } from "@/components/requests/ActiveRequestWatcher";

export default function PassengerRequestPage() {
  const { token } = useAuth();
  const { addNotification } = useNotifications();
  const { on, off } = useSocket();

  const driverRequestsEnabled = useIsFeatureEnabled("DRIVER_REQUESTS_V1", false);
  const autoCancelEnabled = useIsFeatureEnabled("AUTO_CANCEL_V1", false);

  const [pickup, setPickup] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<string>("Idle");
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [note, setNote] = useState<string>("");
  const [partySize, setPartySize] = useState<string>("1");
  useEffect(() => {
    if (!activeRequestId) return;

    const handleAccepted = (payload: any) => {
      try {
        const id = payload?.id || payload?._id || payload?.requestId;
        if (!id || String(id) !== activeRequestId) return;
        setStatus("Accepted");
        setActiveRequestId(null);
        addNotification({
          type: "trip",
          title: "Driver on the way",
          message: "Your ride has been accepted.",
        });
      } catch (err) {
        if (typeof console !== "undefined") {
          console.error("[passenger-request] ride:accepted handler error", err);
        }
      }
    };

    const handleCancelled = (payload: any) => {
      try {
        const id = payload?.id || payload?._id || payload?.requestId;
        if (!id || String(id) !== activeRequestId) return;
        setStatus("Cancelled");
        setActiveRequestId(null);
        addNotification({
          type: "trip",
          title: "Ride cancelled",
          message: "Your current ride was cancelled. You can request another.",
        });
      } catch (err) {
        if (typeof console !== "undefined") {
          console.error("[passenger-request] ride:cancelled handler error", err);
        }
      }
    };

    on("ride:accepted", handleAccepted as any);
    on("ride:cancelled", handleCancelled as any);

    return () => {
      off("ride:accepted", handleAccepted as any);
      off("ride:cancelled", handleCancelled as any);
    };
  }, [activeRequestId, on, off, addNotification]);

  const handleRequest = () => {
    if (!token) {
      addNotification({
        type: "system",
        title: "Sign in required",
        message: "You need to be signed in to request a ride.",
      });
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      addNotification({
        type: "system",
        title: "Location unavailable",
        message: "Geolocation is not available in this browser.",
      });
      return;
    }

    if (!driverRequestsEnabled) {
      addNotification({
        type: "system",
        title: "Requests disabled",
        message:
          "This environment is not configured with the driver requests feature.",
      });
      return;
    }

    setSubmitting(true);
    setStatus("Requesting");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const loc: LatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setPickup(loc);

        try {
          const summary: EphemeralRequestSummary = await createEphemeralRequest(
            {
              pickup: loc,
              partySize: Number(partySize) || 1,
              meta: note ? { note } : undefined,
            },
            token,
          );

          setActiveRequestId(summary.id);
          setStatus("Requested");
          setError(null);

          addNotification({
            type: "trip",
            title: "Ride requested",
            message: "We are finding a nearby driver for you.",
          });
        } catch (err: any) {
          const message =
            err instanceof Error ? err.message : "Failed to request ride";
          setStatus("Idle");
          setActiveRequestId(null);
          setError(message);
          addNotification({
            type: "system",
            title: "Ride request failed",
            message,
          });
          if (typeof console !== "undefined") {
            console.error("[passenger-request] createEphemeralRequest error", err);
          }
        } finally {
          setSubmitting(false);
        }
      },
      (geoError) => {
        const message =
          geoError?.message || "Unable to determine your current location.";
        setStatus("Idle");
        setActiveRequestId(null);
        setError(message);
        setSubmitting(false);
        addNotification({
          type: "system",
          title: "Location error",
          message,
        });
        if (typeof console !== "undefined") {
          console.error("[passenger-request] geolocation error", geoError);
        }
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
          Passenger ride request
        </h1>
        <p className="text-xs text-slate-300">
          Use your current GPS position to request a ride from the nearest
          available matatu.
        </p>
      </header>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Request details
            </div>
            <p className="text-[11px] text-slate-300">
              We will only use your live location when you press request.
            </p>
          </div>
          <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-300">
            Status: {status}
          </span>
        </div>

        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-[1fr,1fr]">
          <label className="space-y-1 text-[11px] text-slate-200">
            <span>Party size</span>
            <input
              type="number"
              min={1}
              max={6}
              value={partySize}
              onChange={(event) => setPartySize(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </label>

          <label className="space-y-1 text-[11px] text-slate-200">
            <span>Note to driver (optional)</span>
            <input
              type="text"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="e.g. I'm near the supermarket gate"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </label>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-slate-400">
            {pickup
              ? `Last pickup: ${pickup.lat.toFixed(4)}, ${pickup.lng.toFixed(4)}`
              : "Pickup will use your current GPS location."}
          </div>
          <button
            type="button"
            onClick={handleRequest}
            disabled={submitting}
            className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-emerald-950 shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Requesting..." : "Request ride"}
          </button>
        </div>
      </section>

      {autoCancelEnabled && activeRequestId && pickup && (
        <ActiveRequestWatcher requestId={activeRequestId} pickupLocation={pickup} />
      )}
    </div>
  );
}
