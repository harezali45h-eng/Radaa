"use client";

export default function SaccoAnalyticsPage() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          SACCO analytics
        </h1>
        <p className="text-xs text-slate-300">
          Visualise revenue, occupancy, and route performance for your SACCO.
        </p>
      </header>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-800/80" />
          <div className="h-32 animate-pulse rounded-lg bg-slate-800/80" />
        </div>

        <p className="text-[11px] text-slate-300">
          Coming soon — backend integration pending.
        </p>
      </section>
    </div>
  );
}
