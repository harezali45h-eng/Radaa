"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import BackToDashboardButton from "@/components/BackToDashboardButton";
import { useSocket } from "@/hooks/useSocket";
import { useRealtime } from "@/context/realtimeContext";
import { useTheme } from "@/context/ThemeContext";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { user, token, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const { connect } = useSocket();
  const { driverOnline, setDriverOnline, activeMode } = useRealtime();
  const { headerBgClass } = useTheme();

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

  const showBackToDashboard = !isMarketingHome && !isAuthRoute && !isDashboardRoot;
  const role = (user as any)?.role as string | undefined;
  const isAdmin = role === "admin";
  const isDriver = role === "driver";

  const homeHref = isAdmin
    ? "/dashboard/sacco"
    : isDriver && activeMode === "driver"
      ? "/dashboard/driver/live"
      : "/dashboard";

  const liveHref = isDriver && activeMode === "driver" ? "/dashboard/driver/live" : "/dashboard/passenger/live";

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
          <Link href={homeHref} className="text-lg font-semibold tracking-tight">
            Radaa
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <div className="hidden items-center gap-3 md:flex">
              <Link href={homeHref} className="hover:text-white">
                Home
              </Link>
              <Link href={liveHref} className="hover:text-white">
                Live
              </Link>
              <Link href="/dashboard/trips/list" className="hover:text-white">
                Trips
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
                  console.log("[mode] header toggle ->", next ? "driver" : "passenger");
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
                    <div className="px-3 py-3 text-slate-400">No notifications yet.</div>
                  ) : (
                    <ul className="max-h-64 divide-y divide-slate-800 overflow-auto">
                      {notifications.map((n) => (
                        <li key={n.id} className="px-3 py-2 hover:bg-slate-900/80">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-[11px] font-semibold text-slate-100">{n.title}</div>
                              <div className="mt-0.5 text-[11px] text-slate-300">{n.message}</div>
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
            <button
              type="button"
              onClick={logout}
              className="text-xs font-medium text-slate-300 hover:text-red-300"
            >
              Logout
            </button>
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
      {(isDashboardRoot || isDashboardSub) && isDriver && (
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-800 bg-slate-950/90 px-4 py-2 text-[11px] text-slate-200 md:hidden">
          <div className="mx-auto flex max-w-md items-center justify-between">
            <Link href={homeHref} className="flex flex-1 flex-col items-center px-2 py-1">
              <span className="text-[11px]">Home</span>
            </Link>
            <Link
              href={liveHref}
              className="flex flex-1 flex-col items-center px-2 py-1"
            >
              <span className="text-[11px]">Live</span>
            </Link>
            <Link
              href="/dashboard/trips/list"
              className="flex flex-1 flex-col items-center px-2 py-1"
            >
              <span className="text-[11px]">Trips</span>
            </Link>
            <Link href="/profile" className="flex flex-1 flex-col items-center px-2 py-1">
              <span className="text-[11px]">Profile</span>
            </Link>
            {isAdmin && (
              <Link
                href="/dashboard/sacco"
                className="flex flex-1 flex-col items-center px-2 py-1"
              >
                <span className="text-[11px]">SACCO</span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
