"use client";

import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import { useRealtime } from "@/context/realtimeContext";

const BoltDashboardPage = dynamic(
  () => import("@/src/features/bolt/pages/BoltDashboardPage"),
  { ssr: false },
);

const DriverLiveDashboardPage = dynamic(
  () => import("./driver/live/page"),
  { ssr: false },
);

export default function DashboardEntry() {
  const { user } = useAuth();
  const { activeMode } = useRealtime();

  const role = (user as any)?.role as string | undefined;
  const isDriver = role === "driver";
  const isDriverMode = isDriver && activeMode === "driver";

  if (isDriverMode) {
    return <DriverLiveDashboardPage />;
  }

  return <BoltDashboardPage />;
}
