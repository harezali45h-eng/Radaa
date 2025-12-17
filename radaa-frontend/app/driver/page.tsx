"use client";

import dynamic from "next/dynamic";

const DriverLiveDashboardPage = dynamic(
  () => import("@/app/dashboard/driver/live/page"),
  { ssr: false },
);

export default function DriverEntryPage() {
  return <DriverLiveDashboardPage />;
}
