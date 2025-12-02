"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export function BackToDashboard() {
  const router = useRouter();
  const { primaryButtonClass } = useTheme();

  const handleClick = () => {
    router.push("/dashboard");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${primaryButtonClass} text-sm`}
    >
      Back to Dashboard
    </button>
  );
}
