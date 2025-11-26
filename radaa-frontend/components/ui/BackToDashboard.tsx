"use client";

import { useRouter } from "next/navigation";

export function BackToDashboard() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950"
    >
      Back to Dashboard
    </button>
  );
}
