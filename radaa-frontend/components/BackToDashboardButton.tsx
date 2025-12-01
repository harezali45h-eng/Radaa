"use client";

import { useRouter } from "next/navigation";
import { useRealtime } from "@/context/realtimeContext";
import { useTheme } from "@/context/ThemeContext";

export default function BackToDashboardButton() {
  const router = useRouter();
  const { activeMode } = useRealtime();
  const { primaryButtonClass } = useTheme();

  const handleClick = () => {
    const target =
      activeMode === "driver" ? "/dashboard/driver/live" : "/dashboard";
    console.log("[mode] back-to-dashboard", { activeMode, target });
    router.push(target);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${primaryButtonClass} gap-1 text-xs`}
    >
      <span className="mr-1">&#8592;</span>
      Back to Dashboard
    </button>
  );
}
