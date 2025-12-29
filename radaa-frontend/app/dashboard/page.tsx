"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardEntry() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user && !token) {
      router.replace("/auth/login");
      return;
    }

    if (!user) {
      return;
    }

    const rawRole = (user as any)?.role as string | undefined;
    const normalizedRole = rawRole ? rawRole.toLowerCase() : undefined;

    if (normalizedRole === "driver") {
      router.replace("/dashboard/driver/live");
      return;
    }

    if (normalizedRole === "admin") {
      router.replace("/dashboard/sacco");
      return;
    }

    router.replace("/dashboard/passenger");
  }, [user, token, loading, router]);

  const message = loading
    ? "Loading your dashboard..."
    : !user
      ? "Resolving your account session..."
      : "Routing you to your dashboard...";

  return (
    <div className="space-y-2 text-sm text-slate-300">
      <p>{message}</p>
    </div>
  );
}
