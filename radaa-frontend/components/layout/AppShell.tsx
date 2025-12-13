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

  useEffect(() => {
    if (!mobileNavOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const isDashboardRoot = pathname === "/dashboard";
  const isDashboardSub = pathname.startsWith("/dashboard/");
  const isAuthRoute = pathname.startsWith("/auth");
  const isMarketingHome = pathname === "/";

  const isDashboard = isDashboardRoot || isDashboardSub;

  const isShellRouteCore =
    pathname.startsWith("/dashboard") ||
    pathname === "/map" ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/payments") ||
    pathname.startsWith("/track") ||
    pathname === "/gallery";

  const isShellNavContext = !isAuthRoute && !isMarketingHome && isShellRouteCore;

  const isBottomNavEligible =
    simplifiedNavEnabled && !isAuthRoute && !isMarketingHome && isShellRouteCore;

  const showBackToDashboard =
    !isMarketingHome && !isAuthRoute && !isDashboardRoot;
  const role = (user as any)?.role as string | undefined;
  const isAdmin = role === "admin";
  const isDriver = role === "driver";
  const displayName =
    (user as any)?.username || (user as any)?.phone || "Radaa user";
  const initials = displayName.charAt(0).toUpperCase();
  const ratingLabel = "4.8 ★";

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
      <header className={`${headerBgClass} relative z-30`}>
        <div className="radaa-shell flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            {isShellNavContext && !simplifiedNavEnabled && (
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 text-slate-200 hover:border-sky-500 hover:text-sky-200"
                aria-label="Open navigation menu"
                aria-expanded={mobileNavOpen}
                aria-controls="radaa-mobile-nav"
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
              <Link href="/gallery" className="hover:text-white">
                Gallery
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
        <div className="mx-auto max-w-6xl px-4 py-4 md:py-6">
          {showBackToDashboard && (
            <div className="mb-3 flex justify-start">
              <BackToDashboardButton />
            </div>
          )}
          {children}
        </div>
      </main>
      {isShellNavContext && mobileNavOpen && !simplifiedNavEnabled && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Radaa navigation menu"
        >
          <div className="absolute left-0 top-0 flex h-full">
            <div className="radaa-mobile-drawer" id="radaa-mobile-nav">
              <div className="mb-4 flex items-center justify-between">
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
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-800/70 bg-slate-950/80 px-3 py-3">
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
              <nav className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-slate-50/90">
                <Link
                  href="/dashboard/payments/list"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-[2.75rem] items-center justify-between rounded-xl px-4 py-2.5 text-[13px] font-semibold text-slate-50/90 hover:bg-white/10 active:bg-white/15"
                >
                  <span>Payments</span>
                  <span className="text-[10px] text-slate-400">Wallet</span>
                </Link>
                <Link
                  href="/free-ride"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-[2.75rem] items-center justify-between rounded-xl px-4 py-2.5 text-[13px] font-semibold text-slate-50/90 hover:bg-white/10 active:bg-white/15"
                >
                  <span>Loyalty progress</span>
                  <span className="text-[10px] text-emerald-300">Free rides</span>
                </Link>
                <Link
                  href="/dashboard/trips/list"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-[2.75rem] items-center justify-between rounded-xl px-4 py-2.5 text-[13px] font-semibold text-slate-50/90 hover:bg-white/10 active:bg-white/15"
                >
                  <span>My trips</span>
                  <span className="text-[10px] text-slate-400">History</span>
                </Link>
                <Link
                  href="/gallery"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-[2.75rem] items-center justify-between rounded-xl px-4 py-2.5 text-[13px] font-semibold text-slate-50/90 hover:bg-white/10 active:bg-white/15"
                >
                  <span>Gallery</span>
                  <span className="text-[10px] text-slate-400">Matatus</span>
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-[2.75rem] items-center justify-between rounded-xl px-4 py-2.5 text-[13px] font-semibold text-slate-50/90 hover:bg-white/10 active:bg-white/15"
                >
                  <span>Support</span>
                  <span className="text-[10px] text-slate-400">Profile</span>
                </Link>
                <Link
                  href="/home"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-[2.75rem] items-center justify-between rounded-xl px-4 py-2.5 text-[13px] font-semibold text-slate-50/90 hover:bg-white/10 active:bg-white/15"
                >
                  <span>About</span>
                  <span className="text-[10px] text-slate-400">Radaa</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/dashboard/sacco"
                    onClick={() => setMobileNavOpen(false)}
                    className="flex min-h-[2.75rem] items-center justify-between rounded-xl px-4 py-2.5 text-[13px] font-semibold text-slate-50/90 hover:bg-white/10 active:bg-white/15"
                  >
                    <span>SACCO</span>
                    <span className="text-[10px] text-slate-400">Admin</span>
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
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800/80 bg-[rgba(9,20,26,0.96)] backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6 py-2.5 text-[11px]">
            <div className="flex w-full items-center justify-between gap-4">
              <Link
                href={homeHref}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1.5 ${
                  pathname === homeHref
                    ? "text-sky-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-[11px] font-medium">Home</span>
              </Link>
              <Link
                href={liveHref}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1.5 ${
                  liveTabActive
                    ? "text-sky-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-[11px] font-medium">Live</span>
              </Link>
              <Link
                href="/profile"
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1.5 ${
                  pathname.startsWith("/profile")
                    ? "text-sky-400"
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
