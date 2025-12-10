"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function DriverMatatuPhotosHubPage() {
  const { user } = useAuth();
  const role = (user as any)?.role as string | undefined;
  const isDriver = role === "driver";

  if (!isDriver) {
    return (
      <div className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">My matatu photos</h1>
          <p className="text-xs text-slate-300">
            You must be signed in as a driver to manage matatu photos.
          </p>
        </header>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">My matatu photos</h1>
        <p className="text-xs text-slate-300">
          Open the photos page for a specific matatu assigned to you.
        </p>
      </header>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
        <p className="text-[11px] text-slate-300">
          To upload photos for a matatu, you currently need its matatu ID in the
          URL. If you know the ID, open the corresponding photos page:
        </p>
        <pre className="rounded-md bg-slate-950/80 px-3 py-2 text-[11px] text-slate-100">
          /dashboard/driver/matatu/&lt;matatuId&gt;/photos
        </pre>
        <p className="text-[11px] text-slate-400">
          You can usually copy the matatu ID from the SACCO or admin dashboard
          matatu list, then paste it into the URL above.
        </p>

        <div className="pt-2 text-[11px] text-slate-300">
          If you need to inspect matatus from the global list, you can start
          from the main matatu dashboard:
        </div>
        <Link
          href="/dashboard/matatus/list"
          className="inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-100 shadow-sm transition hover:border-slate-500 hover:bg-slate-800/90"
        >
          Open matatu list
        </Link>
      </section>
    </div>
  );
}
