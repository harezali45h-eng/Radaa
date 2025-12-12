"use client";

import dynamic from "next/dynamic";

const BoltDashboardPage = dynamic(
  () => import("@/src/features/bolt/pages/BoltDashboardPage"),
  { ssr: false },
);

export default function HomeBoltPage() {
  return <BoltDashboardPage />;
}
