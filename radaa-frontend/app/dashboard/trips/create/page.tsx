"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5001";

export default function CreateTripPage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [matatuId, setMatatuId] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const tripUiEnabled = useIsFeatureEnabled("trip_ui_v1", false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setUserId(window.localStorage.getItem("radaa_user_id"));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) return;

    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/trips/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          matatuId,
          lat,
          lng
        })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (data && typeof data === "object" && (data.message || data.error)) ||
          "Failed to start trip";
        throw new Error(message);
      }

      setSuccess("Trip started successfully");

      if (data && data._id) {
        router.push(`/dashboard/trips/${data._id}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start trip";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = submitting || !userId;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Start a new trip</h1>
        <p className="text-xs text-slate-300">
          Record a new trip by linking a user to a matatu and initial coordinates. You can stop the
          trip later with the final fare and drop-off location.
        </p>
      </header>

      {tripUiEnabled && (
        <section className="grid gap-2 text-[11px] text-slate-300 md:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
            <div className="text-slate-400">Step 1</div>
            <div className="mt-0.5 font-semibold text-slate-50">Pick a matatu</div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
            <div className="text-slate-400">Step 2</div>
            <div className="mt-0.5 font-semibold text-slate-50">Set start location</div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
            <div className="text-slate-400">Step 3</div>
            <div className="mt-0.5 font-semibold text-slate-50">Start trip</div>
          </div>
        </section>
      )}

      {!userId && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-100">
          No user ID found. Make sure you are logged in via the auth screens before creating trips.
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
        <div className="space-y-1">
          <label htmlFor="matatuId" className="text-xs font-medium text-slate-100">
            Matatu ID
          </label>
          <input
            id="matatuId"
            type="text"
            required
            value={matatuId}
            onChange={(event) => setMatatuId(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="Paste a matatu MongoDB ID"
          />
          <p className="text-[11px] text-slate-500">
            Use the ID from the Matatus list or backend logs while wiring things up.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="lat" className="text-xs font-medium text-slate-100">
              Start latitude
            </label>
            <input
              id="lat"
              type="number"
              step="0.0001"
              required
              value={lat}
              onChange={(event) => setLat(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="-1.2864"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="lng" className="text-xs font-medium text-slate-100">
              Start longitude
            </label>
            <input
              id="lng"
              type="number"
              step="0.0001"
              required
              value={lng}
              onChange={(event) => setLng(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="36.8219"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDisabled
            ? "Starting trip..."
            : tripUiEnabled
              ? "Start trip (beta UI)"
              : "Start trip"}
        </button>
      </form>
    </div>
  );
}
