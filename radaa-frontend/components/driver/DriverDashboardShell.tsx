"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface DriverDashboardShellProps {
  active: "live" | "wallet";
  children?: ReactNode;
}

export default function DriverDashboardShell({
  active,
  children,
}: DriverDashboardShellProps) {
  return (
    <div className="space-y-3 text-xs">
      <nav className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/80 p-1 text-[11px] text-slate-300">
        <Link
          href="/dashboard/driver/live"
          className={`rounded-full px-3 py-1 transition ${
            active === "live"
              ? "bg-emerald-600/80 text-emerald-50 shadow-soft"
              : "hover:bg-slate-800/80 hover:text-slate-100"
          }`}
        >
          Live map & requests
        </Link>
        <Link
          href="/dashboard/driver"
          className={`rounded-full px-3 py-1 transition ${
            active === "wallet"
              ? "bg-sky-600/80 text-sky-50 shadow-soft"
              : "hover:bg-slate-800/80 hover:text-slate-100"
          }`}
        >
          Wallet & payouts
        </Link>
      </nav>

      {children}
    </div>
  );
}
