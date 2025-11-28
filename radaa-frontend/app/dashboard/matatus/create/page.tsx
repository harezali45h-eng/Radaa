"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5001";

export default function CreateMatatuPage() {
  const router = useRouter();

  const [plate, setPlate] = useState("");
  const [route, setRoute] = useState("");
  const [sacco, setSacco] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/matatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          plate,
          route,
          sacco: sacco || undefined,
          driverName: driverName || undefined,
          driverPhone: driverPhone || undefined
        })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (data && typeof data === "object" && (data.message || data.error)) ||
          "Failed to register matatu";
        throw new Error(message);
      }

      setSuccess("Matatu registered successfully");

      if (data && data._id) {
        router.push(`/dashboard/matatus/${data._id}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to register matatu";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = submitting;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Register matatu</h1>
        <p className="text-xs text-slate-300">
          Create a new matatu record that can later be tracked live on the map and in trip logs.
        </p>
      </header>

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
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="plate" className="text-xs font-medium text-slate-100">
              Number plate
            </label>
            <input
              id="plate"
              type="text"
              required
              value={plate}
              onChange={(event) => setPlate(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="KAA 123A"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="route" className="text-xs font-medium text-slate-100">
              Route
            </label>
            <input
              id="route"
              type="text"
              required
              value={route}
              onChange={(event) => setRoute(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="CBD - Rongai"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="sacco" className="text-xs font-medium text-slate-100">
              Sacco <span className="text-[10px] font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="sacco"
              type="text"
              value={sacco}
              onChange={(event) => setSacco(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="Super Metro"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="driverName" className="text-xs font-medium text-slate-100">
              Driver name <span className="text-[10px] font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="driverName"
              type="text"
              value={driverName}
              onChange={(event) => setDriverName(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label htmlFor="driverPhone" className="text-xs font-medium text-slate-100">
              Driver phone <span className="text-[10px] font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="driverPhone"
              type="tel"
              value={driverPhone}
              onChange={(event) => setDriverPhone(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="07xx xxx xxx"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDisabled ? "Registering..." : "Register matatu"}
        </button>
      </form>
    </div>
  );
}
