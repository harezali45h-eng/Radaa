export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-40 animate-pulse rounded bg-slate-800/80" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-24 animate-pulse rounded-xl bg-slate-800/80" />
        <div className="h-24 animate-pulse rounded-xl bg-slate-800/80" />
        <div className="h-24 animate-pulse rounded-xl bg-slate-800/80" />
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-slate-800/80" />
    </div>
  );
}
