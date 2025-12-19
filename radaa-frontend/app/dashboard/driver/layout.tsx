"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import DriverDashboardShell from "@/components/driver/DriverDashboardShell";

export default function DriverLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const active: "live" | "wallet" = pathname.startsWith("/dashboard/driver/live")
    ? "live"
    : "wallet";

  return <DriverDashboardShell active={active}>{children}</DriverDashboardShell>;
}
