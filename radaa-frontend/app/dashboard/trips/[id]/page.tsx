"use client";

import Link from "next/link";

export default function TripDetailPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trips no longer available</h1>
          <p className="text-xs text-slate-300">
            Detailed trip views and ratings have been turned off in this
            environment.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500"
        >
          Back to dashboard
        </Link>
      </header>

      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
        The trip module (start, stop, history, and ratings) has been disabled.
        Any previous trip data is still stored in the backend, but it is not
        shown in the UI.
      </div>

      <div className="text-xs text-slate-400">
        Focus instead on live operations, ride requests, and wallet payments.
      </div>
    </div>
  );
}
