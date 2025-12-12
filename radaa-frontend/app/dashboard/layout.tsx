"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useRealtime } from "@/context/realtimeContext";
import { useTheme } from "@/context/ThemeContext";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const role = (user as any)?.role as string | undefined;
  const isAdmin = role === "admin";
  const isDriver = role === "driver";
  const { activeMode } = useRealtime();
  const { cardSurfaceClass } = useTheme();
  const simplifiedNavEnabled = useIsFeatureEnabled("ff_simplified_nav", false);
  const liveOnlyMapEnabled = useIsFeatureEnabled("ff_live_only_map", false);

  const homeHref = isAdmin
    ? "/dashboard/sacco"
    : isDriver && activeMode === "driver"
      ? "/dashboard/driver/live"
      : "/dashboard";

  const liveHref = liveOnlyMapEnabled
    ? "/map"
    : isDriver && activeMode === "driver"
      ? "/dashboard/driver/live"
      : "/dashboard/passenger/live";

  const displayName = (user as any)?.username || (user as any)?.phone || "Radaa user";
  const initials = displayName.charAt(0).toUpperCase();
  const ratingLabel = "4.8 ★";

  return (
    <AppShell>
      <div className="grid gap-6 md:grid-cols-[230px,1fr]">
        <aside className={`${cardSurfaceClass} hidden space-y-4 p-4 text-xs md:block`}>
          <div className="flex items-center gap-3 rounded-xl border border-slate-800/70 bg-slate-950/70 px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-200">
              {initials}
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-semibold text-slate-50">
                {displayName}
              </div>
              <div className="text-[10px] text-slate-400">
                {isDriver ? "Driver" : isAdmin ? "Admin" : "Passenger"}
              </div>
            </div>
            <div className="flex flex-col items-end text-[10px] text-amber-300">
              <span className="rounded-full bg-slate-900/70 px-2 py-0.5 font-medium">
                {ratingLabel}
              </span>
              <span className="mt-0.5 text-[9px] text-slate-500">
                Loyalty score
              </span>
            </div>
          </div>
          <nav className="space-y-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Menu
              </div>
              <div className="mt-2 space-y-1">
                <Link
                  href="/dashboard/payments/list"
                  className="flex items-center justify-between rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                >
                  <span>Payments</span>
                  <span className="text-[10px] text-slate-400">Wallet</span>
                </Link>
                <Link
                  href="/free-ride"
                  className="flex items-center justify-between rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                >
                  <span>Promotions</span>
                  <span className="text-[10px] text-emerald-300">Free rides</span>
                </Link>
                <Link
                  href="/dashboard/trips/list"
                  className="flex items-center justify-between rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                >
                  <span>My rides</span>
                  <span className="text-[10px] text-slate-400">History</span>
                </Link>
                <Link
                  href="/map"
                  className="flex items-center justify-between rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                >
                  <span>Safety</span>
                  <span className="text-[10px] text-slate-400">Live map</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center justify-between rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                >
                  <span>Support</span>
                  <span className="text-[10px] text-slate-400">Profile</span>
                </Link>
                <Link
                  href="/home"
                  className="flex items-center justify-between rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                >
                  <span>About</span>
                  <span className="text-[10px] text-slate-400">Radaa</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/dashboard/sacco"
                    className="flex items-center justify-between rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                  >
                    <span>SACCO</span>
                    <span className="text-[10px] text-slate-400">Admin</span>
                  </Link>
                )}
              </div>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={logout}
                className="block w-full rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-center text-[11px] font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          </nav>
        </aside>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold md:hidden">Dashboard</div>
            <div className="hidden gap-2 text-[11px] text-slate-300 md:flex">
              <span className="font-medium text-slate-100">Home</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">Live</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">Payments & Wallet</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">Profile</span>
              {isAdmin && (
                <>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-400">SACCO</span>
                </>
              )}
            </div>
          </div>

          {children}
        </section>
      </div>
    </AppShell>
  );
}
