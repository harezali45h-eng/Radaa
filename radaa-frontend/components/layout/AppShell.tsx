"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import BackToDashboardButton from "@/components/BackToDashboardButton";
import { useSocket } from "@/hooks/useSocket";
import { useRealtime } from "@/context/realtimeContext";
import { useTheme } from "@/context/ThemeContext";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { connect } = useSocket();
  const { driverOnline, setDriverOnline, activeMode } = useRealtime();
  const { headerBgClass } = useTheme();
  const simplifiedNavEnabled = useIsFeatureEnabled("ff_simplified_nav", false);
  const liveOnlyMapEnabled = useIsFeatureEnabled("ff_live_only_map", false);

  useEffect(() => {
    if (!token) {
      return;
    }

    connect(token);
  }, [token, connect]);

  const isDashboardRoot = pathname === "/dashboard";
  const isDashboardSub = pathname.startsWith("/dashboard/");
  const isAuthRoute = pathname.startsWith("/auth");
  const isMarketingHome = pathname === "/";

  const isDashboard = isDashboardRoot || isDashboardSub;

  const isBottomNavEligible =
    simplifiedNavEnabled &&
    !isAuthRoute &&
    !isMarketingHome &&
    (pathname.startsWith("/dashboard") ||
      pathname === "/map" ||
      pathname.startsWith("/profile"));

  const showBackToDashboard =
    !isMarketingHome && !isAuthRoute && !isDashboardRoot;
  const role = (user as any)?.role as string | undefined;
  const isAdmin = role === "admin";
  const isDriver = role === "driver";

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

  const liveTabActive = liveOnlyMapEnabled
    ? pathname === "/map"
    : pathname.startsWith("/dashboard/passenger/live") ||
      pathname.startsWith("/dashboard/driver/live");

  const toggleNotifications = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      markAllAsRead();
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className={headerBgClass}>
        <div className="radaa-shell flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            {isDashboard && !simplifiedNavEnabled && (
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 text-slate-200 hover:border-sky-500 hover:text-sky-200 md:hidden"
                aria-label="Open navigation menu"
              >
                <span className="block h-0.5 w-4 rounded bg-slate-200" />
                <span className="mt-1 block h-0.5 w-4 rounded bg-slate-200" />
                <span className="mt-1 block h-0.5 w-4 rounded bg-slate-200" />
              </button>
            )}
            <Link
              href={homeHref}
              className="text-lg font-semibold tracking-tight"
            >
              Radaa
            </Link>
          </div>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <div className="hidden items-center gap-3 md:flex">
              <Link href={homeHref} className="hover:text-white">
                Home
              </Link>
              <Link href={liveHref} className="hover:text-white">
                Live
              </Link>
              <Link href="/profile" className="hover:text-white">
                Profile
              </Link>
              {isAdmin && (
                <Link href="/dashboard/sacco" className="hover:text-white">
                  SACCO
                </Link>
              )}
            </div>
            {(isDashboardRoot || isDashboardSub) && isDriver && (
              <button
                type="button"
                onClick={() => {
                  const next = !driverOnline;
                  console.log(
                    "[mode] header toggle ->",
                    next ? "driver" : "passenger",
                  );
                  setDriverOnline(next);
                }}
                className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium shadow-sm transition ${
                  driverOnline
                    ? "border-emerald-500/80 bg-emerald-600/20 text-emerald-200"
                    : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500"
                }`}
              >
                <span
                  className={`mr-1 h-1.5 w-1.5 rounded-full ${
                    driverOnline ? "bg-emerald-400" : "bg-slate-500"
                  }`}
                />
                Driver Mode
              </button>
            )}
            <div className="relative">
              <button
                type="button"
                onClick={toggleNotifications}
                className="relative inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-200 shadow-sm transition hover:border-sky-500/70 hover:text-sky-200"
              >
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {open && (
                <div className="absolute right-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-md border border-slate-800 bg-slate-950 text-[11px] shadow-lg">
                  <div className="border-b border-slate-800 px-3 py-2 text-xs font-semibold text-slate-200">
                    Notifications
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-3 py-3 text-slate-400">
                      No notifications yet.
                    </div>
                  ) : (
                    <ul className="max-h-64 divide-y divide-slate-800 overflow-auto">
                      {notifications.map((n) => (
                        <li
                          key={n.id}
                          className="px-3 py-2 hover:bg-slate-900/80"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-[11px] font-semibold text-slate-100">
                                {n.title}
                              </div>
                              <div className="mt-0.5 text-[11px] text-slate-300">
                                {n.message}
                              </div>
                            </div>
                            {!n.read && (
                              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-400" />
                            )}
                          </div>
                          <div className="mt-1 text-[10px] text-slate-500">
                            {new Date(n.createdAt).toLocaleTimeString()}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            {/* Top-level Logout button removed to avoid duplication; users can logout from the sidebar or mobile drawer. */}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          {showBackToDashboard && (
            <div className="mb-4 flex justify-end">
              <BackToDashboardButton />
            </div>
          )}
          {children}
        </div>
      </main>
      {isDashboard && mobileNavOpen && !simplifiedNavEnabled && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden">
          <div className="absolute left-0 top-0 flex h-full">
            <div className="radaa-mobile-drawer">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-semibold tracking-tight text-slate-50">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="inline-flex items-center rounded-full border border-slate-300/40 bg-slate-900/40 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-soft hover:border-slate-100/60 hover:bg-slate-900/70"
                >
                  Close
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-slate-50/90">
                <Link
                  href={homeHref}
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-[3rem] items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-50/90 hover:bg-white/10 active:bg-white/15"
                >
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-slate-200/95 shadow-[0_0_0_2px_rgba(226,232,240,0.55)]" />
                  <span>Home</span>
                </Link>
                <Link
                  href={liveHref}
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-[3rem] items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-50/90 hover:bg-white/10 active:bg-white/15"
                >
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400/95 shadow-[0_0_0_2px_rgba(52,211,153,0.55)]" />
                  <span>Live</span>
                </Link>
                {/* Trips entry removed from mobile drawer now that the trip module is disabled. */}
                <Link
                  href="/profile"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-[3rem] items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-50/90 hover:bg-white/10 active:bg-white/15"
                >
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-400/95 shadow-[0_0_0_2px_rgba(56,189,248,0.55)]" />
                  <span>Profile</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/dashboard/sacco"
                    onClick={() => setMobileNavOpen(false)}
                    className="flex min-h-[3rem] items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-50/90 hover:bg-white/10 active:bg-white/15"
                  >
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-orange-300/95 shadow-[0_0_0_2px_rgba(253,186,116,0.6)]" />
                    <span>SACCO</span>
                  </Link>
                )}
              </nav>
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  logout();
                }}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-red-500/70 bg-red-500/15 px-4 py-2.5 text-sm font-semibold text-red-100 shadow-soft hover:border-red-400 hover:bg-red-500/25"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {isBottomNavEligible && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-md md:hidden">
          <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-2.5 text-[11px]">
            <button
              type="button"
              onClick={() => router.push("/dashboard/passenger/request")}
              className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center rounded-full bg-genz-primary px-5 py-2.5 font-semibold text-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.9)] transition hover:bg-sky-400"
            >
              Request ride
            </button>
            <div className="flex w-full items-center justify-between gap-4">
              <Link
                href="/dashboard"
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1.5 ${
                  pathname === "/dashboard"
                    ? "text-sky-300"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-[11px] font-medium">Home</span>
              </Link>
              <Link
                href={
                  (user as any)?.role === "driver" && activeMode === "driver"
                    ? "/dashboard/driver/live"
                    : "/dashboard/passenger/live"
                }
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1.5 ${
                  pathname.startsWith("/dashboard/passenger/live") ||
                  pathname.startsWith("/dashboard/driver/live")
                    ? "text-sky-300"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-[11px] font-medium">Live</span>
              </Link>
              <Link
                href="/dashboard/trips/list"
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1.5 ${
                  pathname.startsWith("/dashboard/trips")
                    ? "text-sky-300"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-[11px] font-medium">Rides</span>
              </Link>
              <Link
                href="/profile"
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1.5 ${
                  pathname.startsWith("/profile")
                    ? "text-sky-300"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-[11px] font-medium">Profile</span>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
