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

  const driversOnline = matatus.length;

  return (
    <div className="relative min-h-screen bg-slate-950 pb-24 pt-3">
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
      <main className="relative z-10 mx-auto flex max-w-md flex-col gap-4 px-3 sm:px-4">
        {/* Tagline header */}
        <header className="mt-1 rounded-3xl bg-gradient-to-r from-radaa-orange via-twilightPurple to-radaa-purple px-4 py-3 text-left text-slate-900 shadow-soft">
          <p className="text-[11px] font-semibold tracking-tight text-slate-50">
            Move Smart. Move in Sync.
          </p>
          <p className="mt-1 text-[10px] text-slate-100/80">
            See drivers around you in real time and line up your next trip.
          </p>
        </header>

        {/* Map & gallery as primary cards */}
        <section className="mt-1 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab("map");
              router.push(liveHref);
            }}
            className={`group relative flex h-32 flex-col justify-between overflow-hidden rounded-3xl border px-3 py-3 text-left text-xs transition-all duration-200 ease-snappy sm:h-40 ${
              activeTab === "map"
                ? "border-emerald-400/80 bg-[radial-gradient(circle_at_0%_0%,rgba(248,181,0,0.85),transparent),radial-gradient(circle_at_100%_100%,rgba(236,72,153,0.9),transparent)] shadow-glow-mint"
                : "border-slate-800/80 bg-[radial-gradient(circle_at_0%_0%,rgba(15,23,42,0.95),transparent),radial-gradient(circle_at_100%_100%,rgba(15,23,42,0.92),transparent)] opacity-85 hover:opacity-100 hover:border-emerald-400/70"
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
                {driversOnline} online
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
                ? "border-amber-300/80 bg-[radial-gradient(circle_at_0%_0%,rgba(248,181,0,0.9),transparent),radial-gradient(circle_at_100%_100%,rgba(236,72,153,0.85),transparent)] shadow-soft"
                : "border-slate-800/80 bg-[radial-gradient(circle_at_0%_0%,rgba(15,23,42,0.95),transparent),radial-gradient(circle_at_100%_100%,rgba(15,23,42,0.92),transparent)] opacity-85 hover:opacity-100 hover:border-amber-300/70"
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

        {/* Inline drivers online stat & gallery/list */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-950/60 px-3 py-2 text-[11px] text-slate-200">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-[11px] text-emerald-300">
                ●
              </span>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                  Drivers Online
                </div>
                <p className="text-[10px] text-slate-400">
                  Live drivers currently visible on the map.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end text-right text-[11px]">
              <span className="text-emerald-300">
                {driversOnline}
              </span>
              <span className="text-[10px] text-slate-500">drivers</span>
            </div>
          </div>

          {activeTab === "gallery" && (
            <TinderGallery items={galleryItems} onOpenOnMap={handleOpenOnMap} />
          )}
        </section>

        {/* Where To search with default chips */}
        <section className="mt-1 space-y-2">
          <WhereToBar
            inline
            onSelectSuggestion={handleSelectSuggestion}
            canRequestRide={hasSelectedDestination}
            onRequestRide={handleRequestRide}
            requesting={rideRequestLoading}
            selectedLabel={selectedDestination?.primaryText}
          />

          <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
            {[
              { id: "default-cbd", primaryText: "CBD" },
              { id: "default-nyayo", primaryText: "Nyayo" },
              { id: "default-donholm", primaryText: "Donholm" },
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  void handleSelectSuggestion({
                    ...preset,
                  } as BoltSuggestion)
                }
                className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-soft transition hover:border-emerald-400/70 hover:text-emerald-200"
              >
                {preset.primaryText}
              </button>
            ))}
          </div>
        </section>
      </main>

      <MatatuProfileSheet
        matatu={selectedProfile}
        onClose={() => setSelectedMatatuId(null)}
      />
    </div>
  );
}
