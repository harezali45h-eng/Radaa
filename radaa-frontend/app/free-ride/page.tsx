export default function FreeRidePage() {
  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-6 text-center">
      <div className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
        Loyalty milestone
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-emerald-300">
        You&apos;ve unlocked a FREE ride!
      </h1>
      <p className="mx-auto max-w-md text-xs text-slate-300">
        Redeem this ride on your next trip. The backend increments your free ride balance every time
        you complete 10 paid rides.
      </p>
    </div>
  );
}
