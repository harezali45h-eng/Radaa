"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { getLiveMatatus, getMapMarkers, getStagesGeoJson } from "@/lib/api";
import MapContainer from "@/components/map/MapContainer";
import GoogleMapContainer from "@/components/map/GoogleMapContainer";
import { useRealtime } from "@/context/realtimeContext";
import { useFeatureFlags, useIsFeatureEnabled } from "@/context/FeatureFlagContext";
import { useGoogleMaps } from "@/context/GoogleMapsContext";
import { useAuth } from "@/context/AuthContext";
import {
  searchRoutes,
  getMatatusOnRoute,
  type RouteSearchResult,
  type RouteMatatu,
} from "@/lib/api/routes";
import {
  buildRouteBetweenStages as buildRouteBetweenStagesGeo,
  findNearestStage as findNearestStageGeo,
  isNearStageOrCorridor as isNearStageOrCorridorGeo,
} from "@/lib/location/stageRouting";
import { useBoltLiveRadar } from "@/src/features/bolt/hooks/useBoltLiveRadar";
import type {
  BoltBounds,
  BoltMatatuProfile,
} from "@/src/features/bolt/types";
import {
  createLiveRequest,
  getActiveLiveRequest,
  LiveRequestError,
  type LiveRequest,
} from "@/lib/api/liveRequests";

const TinderGallery = dynamic(
  () => import("@/src/features/bolt/components/TinderGallery"),
  { ssr: false },
);

interface LatLng {
  lat: number;
  lng: number;
}

interface Matatu {
  id: string;
  plate?: string;
  numberPlate?: string;
  route?: string;
  location?: LatLng | null;
  status?: string;
  sacco?: string;
  driverName?: string;
  driverPhone?: string;
  mainPhotoUrl?: string | null;
  rating?: {
    avgRating: number;
    count: number;
  };
  updatedAt?: string;
  isTracked?: boolean;
}

interface PassengerMarker {
  id: string;
  location: LatLng;
}

interface StagePoint {
  id: string;
  name: string | null;
  lat: number;
  lng: number;
}

interface Corridor {
  id: string;
  name: string | null;
  coordinates: LatLng[];
}

interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface PickupStageInfo {
  stageId: string;
  stageName: string | null;
  lat: number;
  lng: number;
  corridorId: string | null;
}

type RiderStatus = "idle" | "waiting";

type RouteConfidence = "active_reliable" | "moving_slow" | "uncertain";

interface PlacesSuggestion {
  placeId: string;
  description: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

const PICKUP_STAGE_STORAGE_KEY = "radaa.pickupStage.v1";

function haversineDistanceMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return R * c;
}

