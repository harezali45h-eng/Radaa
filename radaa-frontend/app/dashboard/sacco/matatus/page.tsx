"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSaccoMatatus, setMatatuApproval, type SaccoMatatu } from "@/lib/api/sacco";

export default function SaccoMatatusPage() {
  const { user, token } = useAuth();

  const saccoId = (user as any)?._id as string | undefined;

  const [matatus, setMatatus] = useState<SaccoMatatu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = (user as any)?.role === "admin";

  useEffect(() => {
    if (!saccoId || !token || !isAdmin) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getSaccoMatatus(saccoId, {}, token);
        if (cancelled) return;
        setMatatus(data);
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load matatus";
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [saccoId, token, isAdmin]);

  const handleMatatuApproval = async (
    matatuId: string,
    status: "approved" | "rejected"
  ) => {
    if (!saccoId || !token) return;
    try {
      const updated = await setMatatuApproval(saccoId, matatuId, status, token);
      setMatatus((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update matatu";
      setError(message);
    }
  };

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">SACCO matatus</h1>
          <p className="text-xs text-slate-300">
            You must be signed in as a SACCO admin to view this page.
          </p>
        </header>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">SACCO matatus</h1>
        <p className="text-xs text-slate-300">
          Manage and monitor matatus registered under this SACCO.
        </p>
      </header>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      {loading && (
        <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-800/80" />
            <div className="h-24 animate-pulse rounded-lg bg-slate-800/80" />
          </div>
        </section>
      )}

      {!loading && !error && matatus.length === 0 && (
        <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          No matatus are currently registered for this SACCO.
        </section>
      )}

      {!loading && !error && matatus.length > 0 && (
        <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Fleet</h2>
              <p className="text-[11px] text-slate-400">
                Vehicles under this SACCO and their approval status.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950/70">
            <table className="min-w-full border-collapse text-[11px]">
              <thead className="bg-slate-900/80 text-slate-300">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Matatu</th>
                  <th className="px-3 py-2 text-left font-medium">Route</th>
                  <th className="px-3 py-2 text-left font-medium">Approval</th>
                  <th className="px-3 py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {matatus.map((m) => (
                  <tr key={m._id} className="border-t border-slate-800/80">
                    <td className="px-3 py-2 text-slate-100">
                      {m.plate || m.numberPlate || m._id.slice(0, 6)}
                    </td>
                    <td className="px-3 py-2 text-slate-300">{m.route ?? "—"}</td>
                    <td className="px-3 py-2">
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-100">
                        {m.approvalStatus ?? "pending"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleMatatuApproval(m._id, "approved")}
                          className="rounded-full bg-emerald-600/80 px-2 py-0.5 text-[10px] text-emerald-50 hover:bg-emerald-500/80"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMatatuApproval(m._id, "rejected")}
                          className="rounded-full bg-red-600/70 px-2 py-0.5 text-[10px] text-red-50 hover:bg-red-500/80"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
