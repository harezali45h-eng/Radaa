"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const BoltDashboardPage = dynamic(
  () => import("@/src/features/bolt/pages/BoltDashboardPage"),
  { ssr: false },
);

export default function DashboardEntry() {
  const { user } = useAuth();
  const router = useRouter();

  const role = (user as any)?.role as string | undefined;
  const isDriver = role === "driver";

  useEffect(() => {
    if (!isDriver) {
      return;
    }

    router.replace("/dashboard/driver/live");
  }, [isDriver, router]);

  if (isDriver) {
    return null;
  }

  return <BoltDashboardPage />;
}