export default function MapPage() {
  const { user, token } = useAuth();
  const { connect, on, off } = useSocket();
  const { driverOnline, setDriverOnline } = useRealtime();

  const uiRevampEnabled = useIsFeatureEnabled("ui_revamp_v1", false);
  const globalMapEnabled = useIsFeatureEnabled("global_map_v1", false);
  const liveOnlyMapEnabled = useIsFeatureEnabled("ff_live_only_map", false);
  const { flags } = useFeatureFlags();

  const { isLoaded: mapsLoaded, apiKey } = useGoogleMaps();

  const role = (user as any)?.role as string | undefined;
  const isDriver = role === "driver";
  const mapDriverMode = isDriver && driverOnline;

  const [matatus, setMatatus] = useState<Matatu[]>([]);
  const [passengers, setPassengers] = useState<PassengerMarker[]>([]);
  const [selectedMatatuId, setSelectedMatatuId] = useState<string | null>(null);
  const [displayPositions, setDisplayPositions] = useState<
    Record<string, LatLng>
  >({});
  const targetPositionsRef = useRef<Record<string, LatLng>>({});
  const motionHistoryRef = useRef<
    Record<
      string,
      {
        last: LatLng;
        prev: LatLng | null;
        lastTimestamp: number;
        prevTimestamp: number | null;
      }
    >
  >({});
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [routeQuery, setRouteQuery] = useState("");
  const [routeResults, setRouteResults] = useState<RouteSearchResult[]>([]);
  const [routeSearchLoading, setRouteSearchLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteSearchResult | null>(
    null,
  );
  const [routeMatatus, setRouteMatatus] = useState<Matatu[]>([]);
  const [loadingRouteMatatus, setLoadingRouteMatatus] = useState(false);

  const [destinationQuery, setDestinationQuery] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    PlacesSuggestion[]
  >([]);
  const [destinationPlaceId, setDestinationPlaceId] = useState<string | null>(
    null,
  );
  const [destinationDescription, setDestinationDescription] = useState("");
  const [destinationLatLng, setDestinationLatLng] = useState<LatLng | null>(
    null,
  );
  const [riderStatus, setRiderStatus] = useState<RiderStatus>("idle");
  const [activeLiveRequest, setActiveLiveRequest] =
    useState<LiveRequest | null>(null);

  const [stages, setStages] = useState<StagePoint[]>([]);
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [pickupStage, setPickupStage] = useState<PickupStageInfo | null>(null);
  const [manualStageId, setManualStageId] = useState<string | null>(null);
  const [showStageSelector, setShowStageSelector] = useState(false);
  const [activeStageRoute, setActiveStageRoute] =
    useState<{
      originStageId: string;
      destinationStageId: string;
      corridorId: string | null;
      path: LatLng[];
    } | null>(null);
  const [discoveryMatatus, setDiscoveryMatatus] = useState<Matatu[]>([]);
  const [discoveryPassengers, setDiscoveryPassengers] = useState<
    PassengerMarker[]
  >([]);
  const [walkingPath, setWalkingPath] = useState<LatLng[] | null>(null);
  const [walkingEtaMinutes, setWalkingEtaMinutes] = useState<number | null>(
    null,
  );
  const [walkingStageName, setWalkingStageName] = useState<string | null>(null);

  const destinationSearchEnabled = useMemo(() => {
    if (!flags) {
      return false;
    }

    const entry = flags["ff_destination_search_v1"];
    if (!entry) {
      return false;
    }

    return Boolean(entry.enabled);
  }, [flags]);

  useEffect(() => {
    let cancelled = false;

    const loadInitial = async () => {
      try {
        setLoading(true);

        let array: Matatu[] = [];

        try {
          const markers: any = await getMapMarkers();
          if (cancelled) return;

          const raw = Array.isArray(markers) ? markers : [];

          array = raw.map((m: any) => ({
            id: String(m.id ?? m._id ?? ""),
            plate: m.plate,
            numberPlate: m.numberPlate,
            route: m.route,
            sacco: m.sacco ?? undefined,
            driverName: m.driverName ?? undefined,
            driverPhone: m.driverPhone ?? undefined,
            location: m.location ?? null,
            status: "online",
            mainPhotoUrl: m.mainPhotoUrl ?? null,
            rating: m.rating,
          }));
        } catch {
          const data = await getLiveMatatus();
          if (cancelled) return;
          const raw = Array.isArray(data) ? (data as Matatu[]) : [];
          array = raw;
        }

        if (!cancelled) {
          setMatatus(array);
        }
      } catch {
        if (cancelled) return;
        setMatatus([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadInitial();

    connect();
    // eslint-disable-next-line no-console
    console.log("[map] connect realtime for map page");
    if (typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.log("[pax] subscribed to live drivers");
    }

    const handleMatatuUpdate = (payload: any) => {
      const updates: Matatu[] = Array.isArray(payload) ? payload : [payload];

      // eslint-disable-next-line no-console
      console.log("[map] matatus:live_update", { count: updates.length });

      setMatatus((current) => {
        const map = new Map<string, Matatu>();
        current.forEach((m) => {
          map.set(m.id, m);
        });

        updates.forEach((update) => {
          if (!update || !update.id) return;
          const existing = map.get(update.id) || { id: update.id };
          map.set(update.id, { ...existing, ...update });
        });

        return Array.from(map.values());
      });
    };

    const handleRideAssigned = (payload: any) => {
      if (!payload) return;

      const loc =
        payload.pickupLocation ||
        payload.location ||
        payload.passengerLocation ||
        null;

      if (!loc || typeof loc.lat !== "number" || typeof loc.lng !== "number") {
        return;
      }

      const id = String(
        payload.id || payload.rideId || `${loc.lat},${loc.lng},${Date.now()}`,
      );

      setPassengers((current) => {
        if (current.find((p) => p.id === id)) {
          return current;
        }

        return [...current, { id, location: { lat: loc.lat, lng: loc.lng } }];
      });
    };

    const handlePassengersUpdate = (payload: any) => {
      const updates = Array.isArray(payload) ? payload : [payload];

      setPassengers((current) => {
        const byId = new Map<string, PassengerMarker>(
          current.map((p) => [p.id, p]),
        );

        updates.forEach((update) => {
          if (!update) return;

          const lat =
            update.lat ??
            update.location?.lat ??
            update.pickupLocation?.lat ??
            update.passengerLocation?.lat;
          const lng =
            update.lng ??
            update.location?.lng ??
            update.pickupLocation?.lng ??
            update.passengerLocation?.lng;

          const rawId =
            update.passengerId ??
            update.id ??
            update.rideId ??
            update.requestId ??
            null;
          const id = rawId != null ? String(rawId) : undefined;

          if (!id) {
            return;
          }

          if (typeof lat !== "number" || typeof lng !== "number") {
            byId.delete(id);
            return;
          }

          byId.set(id, {
            id,
            location: { lat, lng },
          });
        });

        return Array.from(byId.values());
      });

      // eslint-disable-next-line no-console
      console.log("[map] passenger:live_update", { count: updates.length });
    };

    on("matatus:live_update", handleMatatuUpdate);
    on("drivers_live", handleMatatuUpdate as any);
    on("ride:assigned", handleRideAssigned);
    on("passenger:live_update", handlePassengersUpdate);

    return () => {
      cancelled = true;
      off("matatus:live_update", handleMatatuUpdate);
      off("drivers_live", handleMatatuUpdate as any);
      off("ride:assigned", handleRideAssigned);
      off("passenger:live_update", handlePassengersUpdate);
    };
  }, [connect, on, off]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.location.pathname.startsWith("/driver")) {
      // eslint-disable-next-line no-console
      console.error(
        "[rider] rider UI mounted on /driver; check routing configuration.",
      );
    }
  }, []);

  useEffect(() => {
    if (!token || isDriver) {
      setActiveLiveRequest(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const data = await getActiveLiveRequest(token);
        if (cancelled) return;

        if (data) {
          setActiveLiveRequest(data);

          const loc = data.location;
          if (
            loc &&
            typeof loc.lat === "number" &&
            typeof loc.lng === "number"
          ) {
            setUserLocation({ lat: loc.lat, lng: loc.lng });
          }

          setRiderStatus("waiting");
        } else {
          setActiveLiveRequest(null);
        }
      } catch {
        if (!cancelled) {
          setActiveLiveRequest(null);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [token, isDriver]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const data = await getStagesGeoJson();

        if (cancelled) {
          return;
        }

        const nextStages: StagePoint[] = [];
        const nextCorridors: Corridor[] = [];

        if (data && typeof data === "object") {
          const anyData = data as any;

          if (
            anyData.type === "FeatureCollection" &&
            Array.isArray(anyData.features)
          ) {
            anyData.features.forEach((feature: any, index: number) => {
              if (!feature || !feature.geometry) {
                return;
              }

              const geometry = feature.geometry;
              const props = feature.properties || {};

              if (
                geometry.type === "Point" &&
                Array.isArray(geometry.coordinates) &&
                geometry.coordinates.length === 2
              ) {
                const [lng, lat] = geometry.coordinates as [number, number];
                if (typeof lat === "number" && typeof lng === "number") {
                  const name =
                    typeof props.name === "string"
                      ? props.name
                      : typeof props.stage_name === "string"
                      ? props.stage_name
                      : null;
                  const id = String(
                    props.id ??
                      props._id ??
                      props["@id"] ??
                      feature.id ??
                      `stage-${index}`,
                  );
                  nextStages.push({ id, name, lat, lng });
                }
              } else if (
                geometry.type === "LineString" &&
                Array.isArray(geometry.coordinates)
              ) {
                const coords: LatLng[] = [];
                geometry.coordinates.forEach((coord: any) => {
                  if (
                    Array.isArray(coord) &&
                    coord.length === 2 &&
                    typeof coord[1] === "number" &&
                    typeof coord[0] === "number"
                  ) {
                    coords.push({ lat: coord[1], lng: coord[0] });
                  }
                });

                if (coords.length >= 2) {
                  const corridorId = String(
                    props.id ??
                      props._id ??
                      props["@id"] ??
                      feature.id ??
                      `corridor-${index}`,
                  );
                  const corridorName =
                    typeof props.route_name === "string"
                      ? props.route_name
                      : typeof props.road_name === "string"
                      ? props.road_name
                      : typeof props.name === "string"
                      ? props.name
                      : null;
                  nextCorridors.push({
                    id: corridorId,
                    name: corridorName,
                    coordinates: coords,
                  });
                }
              }
            });
          }
        }

        setStages(nextStages);
        setCorridors(nextCorridors);
      } catch (error) {
        if (typeof console !== "undefined") {
          // eslint-disable-next-line no-console
          console.error("[rider] Failed to load stages GeoJSON", error);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!uiRevampEnabled) {
      setRouteResults([]);
      return;
    }

    const query = routeQuery.trim();

    if (!query) {
      setRouteResults([]);
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      try {
        setRouteSearchLoading(true);
        const results = await searchRoutes(query);
        if (cancelled) return;
        setRouteResults(Array.isArray(results) ? results : []);
      } catch {
        if (cancelled) return;
        setRouteResults([]);
      } finally {
        if (!cancelled) {
          setRouteSearchLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [routeQuery, uiRevampEnabled]);

  const findNearestStage = useCallback(
    (point: LatLng | null | undefined): StagePoint | null =>
      findNearestStageGeo(point, stages),
    [stages],
  );

  const findNearestPickupStage = useCallback(
    (point: LatLng | null | undefined): PickupStageInfo | null => {
      const result = isNearStageOrCorridorGeo(point, stages, corridors);
      const stage = result.nearestStage;

      if (!stage) {
        return null;
      }

      return {
        stageId: stage.id,
        stageName: stage.name ?? null,
        lat: stage.lat,
        lng: stage.lng,
        corridorId: result.nearestCorridor ? result.nearestCorridor.id : null,
      };
    },
    [stages, corridors],
  );
  useEffect(() => {
    if (!uiRevampEnabled) {
      return;
    }

    if (!userLocation || stages.length === 0) {
      return;
    }

    // Don't override a manually selected stage.
    if (manualStageId) {
      return;
    }

    const nearest = findNearestPickupStage(userLocation);
    if (!nearest) {
      return;
    }

    setPickupStage((current) => {
      if (
        current &&
        current.stageId === nearest.stageId &&
        current.lat === nearest.lat &&
        current.lng === nearest.lng
      ) {
        return current;
      }
      return nearest;
    });

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          PICKUP_STAGE_STORAGE_KEY,
          JSON.stringify(nearest),
        );
      } catch {
        // ignore storage errors
      }
    }
  }, [
    uiRevampEnabled,
    userLocation,
    stages,
    corridors,
    manualStageId,
    findNearestPickupStage,
  ]);

  const isNearStageOrCorridor = useCallback(
    (
      point: LatLng | null | undefined,
    ): {
      valid: boolean;
      nearestStage: StagePoint | null;
      nearestCorridor: Corridor | null;
      distanceMeters: number;
    } =>
      isNearStageOrCorridorGeo(point, stages, corridors, {
        stageThresholdMeters: 200,
        corridorThresholdMeters: 200,
      }),
    [stages, corridors],
  );

  const buildRouteBetweenStages = useCallback(
    (
      originStage: StagePoint | null,
      destinationStage: StagePoint | null,
    ): {
      originStageId: string;
      destinationStageId: string;
      corridorId: string | null;
      path: LatLng[];
    } | null =>
      buildRouteBetweenStagesGeo(originStage, destinationStage, corridors),
    [corridors],
  );

  useEffect(() => {
    if (riderStatus !== "waiting") {
      setActiveStageRoute(null);
      setDiscoveryMatatus([]);
      setDiscoveryPassengers([]);
      return;
    }

    if (!userLocation || stages.length === 0) {
      return;
    }

    const originStage = findNearestStage(userLocation);
    const destinationStage = destinationLatLng
      ? findNearestStage(destinationLatLng)
      : null;

    const route = buildRouteBetweenStages(originStage, destinationStage);

    if (!route) {
      setActiveStageRoute(null);
      setDiscoveryMatatus([]);
      setDiscoveryPassengers([]);
      return;
    }

    setActiveStageRoute(route);

    const path = route.path;
    if (!Array.isArray(path) || path.length < 2) {
      setDiscoveryMatatus([]);
      setDiscoveryPassengers([]);
      return;
    }

    const matatuCount = Math.min(8, Math.max(4, Math.floor(path.length / 6)));
    const step = path.length / (matatuCount + 1);
    const syntheticMatatus: Matatu[] = [];

    for (let index = 1; index <= matatuCount; index += 1) {
      const pathIndex = Math.min(path.length - 1, Math.round(index * step));
      const location = path[pathIndex];
      syntheticMatatus.push({
        id: `sim-${route.corridorId ?? "corridor"}-${index}`,
        plate: `R-${index.toString().padStart(3, "0")}`,
        route: selectedRoute?.name,
        sacco: undefined,
        location,
        status: "online",
      });
    }

    const heatStages: StagePoint[] = [];
    path.forEach((point) => {
      const nearStage = findNearestStage(point);
      if (!nearStage) return;
      if (heatStages.find((s) => s.id === nearStage.id)) return;
      heatStages.push(nearStage);
    });

    const syntheticPassengers: PassengerMarker[] = heatStages.map(
      (stage, index) => ({
        id: `pax-${stage.id}-${index}`,
        location: {
          lat: stage.lat + (Math.random() - 0.5) * 0.001,
          lng: stage.lng + (Math.random() - 0.5) * 0.001,
        },
      }),
    );

    setDiscoveryMatatus(syntheticMatatus);
    setDiscoveryPassengers(syntheticPassengers);

    if (typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.log("[rider] route discovery mode activated", {
        matatus: syntheticMatatus.length,
        passengers: syntheticPassengers.length,
      });
    }
  }, [
    riderStatus,
    userLocation,
    destinationLatLng,
    stages,
    selectedRoute,
    buildRouteBetweenStages,
    findNearestStage,
  ]);

  useEffect(() => {
    if (!selectedRoute) {
      setRouteMatatus([]);
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        setLoadingRouteMatatus(true);
        const raw = await getMatatusOnRoute(selectedRoute._id, 150);
        if (cancelled) return;

        const mapped: Matatu[] = (Array.isArray(raw) ? raw : []).map(
          (m: RouteMatatu) => {
            const baseLocation =
              m.location &&
              typeof m.location.lat === "number" &&
              typeof m.location.lng === "number"
                ? { lat: m.location.lat, lng: m.location.lng }
                : null;

            const lastLocation =
              !baseLocation &&
              m.lastLocation &&
              Array.isArray(m.lastLocation.coordinates) &&
              m.lastLocation.coordinates.length === 2
                ? {
                    lat: m.lastLocation.coordinates[1],
                    lng: m.lastLocation.coordinates[0],
                  }
                : null;

            const location = baseLocation || lastLocation || null;

            return {
              id: String(m._id),
              plate: m.plate,
              route: m.route || selectedRoute.name,
              location,
              status: m.status || (m.isOnline ? "online" : "offline"),
            };
          },
        );

        setRouteMatatus(mapped);
      } catch {
        if (cancelled) return;
        setRouteMatatus([]);
      } finally {
        if (!cancelled) {
          setLoadingRouteMatatus(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [selectedRoute]);

  useEffect(() => {
    const now = Date.now();
    const nextTargets: Record<string, LatLng> = {};

    const history = motionHistoryRef.current;

    matatus.forEach((matatu) => {
      const loc = matatu.location;
      if (
        !loc ||
        typeof loc.lat !== "number" ||
        typeof loc.lng !== "number"
      ) {
        return;
      }

      const id = matatu.id;
      const existing = history[id];

      if (existing) {
        history[id] = {
          last: { lat: loc.lat, lng: loc.lng },
          prev: existing.last,
          lastTimestamp: now,
          prevTimestamp: existing.lastTimestamp,
        };
      } else {
        history[id] = {
          last: { lat: loc.lat, lng: loc.lng },
          prev: null,
          lastTimestamp: now,
          prevTimestamp: null,
        };
      }

      const h = history[id];
      let target = h.last;

      if (
        h.prev &&
        typeof h.prevTimestamp === "number" &&
        typeof h.lastTimestamp === "number" &&
        h.prevTimestamp > 0 &&
        h.lastTimestamp > h.prevTimestamp
      ) {
        const dtSeconds = (h.lastTimestamp - h.prevTimestamp) / 1000;

        if (dtSeconds > 0 && dtSeconds <= 60) {
          const latVelocity = (h.last.lat - h.prev.lat) / dtSeconds;
          const lngVelocity = (h.last.lng - h.prev.lng) / dtSeconds;

          const PREDICTION_SECONDS = 2;
          const candidate: LatLng = {
            lat: h.last.lat + latVelocity * PREDICTION_SECONDS,
            lng: h.last.lng + lngVelocity * PREDICTION_SECONDS,
          };

          const distanceMeters = haversineDistanceMeters(h.last, candidate);

          if (Number.isFinite(distanceMeters) && distanceMeters <= 120) {
            target = candidate;
          }
        }
      }

      nextTargets[id] = target;
    });

    targetPositionsRef.current = nextTargets;

    setDisplayPositions((prev) => {
      const next: Record<string, LatLng> = { ...prev };

      matatus.forEach((matatu) => {
        const loc = matatu.location;
        if (
          !loc ||
          typeof loc.lat !== "number" ||
          typeof loc.lng !== "number"
        ) {
          return;
        }

        if (!next[matatu.id]) {
          next[matatu.id] = {
            lat: loc.lat,
            lng: loc.lng,
          };
        }
      });

      return next;
    });
  }, [matatus]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let frameId: number | null = null;
    let lastTimestamp: number | null = null;

    const animate = (timestamp: number) => {
      if (lastTimestamp == null) {
        lastTimestamp = timestamp;
        frameId = window.requestAnimationFrame(animate);
        return;
      }

      const dtSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const targets = targetPositionsRef.current;
      const ids = Object.keys(targets);

      if (ids.length === 0 || dtSeconds <= 0) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }

      const SMOOTHING_SPEED = 4;
      const alpha = 1 - Math.exp(-SMOOTHING_SPEED * dtSeconds);

      if (alpha <= 0) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }

      setDisplayPositions((prev) => {
        if (!prev) {
          return prev;
        }

        let changed = false;
        const next: Record<string, LatLng> = { ...prev };

        ids.forEach((id) => {
          const target = targets[id];
          if (!target) return;

          const current = prev[id] ?? target;

          const latDelta = target.lat - current.lat;
          const lngDelta = target.lng - current.lng;

          if (Math.abs(latDelta) < 1e-7 && Math.abs(lngDelta) < 1e-7) {
            if (!prev[id]) {
              next[id] = target;
              changed = true;
            }
            return;
          }

          const lat = current.lat + latDelta * alpha;
          const lng = current.lng + lngDelta * alpha;

          next[id] = { lat, lng };
          changed = true;
        });

        return changed ? next : prev;
      });

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const bounds: Bounds | null = useMemo(() => {
    const locations: LatLng[] = [];

    matatus.forEach((m) => {
      if (
        m.location &&
        typeof m.location.lat === "number" &&
        typeof m.location.lng === "number"
      ) {
        locations.push(m.location);
      }
    });

    passengers.forEach((p) => {
      if (
        p.location &&
        typeof p.location.lat === "number" &&
        typeof p.location.lng === "number"
      ) {
        locations.push(p.location);
      }
    });

    if (userLocation) {
      locations.push(userLocation);
    }

    if (locations.length === 0) {
      return null;
    }

    let minLat = locations[0].lat;
    let maxLat = locations[0].lat;
    let minLng = locations[0].lng;
    let maxLng = locations[0].lng;

    locations.forEach((loc) => {
      if (loc.lat < minLat) minLat = loc.lat;
      if (loc.lat > maxLat) maxLat = loc.lat;
      if (loc.lng < minLng) minLng = loc.lng;
      if (loc.lng > maxLng) maxLng = loc.lng;
    });

    return { minLat, maxLat, minLng, maxLng };
  }, [matatus, passengers, userLocation]);

  const hasAnyLocation = useMemo(() => bounds !== null, [bounds]);

  const zoomLevelHint = useMemo(() => {
    if (!bounds) {
      return null;
    }

    const latRange = bounds.maxLat - bounds.minLat;
    const lngRange = bounds.maxLng - bounds.minLng;
    const span = Math.max(latRange, lngRange);

    const minSpan = 0.01;
    const maxSpan = 0.15;

    if (!Number.isFinite(span) || span <= 0) {
      return null;
    }

    const clampedSpan = Math.min(maxSpan, Math.max(minSpan, span));

    if (maxSpan === minSpan) {
      return 1;
    }

    const ratio = (clampedSpan - minSpan) / (maxSpan - minSpan);
    return 1 - ratio;
  }, [bounds]);

  const activeRoutePath = activeStageRoute?.path ?? null;

  const project = useCallback(
    (location: LatLng | undefined | null) => {
      if (!location || !bounds) {
        return { left: "50%", top: "50%" };
      }

      const latRange = Math.max(bounds.maxLat - bounds.minLat, 0.0001);
      const lngRange = Math.max(bounds.maxLng - bounds.minLng, 0.0001);

      const x = ((location.lng - bounds.minLng) / lngRange) * 100;
      const y = 100 - ((location.lat - bounds.minLat) / latRange) * 100;

      return {
        left: `${Math.min(100, Math.max(0, x))}%`,
        top: `${Math.min(100, Math.max(0, y))}%`,
      };
    },
    [bounds],
  );

  const selectedMatatu = useMemo(
    () => {
      if (!selectedMatatuId) {
        return null;
      }

      const live = matatus.find((m) => m.id === selectedMatatuId) || null;
      if (live) {
        return live;
      }

      const simulated =
        discoveryMatatus.find((m) => m.id === selectedMatatuId) || null;
      return simulated;
    },
    [matatus, discoveryMatatus, selectedMatatuId],
  );

  const selectedMatatuPhotoSrc = useMemo(() => {
    if (!selectedMatatu || !selectedMatatu.mainPhotoUrl) {
      return null;
    }

    const url = selectedMatatu.mainPhotoUrl;
    if (url.startsWith("http")) {
      return url;
    }

    return `${BACKEND_URL}${url}`;
  }, [selectedMatatu]);

  const {
    matatus: radarMatatus,
    setBounds: setRadarBounds,
  } = useBoltLiveRadar();

  useEffect(() => {
    if (!uiRevampEnabled) {
      return;
    }

    if (!pickupStage) {
      return;
    }

    const deltaLat = 0.01;
    const deltaLng = 0.01;

    const nextBounds: BoltBounds = {
      minLat: pickupStage.lat - deltaLat,
      maxLat: pickupStage.lat + deltaLat,
      minLng: pickupStage.lng - deltaLng,
      maxLng: pickupStage.lng + deltaLng,
    };

    setRadarBounds(nextBounds);
  }, [uiRevampEnabled, pickupStage, setRadarBounds]);

  const galleryItems: BoltMatatuProfile[] = useMemo(
    () => radarMatatus.map((m) => ({ ...m })),
    [radarMatatus],
  );

  const handleOpenOnMapFromGallery = useCallback(
    (id: string) => {
      if (typeof console !== "undefined") {
        // eslint-disable-next-line no-console
        console.log("[map] gallery open-on-map clicked", { id });
      }
    },
    [],
  );

  const baseMatatusForDisplay = useMemo(() => {
    if (!selectedRoute || routeMatatus.length === 0) {
      return matatus;
    }

    const byId = new Map<string, Matatu>();
    matatus.forEach((m) => {
      byId.set(m.id, m);
    });

    return routeMatatus.map((m) => {
      const existing = byId.get(m.id) || null;
      const location = m.location || existing?.location || null;
      return {
        ...existing,
        ...m,
        location,
      } as Matatu;
    });
  }, [matatus, routeMatatus, selectedRoute]);

  const matatusWithFlags = useMemo(
    () =>
      baseMatatusForDisplay.map((m) => ({
        ...m,
        isTracked: trackingId != null && m.id === trackingId,
      })),
    [baseMatatusForDisplay, trackingId],
  );

  const matatusWithFlagsForMap = useMemo(
    () =>
      matatusWithFlags.map((m) => {
        const override = displayPositions[m.id];

        if (
          override &&
          typeof override.lat === "number" &&
          typeof override.lng === "number"
        ) {
          return {
            ...m,
            location: override,
          };
        }

        return m;
      }),
    [matatusWithFlags, displayPositions],
  );

  const matatusForDisplay = useMemo(
    () => {
      const hasLiveMatatus = matatusWithFlags.some((m) => {
        const loc = m.location;
        return (
          !!loc &&
          typeof loc.lat === "number" &&
          typeof loc.lng === "number"
        );
      });

      if (
        riderStatus === "waiting" &&
        activeRoutePath &&
        discoveryMatatus.length > 0 &&
        !hasLiveMatatus
      ) {
        return discoveryMatatus;
      }

      return matatusWithFlags;
    },
    [
      riderStatus,
      activeRoutePath,
      discoveryMatatus,
      matatusWithFlags,
    ],
  );

  const matatusForMap = useMemo(
    () =>
      matatusForDisplay.map((m) => {
        const override = displayPositions[m.id];

        if (
          override &&
          typeof override.lat === "number" &&
          typeof override.lng === "number"
        ) {
          return {
            ...m,
            location: override,
          };
        }

        return m;
      }),
    [matatusForDisplay, displayPositions],
  );

  const passengersForDisplay = useMemo(
    () =>
      riderStatus === "waiting" &&
      activeRoutePath &&
      discoveryPassengers.length > 0
        ? discoveryPassengers
        : passengers,
    [riderStatus, activeRoutePath, discoveryPassengers, passengers],
  );

  const routePathForMap = useMemo(
    () => {
      if (
        riderStatus === "waiting" &&
        activeRoutePath &&
        activeRoutePath.length >= 2
      ) {
        return activeRoutePath;
      }

      if (walkingPath && walkingPath.length >= 2) {
        return walkingPath;
      }

      return null;
    },
    [riderStatus, activeRoutePath, walkingPath],
  );

  const heatmapPointsForMap = useMemo(
    () =>
      riderStatus === "waiting" && activeRoutePath
        ? discoveryPassengers.map((p) => p.location)
        : [],
    [riderStatus, activeRoutePath, discoveryPassengers],
  );

  const routeConfidenceForMap: RouteConfidence | null = useMemo(
    () => {
      if (!routePathForMap) {
        return null;
      }

      const liveMatatusOnMap = matatusForMap.filter((m) => {
        const loc = m.location;
        return (
          !!loc &&
          typeof loc.lat === "number" &&
          typeof loc.lng === "number"
        );
      }).length;

      if (liveMatatusOnMap >= 2) {
        return "active_reliable";
      }

      if (
        liveMatatusOnMap === 1 ||
        (riderStatus === "waiting" &&
          activeRoutePath &&
          discoveryPassengers.length > 0)
      ) {
        return "moving_slow";
      }

      if (riderStatus === "waiting" && activeRoutePath) {
        return "uncertain";
      }

      return null;
    },
    [
      routePathForMap,
      matatusForMap,
      riderStatus,
      activeRoutePath,
      discoveryPassengers,
    ],
  );

  const routeStatusCopy = useMemo(() => {
    if (!routeConfidenceForMap) {
      return "";
    }

    if (routeConfidenceForMap === "active_reliable") {
      return "Matatus moving now";
    }

    if (routeConfidenceForMap === "moving_slow") {
      return "Some movement, may take time";
    }

    if (routeConfidenceForMap === "uncertain") {
      return "Route quiet right now";
    }

    return "";
  }, [routeConfidenceForMap]);

  const selectedMatatuEta = useMemo(() => {
    if (!selectedMatatu || !selectedMatatu.location || !userLocation) {
      return null;
    }

    const distanceMeters = haversineDistanceMeters(
      userLocation,
      selectedMatatu.location,
    );
    const speedKmh = 25;
    const etaMinutes = (distanceMeters / 1000 / speedKmh) * 60;

    return { distanceMeters, etaMinutes };
  }, [selectedMatatu, userLocation]);

  useEffect(() => {
    if (typeof console === "undefined") {
      return;
    }

    // eslint-disable-next-line no-console
    console.log("[map] matatus rendered: %d", matatusForDisplay.length);
    // eslint-disable-next-line no-console
    console.log("[map] pax markers rendered: %d", passengersForDisplay.length);
  }, [matatusForDisplay, passengersForDisplay]);

  useEffect(() => {
    const query = destinationQuery.trim();

    if (!destinationSearchEnabled || !apiKey || query.length < 3) {
      setDestinationSuggestions([]);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const fetchSuggestions = async () => {
      try {
        const params = new URLSearchParams({
          input: query,
          key: apiKey,
          components: "country:ke",
        });

        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          if (!cancelled) {
            setDestinationSuggestions([]);
          }
          return;
        }

        const json = (await response.json()) as any;
        if (cancelled) return;

        const predictions = Array.isArray(json?.predictions)
          ? json.predictions
          : [];

        setDestinationSuggestions(
          predictions.map((p: any) => ({
            placeId: String(p.place_id ?? ""),
            description: String(p.description ?? ""),
          })),
        );
      } catch (error: any) {
        if (cancelled || error?.name === "AbortError") {
          return;
        }
        setDestinationSuggestions([]);
      }
    };

    void fetchSuggestions();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [apiKey, destinationQuery, destinationSearchEnabled]);

  const handleSelectMatatu = useCallback((id: string) => {
    setSelectedMatatuId(id);
  }, []);

  const handleCenterOnMe = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGeoError("Location is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGeoError(null);
      },
      (error) => {
        const code =
          error && typeof error.code === "number" ? (error.code as number) : 0;

        let message: string;
        if (code === 1) {
          message =
            "Location access is blocked. Please allow location for Radaa in your browser settings and try again.";
        } else if (code === 2) {
          message =
            "We couldn't get a GPS fix. Check that location is turned on and you have a good network signal.";
        } else if (code === 3) {
          message =
            "It is taking a bit long to find you. Move closer to a window or check your network, then try again.";
        } else {
          message = error?.message || "Unable to fetch your current location.";
        }

        setGeoError(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  useEffect(() => {
    if (!uiRevampEnabled) {
      return;
    }

    if (userLocation) {
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      setGeoError("Location is not available in this browser.");
      setShowStageSelector(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGeoError(null);
      },
      (error) => {
        const code =
          error && typeof error.code === "number" ? (error.code as number) : 0;

        let message: string;
        if (code === 1) {
          message =
            "Location access is blocked. Please allow location for Radaa in your browser settings and try again.";
        } else if (code === 2) {
          message =
            "We couldn't get a GPS fix. Check that location is turned on and you have a good network signal.";
        } else if (code === 3) {
          message =
            "It is taking a bit long to find you. Move closer to a window or check your network, then try again.";
        } else {
          message = error?.message || "Unable to fetch your current location.";
        }

        setGeoError(message);

        if (typeof window !== "undefined") {
          try {
            const raw = window.localStorage.getItem(PICKUP_STAGE_STORAGE_KEY);
            if (raw) {
              const parsed = JSON.parse(raw) as PickupStageInfo;
              if (
                parsed &&
                typeof parsed.lat === "number" &&
                typeof parsed.lng === "number" &&
                parsed.stageId
              ) {
                setPickupStage(parsed);
                setManualStageId(parsed.stageId);
                return;
              }
            }
          } catch {
            // ignore storage errors
          }
        }

        setShowStageSelector(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }, [uiRevampEnabled, userLocation]);

  const handleRequestMatatuNearestStage = () => {
    if (!pickupStage) {
      setGeoError(
        "We couldn't detect your nearest stage yet. Wait a few seconds or choose a stage manually.",
      );
      return;
    }

    if (typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.log("[map] request-nearest-stage clicked", {
        pickupStageId: pickupStage.stageId,
        pickupStageName: pickupStage.stageName,
      });
    }

    setWalkingPath(null);
    setWalkingEtaMinutes(null);
    setWalkingStageName(null);
    setGeoError(null);

    if (!userLocation) {
      setGeoError(
        "We are still determining your exact location. Please try again in a moment.",
      );
      return;
    }

    if (!token) {
      setGeoError("You need to be signed in to request a matatu.");
      return;
    }

    setRiderStatus("waiting");

    const location = {
      lat: userLocation.lat,
      lng: userLocation.lng,
    };

    void (async () => {
      try {
        const live = await createLiveRequest(location, token);
        setActiveLiveRequest(live);
      } catch (error: any) {
        if (error instanceof LiveRequestError && error.code === "OUT_OF_RANGE") {
          setGeoError(
            "You're a bit off the matatu route. Walk to the nearest stage to continue.",
          );
        } else {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to request a matatu. Please try again.";
          setGeoError(message);
        }

        setRiderStatus("idle");
        setActiveLiveRequest(null);
      }
    })();
  };

  const handleRequestMatatu = () => {
    const description =
      destinationDescription.trim() || destinationQuery.trim();

    if (typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.log("[map] where-to clicked", description);
    }

    if (!description) {
      setGeoError("Set your destination first to request a matatu.");
      if (typeof console !== "undefined") {
        // eslint-disable-next-line no-console
        console.error("[map] where-to clicked with empty destination");
      }
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      setGeoError(
        "Location is not available in this browser. Turn on location or try a different device.",
      );
      if (typeof console !== "undefined") {
        // eslint-disable-next-line no-console
        console.error(
          "[map] where-to clicked but geolocation is unavailable",
        );
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pickup = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const validity = isNearStageOrCorridor(pickup);

        if (!validity.valid) {
          const nearestStage = validity.nearestStage ?? null;

          setUserLocation(pickup);
          setRiderStatus("idle");
          setTrackingId(null);

          if (nearestStage) {
            const stagePoint: LatLng = {
              lat: nearestStage.lat,
              lng: nearestStage.lng,
            };
            setWalkingPath([pickup, stagePoint]);

            const distanceMeters = haversineDistanceMeters(pickup, stagePoint);
            const walkingSpeedMps = 1.4;
            const etaMinutes = Number.isFinite(distanceMeters)
              ? Math.max(
                  1,
                  Math.round((distanceMeters / walkingSpeedMps) / 60),
                )
              : null;

            setWalkingEtaMinutes(etaMinutes);
            setWalkingStageName(
              nearestStage.name || "nearest stage",
            );
          } else {
            setWalkingPath(null);
            setWalkingEtaMinutes(null);
            setWalkingStageName(null);
          }

          setGeoError(
            "You're a bit off the matatu route. Walk to the nearest stage to continue.",
          );

          if (typeof console !== "undefined") {
            // eslint-disable-next-line no-console
            console.log("[pax] request blocked – off corridor", {
              pickup,
              nearestStageName: nearestStage?.name ?? null,
            });
          }

          return;
        }

        setWalkingPath(null);
        setWalkingEtaMinutes(null);
        setWalkingStageName(null);
        if (selectedRoute) {
          setTrackingId(null);
        }

        setUserLocation(pickup);
        setGeoError(null);

        if (!token) {
          setGeoError("You need to be signed in to request a matatu.");
          setRiderStatus("idle");
          return;
        }

        setRiderStatus("waiting");

        void (async () => {
          try {
            const live = await createLiveRequest(pickup, token);
            setActiveLiveRequest(live);
          } catch (error: any) {
            if (
              error instanceof LiveRequestError &&
              error.code === "OUT_OF_RANGE"
            ) {
              setGeoError(
                "You're a bit off the matatu route. Walk to the nearest stage to continue.",
              );
            } else {
              const message =
                error instanceof Error
                  ? error.message
                  : "Failed to request a matatu. Please try again.";
              setGeoError(message);
            }

            setRiderStatus("idle");
            setActiveLiveRequest(null);
          }
        })();
      },
      (error) => {
        const code =
          error && typeof error.code === "number" ? (error.code as number) : 0;

        let message: string;
        if (code === 1) {
          message =
            "Location access is blocked. Please allow location for Radaa in your browser settings and try again.";
        } else if (code === 2) {
          message =
            "We couldn't get a GPS fix. Check that location is turned on and you have a good network signal.";
        } else if (code === 3) {
          message =
            "It is taking a bit long to find you. Move closer to a window or check your network, then try again.";
        } else {
          message = error?.message || "Unable to fetch your current location.";
        }

        setGeoError(message);
        if (typeof console !== "undefined") {
          // eslint-disable-next-line no-console
          console.error("[map] where-to geolocation error", { code, error });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );

    void (async () => {
      try {
        const routes = await searchRoutes(description);
        if (Array.isArray(routes) && routes.length > 0) {
          const top = routes[0];
          setSelectedRoute(top);
          setRouteQuery(top.name);
        } else if (typeof console !== "undefined") {
          // eslint-disable-next-line no-console
          console.error("[map] where-to searchRoutes returned no routes", {
            description,
          });
        }
      } catch (error) {
        if (typeof console !== "undefined") {
          // eslint-disable-next-line no-console
          console.error("[map] where-to searchRoutes failed", {
            description,
            error,
          });
        }
      }
    })();
  };

  const totalMatatus = matatusForDisplay.length;
  const totalPassengers = passengersForDisplay.length;

  if (!uiRevampEnabled) {
    if (liveOnlyMapEnabled) {
      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          {globalMapEnabled ? (
            <GoogleMapContainer
              matatus={matatusForMap}
              passengers={passengersForDisplay}
              userLocation={userLocation}
              onCenterOnMe={handleCenterOnMe}
              onSelectMatatu={handleSelectMatatu}
              isLoading={loading}
              hasAnyLocation={hasAnyLocation}
              driverMode={mapDriverMode}
              routePath={routePathForMap ?? undefined}
              routeConfidence={routeConfidenceForMap}
              heatmapPoints={heatmapPointsForMap}
              heatmapEnabled={riderStatus === "waiting"}
            />
          ) : (
            <MapContainer
              matatus={matatusForDisplay}
              passengers={passengersForDisplay}
              userLocation={userLocation}
              displayPositions={displayPositions}
              project={project}
              onCenterOnMe={handleCenterOnMe}
              onSelectMatatu={handleSelectMatatu}
              isLoading={loading}
              hasAnyLocation={hasAnyLocation}
              driverMode={mapDriverMode}
              routePath={routePathForMap ?? undefined}
              routeConfidence={routeConfidenceForMap}
              heatmapPoints={heatmapPointsForMap}
              heatmapEnabled={riderStatus === "waiting"}
              zoomLevelHint={zoomLevelHint ?? undefined}
            />
          )}
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <h1 className="text-lg font-semibold">Live Matatu Map</h1>
          <p className="mt-1 text-xs text-slate-300">
            Live view of matatus and nearby passengers. Positions are updated in
            real time.
          </p>
          {routeStatusCopy && (
            <p className="mt-1 text-[11px] text-slate-400">
              {routeStatusCopy}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between text-[11px]">
            {isDriver ? (
              <div className="inline-flex rounded-md border border-slate-700 bg-slate-950/60 p-0.5">
                <button
                  type="button"
                  onClick={() => setDriverOnline(false)}
                  className={`rounded-sm px-2 py-0.5 text-[11px] ${
                    !mapDriverMode
                      ? "bg-slate-800 text-slate-100"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  Passenger
                </button>
                <button
                  type="button"
                  onClick={() => setDriverOnline(true)}
                  className={`ml-1 rounded-sm px-2 py-0.5 text-[11px] ${
                    mapDriverMode
                      ? "bg-emerald-600/70 text-emerald-50"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  Driver
                </button>
              </div>
            ) : (
              <div className="inline-flex rounded-md border border-slate-700 bg-slate-950/60 px-2 py-0.5 text-[11px] text-slate-400">
                Passenger view
              </div>
            )}
            <span className="text-[10px] text-slate-400">
              Mode: {mapDriverMode ? "Driver" : "Passenger"}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px]">
            <input
              type="text"
              value={routeQuery}
              onChange={(event) => {
                setRouteQuery(event.target.value);
                setSelectedRoute(null);
              }}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="Search routes, e.g. CBD – Westlands"
            />
            {routeSearchLoading && (
              <span className="text-[10px] text-slate-400">Searching…</span>
            )}
          </div>

          {routeResults.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1 text-[10px]">
              {routeResults.map((route) => (
                <button
                  key={route._id}
                  type="button"
                  onClick={() => {
                    setSelectedRoute(route);
                    setRouteQuery(route.name);
                  }}
                  className={`rounded-full border px-2 py-0.5 transition ${
                    selectedRoute && selectedRoute._id === route._id
                      ? "border-sky-500 bg-sky-500/10 text-sky-200"
                      : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500"
                  }`}
                >
                  {route.name}
                </button>
              ))}
            </div>
          )}

          {globalMapEnabled ? (
            <GoogleMapContainer
              matatus={matatusWithFlagsForMap}
              passengers={passengers}
              userLocation={userLocation}
              onCenterOnMe={handleCenterOnMe}
              onSelectMatatu={handleSelectMatatu}
              isLoading={loading}
              hasAnyLocation={hasAnyLocation}
              driverMode={mapDriverMode}
            />
          ) : (
            <MapContainer
              matatus={matatusWithFlags}
              passengers={passengers}
              userLocation={userLocation}
              displayPositions={displayPositions}
              project={project}
              onCenterOnMe={handleCenterOnMe}
              onSelectMatatu={handleSelectMatatu}
              isLoading={loading}
              hasAnyLocation={hasAnyLocation}
              driverMode={mapDriverMode}
              zoomLevelHint={zoomLevelHint ?? undefined}
            />
          )}

          {geoError && (
            <p className="mt-2 text-[11px] text-amber-300">{geoError}</p>
          )}
        </div>

        <aside className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="text-base font-semibold">Matatu details</h2>
          {selectedMatatu ? (
            <div className="space-y-2 text-xs text-slate-200">
              {selectedMatatuPhotoSrc && (
                <div className="overflow-hidden rounded-md border border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedMatatuPhotoSrc}
                    alt="Matatu photo"
                    className="h-28 w-full object-cover"
                  />
                </div>
              )}
              <div>
                <span className="text-slate-400">Plate: </span>
                {selectedMatatu.plate ||
                  selectedMatatu.numberPlate ||
                  "Unknown"}
              </div>
              <div>
                <span className="text-slate-400">Route: </span>
                {selectedMatatu.route || "—"}
              </div>
              {selectedMatatu.driverName && (
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-100">
                    {selectedMatatu.driverName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-slate-400">Driver: </span>
                    {selectedMatatu.driverName}
                    {selectedMatatu.driverPhone && (
                      <span className="text-slate-500">
                        {" "}
                        · {selectedMatatu.driverPhone}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {selectedMatatu.sacco && (
                <div>
                  <span className="text-slate-400">SACCO: </span>
                  {selectedMatatu.sacco}
                </div>
              )}
              {selectedMatatu.rating && (
                <div>
                  <span className="text-slate-400">Rating: </span>
                  {selectedMatatu.rating.avgRating.toFixed(1)} ★ (
                  {selectedMatatu.rating.count})
                </div>
              )}
              <div>
                <span className="text-slate-400">Lat: </span>
                {selectedMatatu.location?.lat ?? "—"}
              </div>
              <div>
                <span className="text-slate-400">Lng: </span>
                {selectedMatatu.location?.lng ?? "—"}
              </div>
              {selectedMatatuEta && (
                <>
                  <div>
                    <span className="text-slate-400">Distance from you: </span>
                    {(selectedMatatuEta.distanceMeters / 1000).toFixed(1)} km
                  </div>
                  <div>
                    <span className="text-slate-400">ETA (25 km/h): </span>
                    {Math.round(selectedMatatuEta.etaMinutes)} min
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={() =>
                  setTrackingId((current) =>
                    selectedMatatu
                      ? current === selectedMatatu.id
                        ? null
                        : selectedMatatu.id
                      : current,
                  )
                }
                className="mt-2 inline-flex items-center rounded-md bg-sky-600 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm transition hover:bg-sky-500"
              >
                {trackingId === selectedMatatu.id
                  ? "Stop tracking"
                  : "Track this matatu"}
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Select a matatu marker on the map.
            </p>
          )}
        </aside>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-4">
      <header className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Live Matatu Map</h1>
          <p className="text-xs text-slate-300">
            See matatus moving in real time and tap a card below to track your
            ride.
          </p>
        </div>
        <div className="mt-2 flex flex-col items-stretch gap-2 text-[10px] text-slate-400 md:mt-0 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live now
            </span>
            <span>
              {totalMatatus} matatus · {totalPassengers} nearby riders
            </span>
          </div>
          {routeStatusCopy && (
            <p className="text-[10px] text-slate-400">
              {routeStatusCopy}
            </p>
          )}
          <div className="flex items-center gap-2 md:min-w-[240px]">
            <input
              type="text"
              value={routeQuery}
              onChange={(event) => {
                setRouteQuery(event.target.value);
                setSelectedRoute(null);
              }}
              className="w-full rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[10px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="Search matatus or routes…"
            />
            {routeSearchLoading && (
              <span className="text-[10px] text-slate-400">Searching…</span>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        <div className="p-0 md:p-4 md:pb-3">
          <div className="relative h-[calc(100vh-12rem)] md:h-auto">
            <div className="absolute inset-x-4 top-4 z-20 flex flex-col gap-2 md:static md:mb-3 md:mt-4">
              {destinationSearchEnabled ? (
                <>
                  <div className="inline-flex items-center justify-between rounded-full border border-slate-700/70 bg-slate-950/90 px-3 py-1.5 text-[11px] text-slate-200 shadow-soft">
                    <button
                      type="button"
                      onClick={handleRequestMatatu}
                      className="font-medium"
                    >
                      Where to?
                    </button>
                    <span className="text-[10px] text-slate-400">
                      Route-based view only
                    </span>
                  </div>
                  <div className="rounded-2xl border border-slate-700/80 bg-slate-950/95 px-3 py-2 text-[11px] shadow-soft">
                    <input
                      type="text"
                      value={destinationQuery}
                      onChange={(event) => {
                        const next = event.target.value;
                        setDestinationQuery(next);
                        setDestinationPlaceId(null);
                        setDestinationDescription(next);
                        setDestinationLatLng(null);
                      }}
                      placeholder="Search a destination, stage, or landmark"
                      className="w-full bg-transparent text-slate-50 placeholder:text-slate-500 outline-none"
                    />
                    {destinationSuggestions.length > 0 && (
                      <ul className="mt-2 max-h-40 space-y-1 overflow-auto rounded-xl border border-slate-800 bg-slate-950/95 px-2 py-1">
                        {destinationSuggestions.map((s) => (
                          <li key={s.placeId}>
                            <button
                              type="button"
                              onClick={() => {
                                setDestinationPlaceId(s.placeId);
                                setDestinationDescription(s.description || "");
                                setDestinationQuery(s.description || "");
                                setDestinationSuggestions([]);

                                if (mapsLoaded && apiKey && s.placeId) {
                                  const element = document.createElement("div");
                                  const service = new google.maps.places.PlacesService(
                                    element,
                                  );
                                  service.getDetails(
                                    {
                                      placeId: s.placeId,
                                      fields: [
                                        "geometry",
                                        "name",
                                        "formatted_address",
                                      ],
                                    },
                                    (result, status) => {
                                      if (
                                        !result ||
                                        status !==
                                          google.maps.places.PlacesServiceStatus.OK ||
                                        !result.geometry ||
                                        !result.geometry.location
                                      ) {
                                        setDestinationLatLng(null);
                                        return;
                                      }

                                      const loc: LatLng = {
                                        lat: result.geometry.location.lat(),
                                        lng: result.geometry.location.lng(),
                                      };

                                      setDestinationLatLng(loc);
                                    },
                                  );
                                } else {
                                  setDestinationLatLng(null);
                                }
                              }}
                              className="w-full rounded-lg px-2 py-1 text-left text-[11px] text-slate-100 hover:bg-slate-800/80"
                            >
                              {s.description}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-between rounded-full border border-slate-700/70 bg-slate-950/90 px-3 py-1.5 text-[11px] text-slate-200 shadow-soft">
                    <div className="flex min-w-0 flex-col text-left">
                      <span className="truncate font-semibold">
                        {pickupStage
                          ? `📍 Nearest stage: ${
                              pickupStage.stageName || "Unnamed stage"
                            }`
                          : "Detecting nearest stage…"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {walkingEtaMinutes && walkingStageName
                          ? `About ${walkingEtaMinutes} min walk to this stage. We'll match you with matatus passing here.`
                          : "Walk to this stage and wait for a matatu. We'll match you with matatus passing here."}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowStageSelector(true)}
                      className="ml-2 rounded-full border border-slate-600 bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-100 hover:border-slate-400"
                    >
                      Change stage
                    </button>
                  </div>
                  {showStageSelector && (
                    <div className="rounded-2xl border border-slate-700/80 bg-slate-950/95 px-3 py-2 text-[11px] shadow-soft">
                      <div className="mb-1 text-[10px] text-slate-400">
                        Pick a stage manually
                      </div>
                      <select
                        value={
                          manualStageId ??
                          pickupStage?.stageId ??
                          ""
                        }
                        onChange={(event) => {
                          const value = event.target.value || null;
                          setManualStageId(value);
                        }}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      >
                        <option value="">Select stage…</option>
                        {stages.slice(0, 40).map((stage) => (
                          <option key={stage.id} value={stage.id}>
                            {stage.name || stage.id}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2 flex justify-end gap-2 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setShowStageSelector(false)}
                          className="rounded-full border border-slate-700 px-3 py-0.5 text-slate-300 hover:border-slate-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={!manualStageId}
                          onClick={() => {
                            if (!manualStageId) {
                              return;
                            }
                            const stage = stages.find(
                              (s) => s.id === manualStageId,
                            );
                            if (!stage) {
                              return;
                            }
                            const next: PickupStageInfo = {
                              stageId: stage.id,
                              stageName: stage.name,
                              lat: stage.lat,
                              lng: stage.lng,
                              corridorId: null,
                            };
                            setPickupStage(next);
                            if (typeof window !== "undefined") {
                              try {
                                window.localStorage.setItem(
                                  PICKUP_STAGE_STORAGE_KEY,
                                  JSON.stringify(next),
                                );
                              } catch {
                                // ignore
                              }
                            }
                            setShowStageSelector(false);
                          }}
                          className="rounded-full bg-gradient-gold-orange px-3 py-0.5 text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="absolute inset-0 pt-20 md:static md:pt-0">
              <div className="h-full w-full">
                {globalMapEnabled ? (
                  <GoogleMapContainer
                    matatus={matatusForMap}
                    passengers={passengersForDisplay}
                    userLocation={userLocation}
                    onCenterOnMe={handleCenterOnMe}
                    onSelectMatatu={handleSelectMatatu}
                    isLoading={loading}
                    hasAnyLocation={hasAnyLocation}
                    driverMode={mapDriverMode}
                    routePath={routePathForMap ?? undefined}
                    routeConfidence={routeConfidenceForMap}
                    heatmapPoints={heatmapPointsForMap}
                    heatmapEnabled={riderStatus === "waiting"}
                  />
                ) : (
                  <MapContainer
                    matatus={matatusForDisplay}
                    passengers={passengersForDisplay}
                    userLocation={userLocation}
                    displayPositions={displayPositions}
                    project={project}
                    onCenterOnMe={handleCenterOnMe}
                    onSelectMatatu={handleSelectMatatu}
                    isLoading={loading}
                    hasAnyLocation={hasAnyLocation}
                    driverMode={mapDriverMode}
                    routePath={routePathForMap ?? undefined}
                    routeConfidence={routeConfidenceForMap}
                    heatmapPoints={heatmapPointsForMap}
                    heatmapEnabled={riderStatus === "waiting"}
                    zoomLevelHint={zoomLevelHint ?? undefined}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      <section className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur md:static md:mt-3 md:rounded-2xl md:border md:border-slate-800/80 md:bg-slate-950/90">
        <div className="radaa-shell flex items-center justify-between gap-3 py-3 text-[11px] text-slate-100 md:py-2">
          {destinationSearchEnabled ? (
            <>
              <div className="flex flex-col">
                <span className="font-semibold">
                  {destinationDescription || "Set your destination"}
                </span>
                <span className="text-[10px] text-slate-400">
                  {riderStatus === "waiting"
                    ? "Waiting for a matatu on this route"
                    : walkingEtaMinutes && walkingStageName
                      ? `Walk ~${walkingEtaMinutes} min to ${walkingStageName}`
                      : "We use this to show matatus along your route"}
                </span>
              </div>
              <button
                type="button"
                disabled={
                  !destinationDescription.trim() || riderStatus === "waiting"
                }
                onClick={handleRequestMatatu}
                className={`inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-semibold shadow-soft transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  destinationDescription.trim() && riderStatus !== "waiting"
                    ? "bg-gradient-gold-orange text-slate-950"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {riderStatus === "waiting" ? "Waiting…" : "Request Matatu"}
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <span className="font-semibold">
                  {pickupStage
                    ? pickupStage.stageName || "Your pickup stage"
                    : "Set your pickup stage"}
                </span>
                <span className="text-[10px] text-slate-400">
                  {riderStatus === "waiting"
                    ? "You're now waiting at this stage. Nearby matatus will see your request."
                    : walkingEtaMinutes && walkingStageName
                      ? `About ${walkingEtaMinutes} min walk to ${walkingStageName} stage`
                      : "When you request, matatus near this stage will see you"}
                </span>
              </div>
              <button
                type="button"
                disabled={!pickupStage || riderStatus === "waiting"}
                onClick={handleRequestMatatuNearestStage}
                className={`inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-semibold shadow-soft transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  pickupStage && riderStatus !== "waiting"
                    ? "bg-gradient-gold-orange text-slate-950"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {riderStatus === "waiting"
                  ? "Waiting at this stage"
                  : pickupStage && pickupStage.stageName
                    ? `Request matatu at ${pickupStage.stageName}`
                    : "Request matatu at this stage"}
              </button>
            </>
          )}
        </div>
      </section>

      {!liveOnlyMapEnabled && galleryItems.length > 0 && (
        <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold">Nearby matatu gallery</h2>
              <p className="text-[11px] text-slate-400">
                Swipe to explore matatus near your pickup stage.
              </p>
            </div>
            <span className="text-[10px] text-slate-400">
              {galleryItems.length} online
            </span>
          </div>

          <div className="w-full max-w-sm">
            <TinderGallery
              items={galleryItems}
              onOpenOnMap={handleOpenOnMapFromGallery}
            />
          </div>
        </section>
      )}

      {!liveOnlyMapEnabled && (
        <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold">Matatus on this map</h2>
              <p className="text-[11px] text-slate-400">
                Tap a card to focus the marker and start tracking it.
              </p>
            </div>
            {selectedMatatuEta && (
            <div className="rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-[10px] text-slate-200">
              ~{Math.round(selectedMatatuEta.etaMinutes)} min away
            </div>
          )}
          {routeResults.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {routeResults.map((route) => (
                <button
                  key={route._id}
                  type="button"
                  onClick={() => {
                    setSelectedRoute(route);
                    setRouteQuery(route.name);
                  }}
                  className={`rounded-full border px-2 py-0.5 text-[10px] transition ${
                    selectedRoute && selectedRoute._id === route._id
                      ? "border-sky-500 bg-sky-500/10 text-sky-200"
                      : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500"
                  }`}
                >
                  {route.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {matatusForDisplay.map((m) => {
            const isSelected = selectedMatatu && selectedMatatu.id === m.id;
            const isTracked = trackingId && trackingId === m.id;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMatatuId(m.id)}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition ${
                  isSelected || isTracked
                    ? "border-sky-500 bg-sky-500/10"
                    : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold">
                      {m.plate || m.numberPlate || "Unknown plate"}
                    </span>
                    {m.route && (
                      <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-200">
                        {m.route}
                      </span>
                    )}
                  </div>
                  {m.sacco && (
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {m.sacco}
                    </p>
                  )}
                  {m.rating && m.rating.count > 0 && (
                    <p className="mt-0.5 text-[10px] text-amber-300">
                      {m.rating.avgRating.toFixed(1)} ★ · {m.rating.count} rides
                      rated
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-slate-400">
                    {m.location ? "Online" : "Offline"}
                  </span>
                  {m.isTracked && (
                    <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[9px] text-sky-300">
                      Tracking
                    </span>
                  )}
                </div>
              </button>
            );
          })}
          {matatusForDisplay.length === 0 && (
            <p className="col-span-full text-[11px] text-slate-500">
              No matatus are online yet. They&apos;ll appear here once they come
              online.
            </p>
          )}
        </div>

        {selectedMatatu && (
          <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)]">
            <div className="space-y-2 text-xs text-slate-200">
              {selectedMatatuPhotoSrc && (
                <div className="overflow-hidden rounded-md border border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedMatatuPhotoSrc}
                    alt="Matatu photo"
                    className="h-32 w-full object-cover"
                  />
                </div>
              )}
              <div>
                <span className="text-slate-400">Plate: </span>
                {selectedMatatu.plate ||
                  selectedMatatu.numberPlate ||
                  "Unknown"}
              </div>
              <div>
                <span className="text-slate-400">Route: </span>
                {selectedMatatu.route || "—"}
              </div>
              {selectedMatatu.driverName && (
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-100">
                    {selectedMatatu.driverName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-slate-400">Driver: </span>
                    {selectedMatatu.driverName}
                    {selectedMatatu.driverPhone && (
                      <span className="text-slate-500">
                        {" "}
                        · {selectedMatatu.driverPhone}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {selectedMatatu.sacco && (
                <div>
                  <span className="text-slate-400">SACCO: </span>
                  {selectedMatatu.sacco}
                </div>
              )}
              {selectedMatatu.rating && (
                <div>
                  <span className="text-slate-400">Rating: </span>
                  {selectedMatatu.rating.avgRating.toFixed(1)} ★ (
                  {selectedMatatu.rating.count})
                </div>
              )}
            </div>
            <div className="space-y-2 text-[11px] text-slate-300">
              {selectedMatatuEta && (
                <>
                  <div>
                    <span className="text-slate-400">Distance from you: </span>
                    {(selectedMatatuEta.distanceMeters / 1000).toFixed(1)} km
                  </div>
                  <div>
                    <span className="text-slate-400">ETA (25 km/h): </span>
                    {Math.round(selectedMatatuEta.etaMinutes)} min
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={() =>
                  setTrackingId((current) =>
                    selectedMatatu
                      ? current === selectedMatatu.id
                        ? null
                        : selectedMatatu.id
                      : current,
                  )
                }
                className="mt-1 inline-flex items-center rounded-md bg-sky-600 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm transition hover:bg-sky-500"
              >
                {trackingId === selectedMatatu.id
                  ? "Stop tracking"
                  : "Track this matatu"}
              </button>
            </div>
          </div>
        )}
      </section>
      )}

      {geoError && <p className="text-[11px] text-amber-300">{geoError}</p>}
    </div>
  );
}
