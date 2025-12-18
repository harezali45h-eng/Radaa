"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardEntry() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
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

    router.replace("/dashboard/passenger/live");
  }, [user, router]);

  return null;
}
