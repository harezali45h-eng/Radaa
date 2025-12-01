"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Global app error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md space-y-4 rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-xs">
            <h1 className="text-lg font-semibold text-red-100">
              Something went wrong
            </h1>
            <p className="text-slate-200">
              An unexpected error occurred while rendering this page. You can
              try again, or go back to the dashboard.
            </p>
            <div className="flex gap-3 text-[11px]">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 font-medium text-white hover:bg-sky-500"
              >
                Try again
              </button>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 font-medium text-slate-100 hover:border-slate-500"
              >
                Go to dashboard
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
