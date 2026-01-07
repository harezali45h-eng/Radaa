"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useBoltLiveRadar } from "@/src/features/bolt/hooks/useBoltLiveRadar";
import type { BoltMatatuProfile } from "@/src/features/bolt/types";

const TinderGallery = dynamic(
  () => import("@/src/features/bolt/components/TinderGallery"),
  { ssr: false },
);

export default function BoltMatatuGalleryPage() {
  const router = useRouter();
  const { matatus, loading } = useBoltLiveRadar();

  const items: BoltMatatuProfile[] = useMemo(
    () => matatus.map((m) => ({ ...m })),
    [matatus],
  );

  const handleOpenOnMap = (id: string) => {
    router.push(`/track/${id}`);
  };

  const hasItems = items.length > 0;

  return (
    <div className="relative flex min-h-dvh flex-col text-xs text-slate-50">
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h1 className="text-lg font-semibold tracking-tight md:text-2xl">
            Matatu gallery
          </h1>
          <p className="mt-1 max-w-md text-[11px] text-slate-300 md:text-xs">
            Live gallery of matatus. Browse to explore the vehicles around you
            right now.
          </p>
        </div>
        {hasItems && (
          <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] text-slate-300">
            {items.length} online
          </span>
        )}
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-24 pt-2 md:pb-12">
        {loading && !hasItems && (
          <div className="w-full max-w-sm space-y-3 text-[11px] text-slate-400">
            <div className="h-6 w-36 animate-pulse rounded-full bg-slate-800/80" />
            <div className="h-64 animate-pulse rounded-3xl bg-slate-900/70" />
          </div>
        )}

        {!loading && !hasItems && (
          <div className="flex h-full w-full flex-col items-center justify-center text-center text-[11px] text-slate-400">
            <p>No nearby matatus to show right now.</p>
            <p className="mt-1">
              Kaa Radaa ujue mat yako iko wapi — check again in a few minutes.
            </p>
          </div>
        )}

        {hasItems && (
          <div className="w-full max-w-sm">
            <TinderGallery items={items} onOpenOnMap={handleOpenOnMap} />
          </div>
        )}
      </main>
    </div>
  );
}
