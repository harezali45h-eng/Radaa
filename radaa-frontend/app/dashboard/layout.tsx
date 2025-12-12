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

  return (
    <AppShell>
      <div className="grid gap-6 md:grid-cols-[210px,1fr]">
        <aside className={`${cardSurfaceClass} hidden p-4 text-xs md:block`}>
          <nav className="space-y-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Menu
              </div>
              <div className="mt-1 space-y-1">
                <Link
                  href={homeHref}
                  className="block rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                >
                  Home
                </Link>
                <Link
                  href={liveHref}
                  className="block rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                >
                  Live
                </Link>
                {(!isDriver || isAdmin) && (
                  <Link
                    href="/dashboard/passenger/request"
                    className="block rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                  >
                    Request ride
                  </Link>
                )}
                {(isDriver || isAdmin) && (
                  <Link
                    href="/dashboard/driver/live"
                    className="block rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                  >
                    Driver live
                  </Link>
                )}
                {(isDriver || isAdmin) && (
                  <Link
                    href="/dashboard/driver/matatu"
                    className="block rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                  >
                    My matatu photos
                  </Link>
                )}
                <Link
                  href="/dashboard/payments/list"
                  className="block rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                >
                  Payments & Wallet
                </Link>
                <Link
                  href="/profile"
                  className="block rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    href="/dashboard/sacco"
                    className="block rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                  >
                    SACCO
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="block w-full rounded-md px-3 py-2 text-left text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                >
                  Logout
                </button>
              </div>
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
