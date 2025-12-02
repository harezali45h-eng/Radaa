export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_#0f172a,_transparent_55%),radial-gradient(ellipse_at_bottom,_#020617,_transparent_55%)] px-4 py-8 text-slate-50">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full gap-10 md:grid-cols-[1.2fr,1fr] items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/90">
              Radaa
            </p>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Move the city with
              <span className="text-sky-400"> live matatu intelligence</span>.
            </h1>
            <p className="max-w-md text-sm text-slate-300">
              Sign in to manage fleets, track rides in real time, and reward loyal
              commutersall from a single dashboard.
            </p>
          </div>

          <div className="w-full max-w-md justify-self-end">
            <div className="space-y-6 rounded-xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-2xl shadow-sky-900/40 backdrop-blur">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
