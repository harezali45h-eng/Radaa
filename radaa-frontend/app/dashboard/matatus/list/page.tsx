"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";
import MatatuSwipeDeck, {
  type MatatuSwipeItem,
} from "@/components/MatatuSwipeDeck";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

interface Matatu {
  _id: string;
  plate?: string;
  route?: string;
  sacco?: string;
  driverName?: string;
  driverPhone?: string;
  status?: string;
  location?: {
    lat?: number;
    lng?: number;
  };
  isOnline?: boolean;
  lastUpdated?: string;
}

export default function MatatuListPage() {
  const [matatus, setMatatus] = useState<Matatu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const swipeEnabled = useIsFeatureEnabled("ff_swipe_matatus", false);

  const swipeItems: MatatuSwipeItem[] = matatus.map((m) => ({
    id: m._id,
    plate: m.plate || "Unknown plate",
    route: m.route || "Route TBD",
    sacco: m.sacco ?? null,
    driverName: m.driverName ?? null,
    driverPhone: m.driverPhone ?? null,
    status: m.status || (m.isOnline ? "Online" : "Offline"),
    online: Boolean(m.isOnline),
    lastLocation:
      m.location?.lat != null && m.location?.lng != null
        ? `${m.location.lat.toFixed(4)}, ${m.location.lng.toFixed(4)}`
        : null,
  }));

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BACKEND_URL}/matatus/live`);

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Failed to load matatus");
        }

        const data = (await response.json()) as Matatu[];
        setMatatus(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load matatus";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Matatus</h1>
          <p className="text-xs text-slate-300">
            View all matatus that are currently online. Register new vehicles
            and drill into individual records.
          </p>
        </div>
        <Link
          href="/dashboard/matatus/create"
          className="inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-sky-500"
        >
          Register matatu
        </Link>
      </header>

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          Loading matatus...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && swipeEnabled && matatus.length > 0 && (
        <MatatuSwipeDeck matatus={swipeItems} />
      )}

      {!loading && !error && matatus.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          No matatus are currently online. As vehicles start sending location
          updates, they will appear here.
        </div>
      )}

      {!loading && !error && matatus.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Plate</th>
                <th className="px-3 py-2 text-left font-medium">Route</th>
                <th className="px-3 py-2 text-left font-medium">Sacco</th>
                <th className="px-3 py-2 text-left font-medium">Driver</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">
                  Last location
                </th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matatus.map((m) => (
                <tr key={m._id} className="border-t border-slate-800/80">
                  <td className="px-3 py-2 text-slate-100">{m.plate}</td>
                  <td className="px-3 py-2 text-slate-200">{m.route}</td>
                  <td className="px-3 py-2 text-slate-300">{m.sacco || "—"}</td>
                  <td className="px-3 py-2 text-slate-300">
                    {m.driverName ? (
                      <span>
                        {m.driverName}
                        {m.driverPhone ? (
                          <span className="text-slate-500">
                            {" "}
                            · {m.driverPhone}
                          </span>
                        ) : null}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {m.isOnline ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{" "}
                        Online
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                        Offline
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {m.location?.lat != null && m.location?.lng != null
                      ? `${m.location.lat.toFixed(4)}, ${m.location.lng.toFixed(4)}`
                      : "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      href={`/dashboard/matatus/${m._id}`}
                      className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 hover:border-sky-500/70 hover:text-sky-200"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
