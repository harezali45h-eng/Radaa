"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRealtime } from "@/context/realtimeContext";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";
import { useRideIntent } from "@/context/RideIntentContext";
import { useBoltLiveRadar } from "@/src/features/bolt/hooks/useBoltLiveRadar";
import { useBoltRideRequest } from "@/src/features/bolt/hooks/useBoltRideRequest";
import type {
  BoltLatLng,
  BoltMatatuProfile,
  BoltSuggestion,
} from "@/src/features/bolt/types";
import { getRouteMatatus } from "@/src/features/bolt/api/boltApi";
import { boltCardClass, boltPrimaryButtonClass } from "@/src/features/bolt/utils/theme";
import MatatuProfileSheet from "@/src/features/bolt/components/MatatuProfileSheet";
import WhereToBar from "@/src/features/bolt/components/WhereToBar";

import "@/src/features/bolt/styles/theme.css";

const GALLERY_TILE_IMAGE =
  process.env.NEXT_PUBLIC_BOLT_GALLERY_TILE_URL || "";

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

  const { intent, setIntent } = useRideIntent();

  const {
    matatus,
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

  const galleryHref = "/gallery";

  const hasSelectedDestination = intent.destination != null;

  const selectedProfile: BoltMatatuProfile | null = useMemo(() => {
    if (!selectedMatatuId) return null;
    const fromRoute = routeMatatus.find((m) => m.id === selectedMatatuId);
    if (fromRoute) return fromRoute;
    const fromLive = matatus.find((m) => m.id === selectedMatatuId);
    return fromLive ? { ...fromLive } : null;
  }, [selectedMatatuId, routeMatatus, matatus]);

  const handleSelectSuggestion = async (item: BoltSuggestion) => {
    setSelectedDestination(item);

    if (item.location) {
      setIntent({
        destination: item.location,
        label: item.primaryText,
      });
    } else {
      setIntent({
        destination: null,
        label: item.primaryText || null,
      });
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
    } else {
      setRouteMatatus([]);
    }
  };

  const handleRequestRide = async () => {
    if (!intent.destination) {
      return;
    }

    const dest: BoltLatLng = intent.destination;
    const routeName =
      selectedDestination?.primaryText ?? intent.label ?? undefined;

    await requestRideTo(dest, { routeName });
  };

  const handleOpenOnMap = (id: string) => {
    setSelectedMatatuId(id);
    setActiveTab("map");
  };

  const driversOnline = matatus.length;

  return (
    <div className="min-h-dvh pb-20 pt-3">
      <main className="mx-auto flex max-w-md flex-col gap-4 px-3 sm:px-4">
        {/* Tagline header */}
        <header className="mt-2 text-left">
          <h1 className="text-lg font-semibold tracking-tight text-slate-50">
            Live matatus, at a glance
          </h1>
          <p className="mt-1 text-[11px] text-slate-400">
            A calm live view to time your next ride.
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
            className={`group ${boltCardClass} relative flex h-32 flex-col justify-between overflow-hidden px-3 py-3 text-left text-xs transition-transform duration-200 ease-snappy hover:-translate-y-1 hover:scale-[1.01] sm:h-40 ${
              activeTab === "map"
                ? "border-emerald-400/80 bg-[radial-gradient(circle_at_0%_0%,rgba(255,138,0,0.85),transparent),radial-gradient(circle_at_100%_100%,rgba(184,76,255,0.9),transparent)] shadow-glow-mint"
                : "bg-[radial-gradient(circle_at_0%_0%,rgba(9,20,26,0.95),transparent),radial-gradient(circle_at_100%_100%,rgba(9,20,26,0.92),transparent)] opacity-85 hover:opacity-100 hover:border-emerald-400/70"
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
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("gallery");
              router.push(galleryHref);
            }}
            className={`group ${boltCardClass} h-32 text-xs transition-transform duration-200 ease-snappy hover:-translate-y-1 hover:scale-[1.01] sm:h-40 ${
              activeTab === "gallery" ? "shadow-glow-kenya" : "opacity-85"
            }`}
          >
            <div className="relative z-10 flex h-full flex-col justify-between px-3 py-3 text-left">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-100/90">
                  Gallery
                </div>
                <div className="mt-1 text-[11px] text-slate-100/90">
                  Browse rich matatu profiles and photos.
                </div>
              </div>
              <div className="mt-2 flex items-end justify-between gap-2">
                <div className="text-[10px] text-slate-100/90">
                  Route-ready gallery view
                </div>
                {GALLERY_TILE_IMAGE && (
                  <div className="relative h-12 w-16 overflow-hidden rounded-2xl border border-white/15 bg-slate-950/40 shadow-glass-elevated group-hover:border-genz-accent/70">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={GALLERY_TILE_IMAGE}
                      alt="Matatu gallery preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
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
            selectedLabel={
              selectedDestination?.primaryText ?? intent.label ?? undefined
            }
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
