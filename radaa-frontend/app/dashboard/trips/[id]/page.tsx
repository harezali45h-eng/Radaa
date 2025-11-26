"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useNotifications } from "@/context/NotificationContext";

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

export default function TripDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { addNotification } = useNotifications();

  const [userId, setUserId] = useState<string | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [fare, setFare] = useState<string>("");
  const [currency, setCurrency] = useState<string>("KES");
  const [stopping, setStopping] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

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
          throw new Error(text || "Failed to load trip");
        }

        const data = (await response.json()) as Trip[];
        const current = data.find((t) => t._id === id) || null;

        if (!current) {
          throw new Error("Trip not found for this user");
        }

        setTrip(current);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load trip";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [userId, id]);

  const handleStopTrip = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    setStopping(true);
    setMessage(null);

    try {
      const response = await fetch(`${BACKEND_URL}/trips/${id}/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ lat, lng, fare, currency })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (data && typeof data === "object" && (data.message || data.error)) ||
          "Failed to stop trip";
        throw new Error(message);
      }

      const updatedTrip = data as Trip;
      setTrip(updatedTrip);
      setMessage("Trip stopped and fare recorded successfully");

      addNotification({
        type: "trip",
        title: "Trip completed",
        message:
          (updatedTrip.matatu?.plate || "Trip") +
          (updatedTrip.fare != null ? ` completed with fare ${updatedTrip.fare}` : " completed.")
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to stop trip";
      setMessage(message);
    } finally {
      setStopping(false);
    }
  };

  const start = trip?.startTime ? new Date(trip.startTime) : null;
  const end = trip?.endTime ? new Date(trip.endTime) : null;

  return (
    <div className="space-y-6">
      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          Loading trip details...
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
            <h1 className="text-2xl font-semibold tracking-tight">Trip details</h1>
            <p className="text-xs text-slate-300">
              Matatu {trip.matatu?.plate || "Unknown"} · {trip.matatu?.route || "Route not set"}
            </p>
          </header>

          <section className="grid gap-4 md:grid-cols-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-slate-400">Status</div>
              <div className="mt-1 text-slate-100 capitalize">{trip.status}</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-slate-400">Start time</div>
              <div className="mt-1 text-slate-100">{start ? start.toLocaleString() : "—"}</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-slate-400">End time</div>
              <div className="mt-1 text-slate-100">{end ? end.toLocaleString() : "—"}</div>
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">Fare and completion</h2>
                <p className="text-[11px] text-slate-400">
                  If this trip is still ongoing, you can stop it and record the fare amount.
                </p>
              </div>
            </div>

            {message && (
              <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-200">
                {message}
              </div>
            )}

            {trip.status === "ongoing" ? (
              <form
                onSubmit={handleStopTrip}
                className="grid gap-3 md:grid-cols-[repeat(4,minmax(0,1fr)),auto]"
              >
                <div className="space-y-1">
                  <label htmlFor="lat" className="text-[11px] font-medium text-slate-100">
                    End latitude
                  </label>
                  <input
                    id="lat"
                    type="number"
                    step="0.0001"
                    required
                    value={lat}
                    onChange={(event) => setLat(event.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="-1.2864"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="lng" className="text-[11px] font-medium text-slate-100">
                    End longitude
                  </label>
                  <input
                    id="lng"
                    type="number"
                    step="0.0001"
                    required
                    value={lng}
                    onChange={(event) => setLng(event.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="36.8219"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="fare" className="text-[11px] font-medium text-slate-100">
                    Fare amount
                  </label>
                  <input
                    id="fare"
                    type="number"
                    step="1"
                    min="0"
                    required
                    value={fare}
                    onChange={(event) => setFare(event.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="80"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="currency" className="text-[11px] font-medium text-slate-100">
                    Currency
                  </label>
                  <input
                    id="currency"
                    type="text"
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={stopping}
                    className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-[11px] font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {stopping ? "Stopping trip..." : "Stop trip"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-[11px] text-slate-300">
                This trip has already been completed. Fare: {trip.fare != null ? `${trip.fare} ` : ""}
                {trip.currency || (trip.fare != null ? "KES" : "") || "—"}.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
