"use client";

import Link from "next/link";

export default function TripListPage() {
  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trips removed</h1>
          <p className="text-xs text-slate-300">
            The trip history feature is no longer available in this version of
            Radaa.
          </p>
        </div>
        <Link
          href="/dashboard/payments/list"
          className="inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500"
        >
          Go to payments &amp; wallet
        </Link>
      </header>

      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
        Trip tracking and history have been turned off. You can still use your
        wallet, live map, and ride request features.
      </div>
    </div>
  );
}
