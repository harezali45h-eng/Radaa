"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useBoltLiveRadar } from "@/src/features/bolt/hooks/useBoltLiveRadar";
import { useBoltRideRequest } from "@/src/features/bolt/hooks/useBoltRideRequest";
import type {
  BoltBounds,
  BoltLatLng,
  BoltMatatuProfile,
  BoltSuggestion,
} from "@/src/features/bolt/types";
import { getRouteMatatus } from "@/src/features/bolt/api/boltApi";
import { boltCardClass, boltPrimaryButtonClass } from "@/src/features/bolt/utils/theme";
import MatatuProfileSheet from "@/src/features/bolt/components/MatatuProfileSheet";
import WhereToBar from "@/src/features/bolt/components/WhereToBar";

import "@/src/features/bolt/styles/theme.css";

const LiveRadarMap = dynamic(
  () => import("@/src/features/bolt/components/LiveRadarMap"),
  { ssr: false },
);

const TinderGallery = dynamic(
  () => import("@/src/features/bolt/components/TinderGallery"),
  { ssr: false },
);

export default function BoltDashboardPage() {
  const [activeTab, setActiveTab] = useState<"map" | "gallery">("map");
  const [selectedMatatuId, setSelectedMatatuId] = useState<string | null>(null);
  const [routeMatatus, setRouteMatatus] = useState<BoltMatatuProfile[]>([]);

  const { requestRideTo } = useBoltRideRequest();

  const {
    matatus,
    displayPositions,
    bounds,
    setBounds,
    loading,
  } = useBoltLiveRadar();

  const galleryItems: BoltMatatuProfile[] = useMemo(() => {
    if (routeMatatus.length > 0) return routeMatatus;
    return matatus.map((m) => ({ ...m }));
  }, [matatus, routeMatatus]);

  const selectedProfile: BoltMatatuProfile | null = useMemo(() => {
    if (!selectedMatatuId) return null;
    const fromRoute = routeMatatus.find((m) => m.id === selectedMatatuId);
    if (fromRoute) return fromRoute;
    const fromLive = matatus.find((m) => m.id === selectedMatatuId);
    return fromLive ? { ...fromLive } : null;
  }, [selectedMatatuId, routeMatatus, matatus]);

  const handleBoundsChange = (next: BoltBounds | null) => {
    setBounds(next);
  };

  const handleSelectSuggestion = async (item: BoltSuggestion) => {
    if (item.location) {
      const dest: BoltLatLng = item.location;
      await requestRideTo(dest, { routeName: item.primaryText });
    }

    if (item.type === "route" && (item.routeId || item.id)) {
      const routeId = item.routeId || item.id;
      try {
        const data = await getRouteMatatus(routeId);
        setRouteMatatus(data);
        if (data.length > 0) {
          setSelectedMatatuId(data[0].id);
          setActiveTab("gallery");
        }
      } catch {
        setRouteMatatus([]);
      }
    }
  };

  const handleOpenOnMap = (id: string) => {
    setSelectedMatatuId(id);
    setActiveTab("map");
  };

  const handleSelectMatatuOnMap = (id: string) => {
    setSelectedMatatuId(id);
    setActiveTab("gallery");
  };

  return (
    <div className="relative min-h-screen bg-radaa-bg pb-24 pt-4">
      {/* Map background */}
      <LiveRadarMap
        matatus={matatus}
        displayPositions={displayPositions}
        bounds={bounds}
        onBoundsChange={handleBoundsChange}
        onSelectMatatu={handleSelectMatatuOnMap}
        focusedMatatuId={selectedMatatuId}
        loading={loading}
      />

      {/* Foreground content */}
      <main className="relative z-10 mx-auto flex max-w-md flex-col gap-3 px-3 sm:px-4">
        <header className="mt-2 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold text-slate-50">
              Live radar
            </h1>
            <p className="text-[11px] text-slate-400">
              Bolt-style overview of live matatus and quick actions.
            </p>
          </div>
          <button
            type="button"
            className={`${boltPrimaryButtonClass} hidden sm:inline-flex`}
          >
            Request ride
          </button>
        </header>

        <section className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("map")}
            className={`flex-1 rounded-[20px] px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === "map"
                ? "bg-genz-accent text-slate-950 shadow-glow-mint"
                : "bg-slate-900/80 text-slate-200 border border-slate-800"
            }`}
          >
            Maps
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("gallery")}
            className={`flex-1 rounded-[20px] px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === "gallery"
                ? "bg-genz-accent-yellow text-slate-950 shadow-soft"
                : "bg-slate-900/80 text-slate-200 border border-slate-800"
            }`}
          >
            Gallery
          </button>
        </section>

        <section className="mt-1 space-y-2">
          {activeTab === "map" && (
            <div className={`${boltCardClass} border-slate-800/80 bg-slate-950/80 p-3 text-[11px] text-slate-300`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-100">
                    Live map
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Tap a matatu to open its profile and card gallery.
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-500">
                  {matatus.length} online
                </div>
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <TinderGallery items={galleryItems} onOpenOnMap={handleOpenOnMap} />
          )}
        </section>
      </main>

      <MatatuProfileSheet
        matatu={selectedProfile}
        onClose={() => setSelectedMatatuId(null)}
      />

      <WhereToBar onSelectSuggestion={handleSelectSuggestion} />
    </div>
  );
}
