"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";

interface AppRootClientProps {
  children: ReactNode;
}

export function AppRootClient({ children }: AppRootClientProps) {
  const pathname = usePathname();
  const newThemeEnabled = useIsFeatureEnabled("ff_new_theme", false);

  return (
    <div className={newThemeEnabled ? "theme-genz font-[Inter]" : "bg-gradient-kenya-night font-[Inter]"}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen text-slate-50"
        >
          <div className="radaa-shell py-6 md:py-8 lg:py-10">{children}</div>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
