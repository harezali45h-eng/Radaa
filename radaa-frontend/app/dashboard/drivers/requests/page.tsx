"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useSocket } from "@/hooks/useSocket";
import { acceptRide, getNearbyRequests, type RideRequest } from "@/lib/api/rides";

interface NearbyRide extends RideRequest {
  id?: string;
}

export default function DriverRequestsPage() {
  const { token } = useAuth();
  const { addNotification } = useNotifications();
  const { on, off } = useSocket();

  const [locationReady, setLocationReady] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [requests, setRequests] = useState<NearbyRide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("You need to be signed in as a driver to view nearby ride requests.");
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      setLoading(false);
      setError("Geolocation is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationReady(true);
      },
      (geoError) => {
        setLoading(false);
        setError(geoError.message || "Unable to determine your current location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  }, [token]);

  useEffect(() => {
    if (!token || !locationReady || !coords) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getNearbyRequests(
          {
            lat: coords.lat,
            lng: coords.lng
          },
          token
        );

        if (cancelled) return;

        setRequests(data || []);
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load ride requests";
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [token, locationReady, coords]);

  useEffect(() => {
    const handleRideCreated = (payload: any) => {
      const id = payload?.id || payload?._id;
      const pickup = payload?.pickup;

      setRequests((current) => {
        const exists = current.some((r) => (r._id || r.id) === id);
        if (exists) return current;

        const next: NearbyRide = {
          ...(payload as NearbyRide),
          _id: payload?._id || id
        };

        return [next, ...current];
      });

      addNotification({
        type: "trip",
        title: "New nearby ride request",
        message: pickup
          ? "A rider near your area has requested a pickup."
          : "A new ride request is available."
      });
    };

    on("ride:created", handleRideCreated as any);

    return () => {
      off("ride:created", handleRideCreated as any);
    };
  }, [on, off, addNotification]);

  const handleAccept = async (id: string) => {
    if (!token) {
      addNotification({
        type: "system",
        title: "Sign in required",
        message: "You need to be signed in as a driver to accept rides."
      });
      return;
    }

    try {
      await acceptRide(id, token);
      setRequests((current) => current.filter((r) => (r._id || r.id) !== id));
      addNotification({
        type: "trip",
        title: "Ride accepted",
        message: "The rider has been notified of your acceptance."
      });
    } catch (error: any) {
      const message = error instanceof Error ? error.message : "Failed to accept ride";
      addNotification({
        type: "system",
        title: "Could not accept ride",
        message
      });
    }
  };

  const hasRequests = requests.length > 0;

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Nearby ride requests</h1>
        <p className="text-xs text-slate-300">
          See ride requests near your current location and accept them in real time.
        </p>
      </header>

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          Loading nearby requests...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && !hasRequests && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          No nearby ride requests right now. When passengers request rides near you, they will
          appear here.
        </div>
      )}

      {!loading && !error && hasRequests && (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Pickup</th>
                <th className="px-3 py-2 text-left font-medium">Requested at</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((ride) => {
                const id = ride._id || ride.id || "";
                const createdAt = ride.createdAt ? new Date(ride.createdAt) : null;

                const pickup = (ride as any).pickup;
                let pickupLabel = "—";
                if (pickup && Array.isArray(pickup.coordinates) && pickup.coordinates.length === 2) {
                  const [lng, lat] = pickup.coordinates as [number, number];
                  pickupLabel = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                }

                return (
                  <tr key={id} className="border-t border-slate-800/80">
                    <td className="px-3 py-2 text-slate-100">{pickupLabel}</td>
                    <td className="px-3 py-2 text-slate-300">
                      {createdAt ? createdAt.toLocaleString() : "Just now"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleAccept(id)}
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
  );
}
