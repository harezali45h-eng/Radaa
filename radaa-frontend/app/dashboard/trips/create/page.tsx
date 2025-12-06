"use client";

import Link from "next/link";

export default function CreateTripPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Trip creation disabled
          </h1>
          <p className="text-xs text-slate-300">
            Manual trip start/stop flows have been removed. Use the live map to
            find a matatu and request a ride instead.
          </p>
        </div>
        <Link
          href="/dashboard/passenger/live"
          className="inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500"
        >
          Open passenger live map
        </Link>
      </header>

      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
        The old trip form that asked for Matatu ID and coordinates has been
        removed. Rides are now requested directly from the live passenger
        dashboard.
      </div>
    </div>
  );
}

