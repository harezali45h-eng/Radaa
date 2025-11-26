"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLoyaltyStatus } from "@/lib/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface LoyaltyStatus {
  userId: string;
  balance: number;
  ridesTaken: number;
  ridesPaid: number;
  loyaltyPoints: number;
  loyalty: {
    paidRidesCount: number;
    freeRides: number;
  };
}

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

export default function PaymentsListPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loyalty, setLoyalty] = useState<LoyaltyStatus | null>(null);
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
        const [loyaltyData, tripsRes] = await Promise.all([
          getLoyaltyStatus(userId),
          fetch(`${BACKEND_URL}/trips/user/${userId}`)
        ]);

        setLoyalty(loyaltyData as LoyaltyStatus);

        if (!tripsRes.ok) {
          const text = await tripsRes.text();
          throw new Error(text || "Failed to load trips");
        }

        const tripData = (await tripsRes.json()) as Trip[];
        setTrips(tripData);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load payment data";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [userId]);

  const completedTrips = trips.filter((t) => t.status === "completed" && t.fare != null);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="text-xs text-slate-300">
          View a ledger of completed trips and the fares that were charged. Loyalty and balance
          data comes directly from the backend.
        </p>
      </header>

      {!userId && !loading && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-100">
          No user ID found. Make sure you are logged in via the auth screens before viewing
          payments.
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          Loading payments data...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200">
          {error}
        </div>
      )}

      {loyalty && !loading && !error && (
        <section className="grid gap-4 md:grid-cols-4 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-slate-400">Balance</div>
            <div className="mt-1 text-lg font-semibold text-emerald-400">
              KES {loyalty.balance ?? 0}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-slate-400">Rides paid</div>
            <div className="mt-1 text-lg font-semibold text-slate-100">
              {loyalty.ridesPaid ?? 0}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-slate-400">Loyalty points</div>
            <div className="mt-1 text-lg font-semibold text-slate-100">
              {loyalty.loyaltyPoints ?? 0}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-slate-400">Free rides</div>
            <div className="mt-1 text-lg font-semibold text-amber-300">
              {loyalty.loyalty?.freeRides ?? 0}
            </div>
          </div>
        </section>
      )}

      {!loading && !error && completedTrips.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">Completed payments</h2>
            <p className="text-[11px] text-slate-400">
              Each row represents a completed trip with a fare recorded on the backend.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
            <table className="min-w-full border-collapse text-xs">
              <thead className="bg-slate-900/80 text-slate-300">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Matatu</th>
                  <th className="px-3 py-2 text-left font-medium">Route</th>
                  <th className="px-3 py-2 text-left font-medium">Start</th>
                  <th className="px-3 py-2 text-left font-medium">End</th>
                  <th className="px-3 py-2 text-left font-medium">Fare</th>
                  <th className="px-3 py-2 text-right font-medium">Detail</th>
                </tr>
              </thead>
              <tbody>
                {completedTrips.map((trip) => {
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
                      <td className="px-3 py-2 text-right">
                        <Link
                          href={`/dashboard/payments/${trip._id}`}
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
        </section>
      )}

      {!loading && !error && completedTrips.length === 0 && userId && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          No completed trips with fares recorded yet. Once you stop trips with a fare, they will
          appear here as payments.
        </div>
      )}
    </div>
  );
}
