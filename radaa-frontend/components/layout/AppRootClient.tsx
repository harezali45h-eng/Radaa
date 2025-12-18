"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRealtime } from "@/context/realtimeContext";

interface AppRootClientProps {
  children: ReactNode;
}

export function AppRootClient({ children }: AppRootClientProps) {
  const pathname = usePathname();
  const { activeMode: realtimeMode } = useRealtime();

  const isDriverPath =
    pathname.startsWith("/dashboard/driver") || pathname.startsWith("/driver");

  const activeMode = isDriverPath ? "driver" : "passenger";

  if (typeof console !== "undefined") {
    console.log("[layout] pathname:", pathname, "activeMode:", activeMode);
  }

  useEffect(() => {
    if (!isDriverPath) {
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
  }, [isDriverPath, pathname, realtimeMode]);

  return (
    <div className="font-[Inter]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={activeMode}
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
