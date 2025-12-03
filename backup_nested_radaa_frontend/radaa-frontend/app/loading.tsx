export default function AppLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <div className="h-6 w-32 animate-pulse rounded bg-slate-800/80" />
      <div className="h-4 w-64 animate-pulse rounded bg-slate-800/80" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-24 animate-pulse rounded-xl bg-slate-800/80" />
        <div className="h-24 animate-pulse rounded-xl bg-slate-800/80" />
        <div className="h-24 animate-pulse rounded-xl bg-slate-800/80" />
      </div>
    </div>
  );
}
