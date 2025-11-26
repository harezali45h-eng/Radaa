"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface TripMatatu {
  _id?: string;
  plate?: string;
  route?: string;
}

interface Trip {
  _id: string;
  status: string;
  startTime?: string;
  endTime?: string;
  fare?: number;
  currency?: string;
  matatu?: TripMatatu;
}

export default function TripListPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setUserId(window.localStorage.getItem("radaa_user_id"));
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BACKEND_URL}/trips/user/${userId}`);

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Failed to load trips");
        }

        const data = (await response.json()) as Trip[];
        setTrips(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load trips";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [userId]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trips</h1>
          <p className="text-xs text-slate-300">
            Browse your trip history. Each completed trip is tied to a fare payment and loyalty
            update.
          </p>
        </div>
        <Link
          href="/dashboard/trips/create"
          className="inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500"
        >
          Start new trip
        </Link>
      </header>

      {!userId && !loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          No user ID found. Make sure you are logged in via the auth screens before viewing trips.
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          Loading trips...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && trips.length === 0 && userId && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          No trips found yet. Start a new trip to see it appear here.
        </div>
      )}

      {!loading && !error && trips.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Matatu</th>
                <th className="px-3 py-2 text-left font-medium">Route</th>
                <th className="px-3 py-2 text-left font-medium">Start</th>
                <th className="px-3 py-2 text-left font-medium">End</th>
                <th className="px-3 py-2 text-left font-medium">Fare</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => {
                const start = trip.startTime ? new Date(trip.startTime) : null;
                const end = trip.endTime ? new Date(trip.endTime) : null;

                return (
                  <tr key={trip._id} className="border-t border-slate-800/80">
                    <td className="px-3 py-2 text-slate-100">
                      {trip.matatu?.plate || "Unknown"}
                    </td>
                    <td className="px-3 py-2 text-slate-300">{trip.matatu?.route || "—"}</td>
                    <td className="px-3 py-2 text-slate-300">
                      {start ? start.toLocaleString() : "—"}
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {end ? end.toLocaleString() : "—"}
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {trip.fare != null ? `${trip.fare} ${trip.currency || "KES"}` : "—"}
                    </td>
                    <td className="px-3 py-2 text-slate-300 capitalize">{trip.status}</td>
                    <td className="px-3 py-2 text-right">
                      <Link
                        href={`/dashboard/trips/${trip._id}`}
                        className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 hover:border-sky-500/70 hover:text-sky-200"
                      >
                        View
                      </Link>
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
