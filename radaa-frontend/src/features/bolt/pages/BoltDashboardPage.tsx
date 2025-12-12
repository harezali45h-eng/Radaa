"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRealtime } from "@/context/realtimeContext";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";
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

const MAP_TILE_IMAGE = process.env.NEXT_PUBLIC_BOLT_MAP_TILE_URL || "";
const GALLERY_TILE_IMAGE =
  process.env.NEXT_PUBLIC_BOLT_GALLERY_TILE_URL || "";

const LiveRadarMap = dynamic(
  () => import("@/src/features/bolt/components/LiveRadarMap"),
  { ssr: false },
);

const TinderGallery = dynamic(
  () => import("@/src/features/bolt/components/TinderGallery"),
  { ssr: false },
);

export default function BoltDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeMode } = useRealtime();
  const liveOnlyMapEnabled = useIsFeatureEnabled("ff_live_only_map", false);
  const [activeTab, setActiveTab] = useState<"map" | "gallery">("map");
  const [selectedMatatuId, setSelectedMatatuId] = useState<string | null>(null);
  const [routeMatatus, setRouteMatatus] = useState<BoltMatatuProfile[]>([]);
  const [selectedDestination, setSelectedDestination] =
    useState<BoltSuggestion | null>(null);

  const { requestRideTo, loading: rideRequestLoading } = useBoltRideRequest();

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

  const role = (user as any)?.role as string | undefined;
  const isDriver = role === "driver";

  const liveHref = liveOnlyMapEnabled
    ? "/map"
    : isDriver && activeMode === "driver"
      ? "/dashboard/driver/live"
      : "/dashboard/passenger/live";

  const galleryHref = "/dashboard/passenger/live";

  const hasSelectedDestination =
    selectedDestination != null && selectedDestination.location != null;

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
    setSelectedDestination(item);

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
    } else {
      setRouteMatatus([]);
    }
  };

  const handleRequestRide = async () => {
    if (!selectedDestination || !selectedDestination.location) {
      return;
    }

    const dest: BoltLatLng = selectedDestination.location;
    await requestRideTo(dest, { routeName: selectedDestination.primaryText });
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
        <p className="mt-2 text-[11px] text-slate-300">
          Radaa — Move Smart. Move In Sync.
        </p>
        <header className="mt-2 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold text-slate-50">
              Live radar
            </h1>
            <p className="text-[11px] text-slate-400">
              Bolt-style overview of live matatus and quick actions.
            </p>
          </div>
        </header>

        <section className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab("map");
              router.push(liveHref);
            }}
            className={`group relative flex h-32 flex-col justify-between overflow-hidden rounded-3xl border px-3 py-3 text-left text-xs transition-all duration-200 ease-snappy sm:h-40 ${
              activeTab === "map"
                ? "border-emerald-400/70 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.55),transparent),radial-gradient(circle_at_100%_100%,rgba(16,185,129,0.6),transparent)] shadow-glow-mint"
                : "border-slate-800/80 bg-[radial-gradient(circle_at_0%_0%,rgba(15,23,42,0.9),transparent),radial-gradient(circle_at_100%_100%,rgba(15,23,42,0.9),transparent)] opacity-80 hover:opacity-100 hover:border-emerald-400/60"
            }`}
          >
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-100/90">
                Maps
              </div>
              <div className="mt-1 text-[11px] text-slate-100/90">
                Watch matatus move live on the city map.
              </div>
            </div>
            <div className="mt-2 flex items-end justify-between gap-2">
              <div className="text-[10px] text-emerald-100/90">
                {matatus.length} online
              </div>
              {MAP_TILE_IMAGE && (
                <div className="relative h-12 w-16 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={MAP_TILE_IMAGE}
                    alt="Live map preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("gallery");
              router.push(galleryHref);
            }}
            className={`group relative flex h-32 flex-col justify-between overflow-hidden rounded-3xl border px-3 py-3 text-left text-xs transition-all duration-200 ease-snappy sm:h-40 ${
              activeTab === "gallery"
                ? "border-amber-300/80 bg-[radial-gradient(circle_at_0%_0%,rgba(251,191,36,0.55),transparent),radial-gradient(circle_at_100%_100%,rgba(248,250,252,0.08),transparent)] shadow-soft"
                : "border-slate-800/80 bg-[radial-gradient(circle_at_0%_0%,rgba(15,23,42,0.9),transparent),radial-gradient(circle_at_100%_100%,rgba(15,23,42,0.9),transparent)] opacity-80 hover:opacity-100 hover:border-amber-300/70"
            }`}
          >
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-100/90">
                Gallery
              </div>
              <div className="mt-1 text-[11px] text-slate-100/90">
                Swipe through rich matatu profiles and photos.
              </div>
            </div>
            <div className="mt-2 flex items-end justify-between gap-2">
              <div className="text-[10px] text-slate-100/90">
                Smart Tinder-style cards
              </div>
              {GALLERY_TILE_IMAGE && (
                <div className="relative h-12 w-16 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={GALLERY_TILE_IMAGE}
                    alt="Matatu gallery preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </button>
        </section>

        <section className="mt-3 space-y-2">
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

        <WhereToBar
          inline
          onSelectSuggestion={handleSelectSuggestion}
          canRequestRide={hasSelectedDestination}
          onRequestRide={handleRequestRide}
          requesting={rideRequestLoading}
          selectedLabel={selectedDestination?.primaryText}
        />
      </main>

      <MatatuProfileSheet
        matatu={selectedProfile}
        onClose={() => setSelectedMatatuId(null)}
      />
    </div>
  );
}
