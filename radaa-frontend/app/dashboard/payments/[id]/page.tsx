"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [userId, setUserId] = useState<string | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setUserId(window.localStorage.getItem("radaa_user_id"));
  }, []);

  useEffect(() => {
    if (!userId || !id) {
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
          throw new Error(text || "Failed to load payments");
        }

        const data = (await response.json()) as Trip[];
        const current = data.find((t) => t._id === id) || null;

        if (!current) {
          throw new Error("Payment (trip) not found for this user");
        }

        setTrip(current);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load payment detail";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [userId, id]);

  const start = trip?.startTime ? new Date(trip.startTime) : null;
  const end = trip?.endTime ? new Date(trip.endTime) : null;

  return (
    <div className="space-y-6">
      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          Loading payment detail...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && trip && (
        <>
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Payment detail</h1>
            <p className="text-xs text-slate-300">
              Trip payment for matatu {trip.matatu?.plate || "Unknown"} on route
              {" "}
              {trip.matatu?.route || "Route not set"}.
            </p>
          </header>

          <section className="grid gap-4 md:grid-cols-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-slate-400">Fare</div>
              <div className="mt-1 text-lg font-semibold text-slate-100">
                {trip.fare != null ? `${trip.fare} ${trip.currency || "KES"}` : "—"}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-slate-400">Status</div>
              <div className="mt-1 text-sm font-semibold text-slate-100 capitalize">
                {trip.status}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-slate-400">Matatu</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">
                {trip.matatu?.plate || "Unknown"}
              </div>
              <div className="text-[11px] text-slate-400">{trip.matatu?.route || "Route not set"}</div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-slate-400">Start time</div>
              <div className="mt-1 text-slate-100">{start ? start.toLocaleString() : "—"}</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-slate-400">End time</div>
              <div className="mt-1 text-slate-100">{end ? end.toLocaleString() : "—"}</div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
            <p>
              Detailed payment records (e.g. gateway reference IDs) are handled server-side via the
              RidePayment model and payment gateway integrations. This screen focuses on the
              user-facing payment outcome based on trip data.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
