import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="radaa-login-bg py-6 md:py-10 text-slate-50">
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl items-start justify-center md:items-center">
        <div className="grid w-full gap-8 items-start md:grid-cols-[1.2fr,1fr] md:gap-10 md:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/90">
              Radaa
            </p>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              <span className="text-sky-400">Kaa Radaa</span>{" "}
              as you move in the city.
            </h1>
            <p className="max-w-md text-sm text-slate-300">
              Sign in to manage fleets, track rides in real time, and reward loyal
              commuters  all from a single dashboard.
            </p>
          </div>

          <div className="w-full max-w-md justify-self-end">
            <div className="radaa-glass-card space-y-6 p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
