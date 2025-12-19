"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRealtime } from "@/context/realtimeContext";

interface AppRootClientProps {
  children: ReactNode;
}

export function AppRootClient({ children }: AppRootClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { activeMode: realtimeMode } = useRealtime();

  const rawRole = (user as any)?.role as string | undefined;
  const normalizedRole = rawRole ? rawRole.toLowerCase() : undefined;
  const isDriver = normalizedRole === "driver";

  const activeMode: "driver" | "passenger" = isDriver ? "driver" : "passenger";

  const isDriverRoute =
    pathname.startsWith("/dashboard/driver") || pathname.startsWith("/driver");
  const isPassengerRoute =
    pathname.startsWith("/dashboard/passenger") || pathname === "/dashboard";
  const isAuthRoute = pathname.startsWith("/auth");

  if (typeof console !== "undefined" && process.env.NODE_ENV !== "production") {
    console.log("[layout] pathname:", pathname, "activeMode:", activeMode);
  }

  useEffect(() => {
    if (!user || isAuthRoute) {
      return;
    }

    if (isDriver) {
      if (isPassengerRoute) {
        router.replace("/dashboard/driver/live");
      }
    } else if (normalizedRole && normalizedRole !== "admin") {
      if (isDriverRoute) {
        router.replace("/dashboard/passenger");
      }
    }
  }, [
    user,
    isAuthRoute,
    isDriver,
    isDriverRoute,
    isPassengerRoute,
    normalizedRole,
    router,
  ]);

  useEffect(() => {
    if (!isDriverRoute || !isDriver) {
      return;
    }

    if (realtimeMode !== "driver") {
      // eslint-disable-next-line no-console
      console.error("[driver] incorrect dashboard rendered", {
        pathname,
        activeMode: realtimeMode,
      });
    } else {
      // eslint-disable-next-line no-console
      console.log("[driver] driver dashboard mounted successfully", {
        pathname,
      });
    }
  }, [isDriverRoute, isDriver, pathname, realtimeMode]);

  return (
    <div className="font-[Inter]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-dvh"
        >
          <div className="radaa-shell py-4 md:py-6 lg:py-8">{children}</div>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
