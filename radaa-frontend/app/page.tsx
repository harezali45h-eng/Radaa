"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRealtime } from "@/context/realtimeContext";

export default function HomePage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const { activeMode } = useRealtime();

  useEffect(() => {
    if (loading) return;
    if (!user && !token) return;

    const role = (user as any)?.role as string | undefined;
    let target = "/dashboard";

    if (role === "admin") {
      target = "/dashboard/sacco";
    } else if (role === "driver" && activeMode === "driver") {
      target = "/dashboard/driver/live";
    } else {
      target = "/dashboard";
    }

    console.log("[mode] root redirect", { role, activeMode, target });
    router.replace(target);
  }, [loading, user, token, router, activeMode]);

  const showLanding = !user && !token;

  if (!showLanding) {
    return (
      <div className="space-y-2 text-sm text-slate-300">
        <p>Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome to Radaa
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Track live matatus, manage your rides, and unlock free trips through
          the built-in loyalty program.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href="/map"
          className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-sky-500/80 hover:bg-slate-900"
        >
          <h2 className="text-base font-semibold">Live Matatu Map</h2>
          <p className="mt-1 text-xs text-slate-300">
            See matatus in real time, including their latest location and basic
            route details.
          </p>
        </Link>

        <Link
          href="/profile"
          className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-emerald-500/80 hover:bg-slate-900"
        >
          <h2 className="text-base font-semibold">Your Profile & Loyalty</h2>
          <p className="mt-1 text-xs text-slate-300">
            View your ride history, loyalty progress, and unlocked free rides.
          </p>
        </Link>

        <Link
          href="/payments"
          className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-amber-400/80 hover:bg-slate-900"
        >
          <h2 className="text-base font-semibold">Quick Payments</h2>
          <p className="mt-1 text-xs text-slate-300">
            Initiate and verify payments via Mpesa, card, or other providers
            (sandboxed).
          </p>
        </Link>
      </section>
    </div>
  );
}
