"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Trip } from "@/lib/api/trips";
import { getTripHistory } from "@/lib/api/trips";

export default function TripListPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = user?._id;
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTripHistory(userId);
        if (!cancelled) {
          setTrips(Array.isArray(data) ? data : []);
        }
      } catch (err: any) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load trips";
          setError(message);
        }
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
  }, [user]);

  const formatLatLng = (coords?: number[]): string => {
    if (!coords || coords.length !== 2) return "—";
    const [lng, lat] = coords;
    if (typeof lat !== "number" || typeof lng !== "number") return "—";
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  const formatDate = (value?: string): string => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  };

  return (
    <div className="space-y-6 text-xs">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">My Trips</h1>
        <p className="max-w-md text-slate-300">
          A history of trips you have taken with Radaa. Each row shows your
          pickup and drop-off, when the trip happened, and how much you paid.
        </p>
      </header>

      {!user && (
        <p className="text-slate-300">
          Sign in to view your trip history and receipts.
        </p>
      )}

      {user && loading && (
        <div className="space-y-3">
          <div className="h-3 w-32 animate-pulse rounded-full bg-slate-800/70" />
          <div className="h-9 w-full animate-pulse rounded-full bg-slate-800/70" />
          <div className="h-9 w-full animate-pulse rounded-full bg-slate-800/70" />
          <div className="h-9 w-full animate-pulse rounded-full bg-slate-800/70" />
        </div>
      )}

      {user && !loading && error && (
        <p className="text-sm text-red-300">{error}</p>
      )}

      {user && !loading && !error && trips.length === 0 && (
        <p className="text-slate-300">
          You have not taken any trips with Radaa yet. Once you complete rides,
          they&apos;ll show up here automatically.
        </p>
      )}

      {user && !loading && !error && trips.length > 0 && (
        <section className="divide-y divide-slate-800/80 rounded-none border-y border-slate-800/80">
          {trips.map((trip) => {
            const pickupCoords = trip.startLocation?.coordinates;
            const dropCoords = trip.endLocation?.coordinates;
            const pickupLabel = formatLatLng(pickupCoords);
            const dropLabel = formatLatLng(dropCoords);
            const routeLabel = trip.matatu?.route || "Route";
            const dateLabel = formatDate(trip.startTime || trip.endTime);
            const fare = trip.fare;
            const currency = trip.currency || "KES";

            return (
              <div
                key={trip._id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-300">
                    <span className="font-medium text-slate-100">
                      {pickupLabel}
                    </span>
                    <span className="text-slate-500">→</span>
                    <span className="font-medium text-slate-100">
                      {dropLabel}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 text-[10px] text-slate-400">
                    <span>{routeLabel}</span>
                    {trip.status && (
                      <span className="mx-1 h-1 w-1 rounded-full bg-slate-600" />
                    )}
                    {trip.status && (
                      <span className="uppercase tracking-wide text-slate-500">
                        {trip.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-0.5 text-right text-[11px]">
                  {fare != null && (
                    <span className="font-semibold text-slate-50">
                      {currency} {fare.toLocaleString()}
                    </span>
                  )}
                  {dateLabel && (
                    <span className="text-[10px] text-slate-500">{dateLabel}</span>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
