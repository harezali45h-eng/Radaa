"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useSocket } from "@/hooks/useSocket";
import { useDriverRealtime } from "@/hooks/useDriverRealtime";
import {
  acceptRide,
  getNearbyRequests,
  type RideRequest,
} from "@/lib/api/rides";
import { getAssignedPassengers } from "@/lib/api/driver";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";
import MapWrapper from "@/components/MapWrapper";
import DriverRequestCard from "@/components/DriverRequestCard";
import DriverDashboardShell from "@/components/driver/DriverDashboardShell";
import {
  getMatatuPhotosV2,
  uploadMatatuPhotoV2,
  type MatatuPhoto,
} from "@/lib/api/matatu";
import { getMapMarkers, getStagesGeoJson } from "@/lib/api";
import { useRideIntent } from "@/context/RideIntentContext";
import { haversineDistanceMeters } from "@/lib/location/distance";

interface LatLng {
  lat: number;
  lng: number;
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

interface ActiveStageRoute {
  originStageId: string;
  destinationStageId: string;
  corridorId: string | null;
  path: LatLng[];
}

function formatStageName(stage: StagePoint | null): string | null {
  if (!stage) return null;
  if (stage.name && typeof stage.name === "string") {
    return stage.name;
  }

  const lat = Number.isFinite(stage.lat) ? stage.lat.toFixed(4) : "";
  const lng = Number.isFinite(stage.lng) ? stage.lng.toFixed(4) : "";

  if (lat && lng) {
    return `Stage ${lat}, ${lng}`;
  }

  return `Stage ${stage.id}`;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

export default function DriverLiveDashboardPage() {
  const { user, token, loading } = useAuth();
  const { addNotification } = useNotifications();
  const { on, off, emit } = useSocket();
  const {
    driverOnline,
    currentRequest,
    timeLeftSeconds,
    location,
    goOnline,
    goOffline,
    acceptCurrentRequest,
    rejectCurrentRequest,
  } = useDriverRealtime();
  const { intent, setIntent, clearIntent } = useRideIntent();

  const role = (user as any)?.role as string | undefined;
  const isDriver = role === "driver";
  const driverStatus = (user as any)?.driverStatus as
    | "provisional"
    | "active"
    | "suspended"
    | string
    | undefined;

  const driverOnboardEnabled = useIsFeatureEnabled("driver_onboard_v1", false);
  const router = useRouter();

  const [coords, setCoords] = useState<LatLng | null>(null);
  const [incoming, setIncoming] = useState<RideRequest[]>([]);
  const [assigned, setAssigned] = useState<RideRequest[]>([]);
  const [loadingIncoming, setLoadingIncoming] = useState<boolean>(true);
  const [loadingAssigned, setLoadingAssigned] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [stages, setStages] = useState<StagePoint[]>([]);
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [activeRoute, setActiveRoute] = useState<ActiveStageRoute | null>(null);
  const [whereToInput, setWhereToInput] = useState("");
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);

  const [driverMatatuId, setDriverMatatuId] = useState<string | null>(null);
  const [driverMatatuLabel, setDriverMatatuLabel] = useState<string | null>(
    null,
  );
  const [photos, setPhotos] = useState<MatatuPhoto[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.log("[driver] driver dashboard mounted successfully");
    }
  }, []);

  useEffect(() => {
    if (!location) {
      return;
    }

    setCoords({ lat: location.lat, lng: location.lng });
  }, [location]);

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

        if (typeof console !== "undefined") {
          console.log("[driver] stages loaded: " + nextStages.length);
        }
      } catch (err) {
        if (typeof console !== "undefined") {
          console.error("[driver] Failed to load stages GeoJSON", err);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  const findNearestStage = useCallback(
    (point: LatLng | null | undefined): StagePoint | null => {
      if (!point || stages.length === 0) {
        return null;
      }

      let best: StagePoint | null = null;
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const stage of stages) {
        const distance = haversineDistanceMeters(
          { lat: point.lat, lng: point.lng },
          { lat: stage.lat, lng: stage.lng },
        );

        if (!Number.isFinite(distance)) {
          continue;
        }

        if (distance < bestDistance) {
          bestDistance = distance;
          best = stage;
        }
      }

      return best;
    },
    [stages],
  );

  const buildRouteBetweenStages = useCallback(
    (originStage: StagePoint | null, destinationStage: StagePoint | null): ActiveStageRoute | null => {
      if (!originStage || !destinationStage) {
        return null;
      }

      const originPoint: LatLng = {
        lat: originStage.lat,
        lng: originStage.lng,
      };
      const destinationPoint: LatLng = {
        lat: destinationStage.lat,
        lng: destinationStage.lng,
      };

      let bestCorridor: Corridor | null = null;
      let bestCorridorScore = Number.POSITIVE_INFINITY;
      let bestOriginIndex = 0;
      let bestDestinationIndex = 0;
      const maxSnapDistanceMeters = 400;

      corridors.forEach((corridor) => {
        const coords = corridor.coordinates;
        if (!coords || coords.length < 2) {
          return;
        }

        let nearestOriginIndex = -1;
        let nearestOriginDistance = Number.POSITIVE_INFINITY;
        let nearestDestinationIndex = -1;
        let nearestDestinationDistance = Number.POSITIVE_INFINITY;

        coords.forEach((coord, index) => {
          const distanceToOrigin = haversineDistanceMeters(originPoint, coord);
          const distanceToDestination = haversineDistanceMeters(
            destinationPoint,
            coord,
          );

          if (Number.isFinite(distanceToOrigin) && distanceToOrigin < nearestOriginDistance) {
            nearestOriginDistance = distanceToOrigin;
            nearestOriginIndex = index;
          }

          if (
            Number.isFinite(distanceToDestination) &&
            distanceToDestination < nearestDestinationDistance
          ) {
            nearestDestinationDistance = distanceToDestination;
            nearestDestinationIndex = index;
          }
        });

        if (
          nearestOriginIndex === -1 ||
          nearestDestinationIndex === -1 ||
          nearestOriginDistance > maxSnapDistanceMeters ||
          nearestDestinationDistance > maxSnapDistanceMeters
        ) {
          return;
        }

        const score = nearestOriginDistance + nearestDestinationDistance;

        if (score < bestCorridorScore) {
          bestCorridorScore = score;
          bestCorridor = corridor;
          bestOriginIndex = nearestOriginIndex;
          bestDestinationIndex = nearestDestinationIndex;
        }
      });

      if (bestCorridor) {
        const coords = bestCorridor.coordinates;
        const startIndex = Math.min(bestOriginIndex, bestDestinationIndex);
        const endIndex = Math.max(bestOriginIndex, bestDestinationIndex);
        const path = coords.slice(startIndex, endIndex + 1);

        if (typeof console !== "undefined") {
          const label =
            bestCorridor.name ||
            `${bestCorridor.id} (${path.length.toString()} points)`;
          console.log("[driver] corridor route selected: " + label);
        }

        return {
          originStageId: originStage.id,
          destinationStageId: destinationStage.id,
          corridorId: bestCorridor.id,
          path,
        };
      }

      if (typeof console !== "undefined") {
        console.log("[driver] corridor not found, fallback routing used");
      }

      const fallbackPath: LatLng[] = [originPoint, destinationPoint];

      return {
        originStageId: originStage.id,
        destinationStageId: destinationStage.id,
        corridorId: null,
        path: fallbackPath,
      };
    },
    [corridors],
  );

  const resolveDestinationStage = useCallback(
    (stage: StagePoint | null) => {
      if (!stage) {
        return;
      }

      const label = formatStageName(stage) ?? stage.id;

      const originStage = findNearestStage(coords);
      const route = buildRouteBetweenStages(originStage, stage);

      if (route) {
        setActiveRoute(route);
      } else {
        setActiveRoute(null);
      }

      setIntent({
        destination: { lat: stage.lat, lng: stage.lng },
        label,
      });

      if (typeof console !== "undefined") {
        console.log("[driver] destination resolved to stage: " + label);
      }
    },
    [buildRouteBetweenStages, coords, findNearestStage, setIntent],
  );

  const handleWhereToSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const query = whereToInput.trim();

      if (!query) {
        if (intent.destination) {
          const stage = findNearestStage(intent.destination);
          resolveDestinationStage(stage);
        }
        return;
      }

      const normalized = query.toLowerCase();

      let exactMatch: StagePoint | null = null;
      let partialMatch: StagePoint | null = null;

      for (const stage of stages) {
        if (!stage.name) continue;
        const name = stage.name.toLowerCase();
        if (name === normalized) {
          exactMatch = stage;
          break;
        }
        if (!partialMatch && name.includes(normalized)) {
          partialMatch = stage;
        }
      }

      const targetStage = exactMatch ?? partialMatch ?? null;

      if (targetStage) {
        resolveDestinationStage(targetStage);
      } else if (typeof console !== "undefined") {
        console.warn("[driver] no stage matched query:", query);
      }
    },
    [whereToInput, intent, stages, findNearestStage, resolveDestinationStage],
  );

  const handleMapClick = useCallback(
    (location: LatLng) => {
      const stage = findNearestStage(location);
      resolveDestinationStage(stage);
    },
    [findNearestStage, resolveDestinationStage],
  );

  useEffect(() => {
    if (!token || !isDriver) {
      return;
    }

    const vehicleRegistration = (user as any)?.driverProfile
      ?.vehicleRegistration as string | undefined;

    if (!vehicleRegistration) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const markers: any = await getMapMarkers();
        if (cancelled) return;

        const raw = Array.isArray(markers) ? markers : [];
        const target = vehicleRegistration.toLowerCase();

        const match = raw.find((m: any) => {
          const plate = String(m.plate ?? m.numberPlate ?? "").toLowerCase();
          if (!plate) return false;
          return plate.includes(target) || target.includes(plate);
        });

        if (!match) {
          return;
        }

        const id = String(match.id ?? match._id ?? "");
        if (!id) {
          return;
        }

        setDriverMatatuId(id);
        const label =
          match.plate || match.numberPlate || id.slice(0, 6) || vehicleRegistration;
        setDriverMatatuLabel(label);
      } catch {
        // Optional helper; failures should not impact core driver flows.
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [token, isDriver, user]);

  useEffect(() => {
    if (!token || !isDriver || !driverMatatuId) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        setPhotosLoading(true);
        setPhotoError(null);
        const next = await getMatatuPhotosV2(driverMatatuId, token);
        if (cancelled) return;
        setPhotos(Array.isArray(next) ? next : []);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load matatu photos";
        setPhotoError(message);
      } finally {
        if (!cancelled) {
          setPhotosLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [driverMatatuId, token, isDriver]);

  const handlePhotoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setPhotoFile(null);
      return;
    }
    const [file] = Array.from(event.target.files);
    setPhotoFile(file ?? null);
  };

  const handleUploadPhoto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token || !isDriver || !driverMatatuId || !photoFile) {
      return;
    }

    try {
      setPhotosLoading(true);
      setPhotoError(null);
      setPhotoSuccess(null);

      const next = await uploadMatatuPhotoV2(
        driverMatatuId,
        photoFile,
        { caption: photoCaption || undefined },
        token,
      );

      setPhotos(Array.isArray(next) ? next : []);
      setPhotoCaption("");
      setPhotoFile(null);
      setPhotoSuccess("Photo uploaded and pending review.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to upload matatu photo";
      setPhotoError(message);
      setPhotoSuccess(null);
    } finally {
      setPhotosLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !isDriver) {
      setLoadingIncoming(false);
      setLoadingAssigned(false);
      if (!token) {
        setError("You need to be signed in as a driver to view this page.");
      }
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      setLoadingIncoming(false);
      setError(
        "Location is not available in this browser. Turn on location for Radaa or try a different device.",
      );
      return;
    }

    setError(null);
  }, [token, isDriver]);

  useEffect(() => {
    if (!token || !coords || !isDriver) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoadingIncoming(true);
      setError(null);

      try {
        const data = await getNearbyRequests(
          {
            lat: coords.lat,
            lng: coords.lng,
          },
          token,
        );

        if (cancelled) return;
        setIncoming(Array.isArray(data) ? data : []);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load nearby requests";
        setError(message);
        if (typeof console !== "undefined") {
          console.error("[driver-live] getNearbyRequests error", err);
        }
      } finally {
        if (!cancelled) {
          setLoadingIncoming(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [token, coords, isDriver]);

  useEffect(() => {
    if (!token || !isDriver) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoadingAssigned(true);
      try {
        const data = await getAssignedPassengers(token);
        if (cancelled) return;
        setAssigned(Array.isArray(data) ? data : []);
      } catch (err) {
        if (cancelled) return;
        if (typeof console !== "undefined") {
          console.error("[driver-live] getAssignedPassengers error", err);
        }
      } finally {
        if (!cancelled) {
          setLoadingAssigned(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [token, isDriver]);

  useEffect(() => {
    if (!isDriver) {
      return;
    }

    const handleRideCreated = (payload: any) => {
      try {
        if (!payload) return;

        const id = payload?.id || payload?._id;

        setIncoming((current) => {
          const exists = current.some(
            (r) => (r._id as any) === id || (r as any).id === id,
          );
          if (exists) return current;
          const next: RideRequest = {
            ...(payload as RideRequest),
            _id: (payload?._id || id || "") as string,
          };
          return [next, ...current];
        });

        addNotification({
          type: "trip",
          title: "New nearby ride request",
          message: "A passenger near you has requested a ride.",
        });
      } catch (err) {
        if (typeof console !== "undefined") {
          console.error("[driver-live] ride:created handler error", err);
        }
      }
    };

    const handleRideCancelled = (payload: any) => {
      try {
        const id = payload?.id || payload?._id;
        if (!id) return;

        setIncoming((current) =>
          current.filter((r) => (r._id as any) !== id && (r as any).id !== id),
        );
        setAssigned((current) =>
          current.filter((r) => (r._id as any) !== id && (r as any).id !== id),
        );

        addNotification({
          type: "trip",
          title: "Ride cancelled",
          message: "A ride in your area was cancelled.",
        });
      } catch (err) {
        if (typeof console !== "undefined") {
          console.error("[driver-live] ride:cancelled handler error", err);
        }
      }
    };

    const handlePassengerUpdate = (payload: any) => {
      try {
        if (!payload) return;
        const rawId = payload.id ?? payload.rideId;
        if (!rawId) return;
        const id = String(rawId);

        setAssigned((current) => {
          const next = current.map((ride) =>
            (ride._id as any) === id || (ride as any).id === id
              ? ({
                  ...ride,
                  ...(payload as Partial<RideRequest>),
                } as RideRequest)
              : ride,
          );
          return next;
        });
      } catch (err) {
        if (typeof console !== "undefined") {
          console.error("[driver-live] passenger:update handler error", err);
        }
      }
    };

    on("ride:created", handleRideCreated as any);
    on("ride:cancelled", handleRideCancelled as any);
    on("passenger:update", handlePassengerUpdate as any);

    return () => {
      off("ride:created", handleRideCreated as any);
      off("ride:cancelled", handleRideCancelled as any);
      off("passenger:update", handlePassengerUpdate as any);
    };
  }, [on, off, addNotification, isDriver]);

  const handleAccept = async (id: string) => {
    if (!token) {
      addNotification({
        type: "system",
        title: "Sign in required",
        message: "You need to be signed in as a driver to accept rides.",
      });
      return;
    }

    try {
      await acceptRide(id, token);
      setIncoming((current) =>
        current.filter((r) => (r._id as any) !== id && (r as any).id !== id),
      );
      addNotification({
        type: "trip",
        title: "Ride accepted",
        message: "The passenger has been notified of your acceptance.",
      });

      const updatedAssigned = await getAssignedPassengers(token);
      setAssigned(Array.isArray(updatedAssigned) ? updatedAssigned : []);
    } catch (error: any) {
      const message =
        error instanceof Error ? error.message : "Failed to accept ride";
      addNotification({
        type: "system",
        title: "Could not accept ride",
        message,
      });
    }
  };

  const hasIncoming = incoming.length > 0;
  const hasAssigned = assigned.length > 0;

  const routeDemand = useMemo(
    () => {
      if (!hasIncoming) {
        return [] as Array<{ id: string; label: string; riderCount: number }>;
      }

      const buckets = new Map<string, { id: string; label: string; riderCount: number }>();

      incoming.forEach((ride) => {
        const anyRide = ride as any;
        const pickup = anyRide.pickup || anyRide.pickupLocation || anyRide.location || null;

        let routeId = "sim-route-default";
        let label = "Sample corridor (simulated)";

        if (pickup && Array.isArray(pickup.coordinates) && pickup.coordinates.length === 2) {
          const [lng, lat] = pickup.coordinates as [number, number];

          if (typeof lat === "number" && typeof lng === "number") {
            const hash = Math.abs(Math.round(lat * 100) + Math.round(lng * 100));
            const idx = (hash % 3) + 1;
            routeId = `sim-route-${idx}`;
            label = `Simulated route ${idx}`;
          }
        }

        const existing = buckets.get(routeId) || {
          id: routeId,
          label,
          riderCount: 0,
        };

        existing.riderCount += 1;
        buckets.set(routeId, existing);
      });

      return Array.from(buckets.values()).sort((a, b) => b.riderCount - a.riderCount);
    },
    [incoming, hasIncoming],
  );

  const currentPickupStage = useMemo(
    () => (currentRequest ? findNearestStage(currentRequest.pickup) : null),
    [currentRequest, findNearestStage],
  );

  const currentDestinationStage = useMemo(
    () =>
      currentRequest ? findNearestStage(currentRequest.destination) : null,
    [currentRequest, findNearestStage],
  );

  const passengerMarkers = useMemo(
    () =>
      incoming
        .map((ride) => {
          const rideAny = ride as any;
          const pickup =
            rideAny.pickup ||
            rideAny.pickupLocation ||
            rideAny.location ||
            null;
          if (
            !pickup ||
            !Array.isArray(pickup.coordinates) ||
            pickup.coordinates.length !== 2
          ) {
            return null;
          }

          const [lng, lat] = pickup.coordinates as [number, number];

          if (typeof lat !== "number" || typeof lng !== "number") {
            return null;
          }

          const id = (ride._id as any) || (ride as any).id || `${lat},${lng}`;
          return {
            id: String(id),
            location: { lat, lng },
          };
        })
        .filter(Boolean) as { id: string; location: LatLng }[],
    [incoming],
  );

  const heatmapPoints = useMemo(
    () => {
      if (!heatmapEnabled) {
        return [] as LatLng[];
      }

      if (incoming.length === 0) {
        return [] as LatLng[];
      }

      const points: LatLng[] = [];

      incoming.forEach((ride) => {
        const rideAny = ride as any;
        const pickup =
          rideAny.pickup ||
          rideAny.pickupLocation ||
          rideAny.location ||
          null;

        if (
          !pickup ||
          !Array.isArray(pickup.coordinates) ||
          pickup.coordinates.length !== 2
        ) {
          return;
        }

        const [lng, lat] = pickup.coordinates as [number, number];

        if (typeof lat !== "number" || typeof lng !== "number") {
          return;
        }

        const snappedStage = findNearestStage({ lat, lng });

        if (snappedStage) {
          points.push({ lat: snappedStage.lat, lng: snappedStage.lng });
        } else {
          points.push({ lat, lng });
        }
      });

      return points;
    },
    [heatmapEnabled, incoming, findNearestStage],
  );

  const bounds = useMemo(() => {
    const locations: LatLng[] = [];

    if (coords) {
      locations.push(coords);
    }

    passengerMarkers.forEach((p) => {
      if (
        p.location &&
        typeof p.location.lat === "number" &&
        typeof p.location.lng === "number"
      ) {
        locations.push(p.location);
      }
    });

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
  }, [coords, passengerMarkers]);

  const hasAnyLocation = useMemo(() => bounds !== null, [bounds]);

  const project = (location: LatLng | null | undefined) => {
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
  };

  const displayPositions: Record<string, LatLng> = {};

  const routePath = activeRoute ? activeRoute.path : null;

  const pickupStageName = formatStageName(currentPickupStage);
  const destinationStageName = formatStageName(currentDestinationStage);

  if (loading || !user || !isDriver) {
    return (
      <DriverDashboardShell active="live">
        <div className="space-y-4 text-xs">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Driver live dashboard
            </h1>
            <p className="text-slate-300">
              You must be signed in as a driver to view this dashboard.
            </p>
          </header>
        </div>
      </DriverDashboardShell>
    );
  }

  return (
    <DriverDashboardShell active="live">
      <div className="space-y-6 text-xs">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Driver live dashboard
          </h1>
          <p className="text-slate-300">
            Watch incoming ride requests in real time and manage your currently
            assigned passengers.
          </p>
          {driverOnboardEnabled && (
            <p className="text-[11px] text-emerald-200">
              New driver experience is enabled for your account.
            </p>
          )}
          {driverStatus === "provisional" && (
            <p className="text-[11px] text-amber-200">
              You are live while we verify your details. Mpesa payouts and paid
              features unlock after SACCO/admin approval.
            </p>
          )}
          {driverStatus === "suspended" && (
            <p className="text-[11px] text-red-300">
              Your driver account is currently suspended. Contact your SACCO or
              support for assistance.
            </p>
          )}
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-[11px] text-slate-400">
              <span
                className={
                  driverOnline
                    ? "h-1.5 w-1.5 rounded-full bg-emerald-400"
                    : "h-1.5 w-1.5 rounded-full bg-slate-500"
                }
              />
              <span>
                {driverOnline
                  ? "You are online and visible to nearby riders"
                  : "You are offline. Go online to start seeing ride requests."}
              </span>
            </div>
            <button
              type="button"
              onClick={() => (driverOnline ? goOffline() : goOnline())}
              className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium transition ${
                driverOnline
                  ? "bg-gradient-gold-orange text-slate-950 shadow-soft hover:shadow-glow-kenya"
                  : "border border-slate-700 bg-slate-900/80 text-slate-100 hover:border-slate-500 hover:bg-slate-900"
              }`}
            >
              {driverOnline ? "Go offline" : "Go online"}
            </button>
          </div>
          <form
            onSubmit={handleWhereToSubmit}
            className="mt-3 flex flex-col gap-2 rounded-lg border border-slate-800/80 bg-slate-950/60 p-2 md:flex-row md:items-center"
          >
            <div className="flex-1 min-w-[0]">
              <div className="flex items-center justify-between gap-2">
                <label className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Where to?
                </label>
                {intent.label && (
                  <span className="text-[10px] text-emerald-200">
                    {intent.label}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={whereToInput}
                onChange={(event) => setWhereToInput(event.target.value)}
                placeholder="Type a stage name or tap on the map"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div className="flex items-center gap-2 pt-1 md:pt-0">
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-emerald-600/70 bg-emerald-600/10 px-2.5 py-1 text-[11px] font-medium text-emerald-100 hover:border-emerald-400 hover:bg-emerald-600/20"
              >
                Set
              </button>
              <button
                type="button"
                onClick={() => {
                  setWhereToInput("");
                  setActiveRoute(null);
                  clearIntent();
                }}
                className="inline-flex items-center rounded-md border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setHeatmapEnabled((value) => !value)}
                className="inline-flex items-center rounded-md border border-sky-700/80 bg-sky-900/30 px-2.5 py-1 text-[11px] font-medium text-sky-100 hover:border-sky-500 hover:bg-sky-900/50"
              >
                {heatmapEnabled ? "Hide heatmap" : "Show heatmap"}
              </button>
            </div>
          </form>
        </header>

      {currentRequest && (
        <section className="border-t border-emerald-700/60 pt-3">
          <DriverRequestCard
            request={currentRequest}
            timeLeftSeconds={timeLeftSeconds}
            onAccept={acceptCurrentRequest}
            onReject={rejectCurrentRequest}
            pickupStageName={pickupStageName}
            destinationStageName={destinationStageName}
          />
        </section>
      )}

      <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs shadow-soft">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Nearby passenger map
            </div>
            <p className="text-[11px] text-slate-400">
              Live preview of requests around your current location.
            </p>
          </div>
        </div>
        <MapWrapper
          matatus={[]}
          passengers={passengerMarkers}
          userLocation={coords}
          displayPositions={displayPositions}
          project={project}
          onCenterOnMe={() => {
            if (typeof window === "undefined" || !navigator.geolocation) {
              return;
            }

            navigator.geolocation.getCurrentPosition(
              (position) => {
                const loc: LatLng = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                setCoords(loc);
              },
              () => {
                // ignore errors here; main flow already reports geo issues
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
              },
            );
          }}
          onSelectMatatu={() => {}}
          isLoading={loadingIncoming}
          hasAnyLocation={hasAnyLocation}
          driverMode
          showCenterOnMe
          routePath={routePath ?? undefined}
          heatmapPoints={heatmapPoints}
          heatmapEnabled={heatmapEnabled}
          onMapClick={handleMapClick}
        />
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Route-based rider demand (simulated)
            </div>
            <p className="text-[11px] text-slate-400">
              Riders are grouped into sample routes based on pickup location. Counts are simulated
              for this MVP.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/gallery")}
            className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100 hover:border-genz-accent hover:text-genz-accent"
          >
            Open gallery
          </button>
        </div>

        {!driverMatatuId && (
          <p className="mt-2 text-[11px] text-slate-400">
            We couldn’t automatically match your vehicle to a registered matatu yet.
            You can continue driving normally while your SACCO links your account.
          </p>
        )}

        {driverMatatuId && (
          <div className="mt-2 space-y-3">
            <div className="text-[11px] text-slate-300">
              Matatu: <span className="font-semibold text-slate-50">{driverMatatuLabel}</span>
            </div>

            <form onSubmit={handleUploadPhoto} className="space-y-2">
              <div className="grid gap-2 md:grid-cols-[1.5fr,1.5fr]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  className="block w-full cursor-pointer text-[11px] text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-2 file:py-1 file:text-[11px] file:font-medium file:text-slate-100 hover:file:bg-slate-700"
                />
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(event) => setPhotoCaption(event.target.value)}
                  placeholder="Optional caption, e.g. ‘Front view near CBD’"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <button
                type="submit"
                disabled={!photoFile || photosLoading}
                className="inline-flex items-center rounded-md bg-sky-600 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {photosLoading ? "Uploading…" : "Upload photo"}
              </button>
            </form>

            {photoError && (
              <p className="text-[11px] text-amber-200">{photoError}</p>
            )}

            {photoSuccess && (
              <p className="text-[11px] text-emerald-200">{photoSuccess}</p>
            )}

            <div className="mt-1 grid grid-cols-3 gap-2">
              {photos.length === 0 && !photosLoading && (
                <p className="col-span-3 text-[11px] text-slate-400">
                  No photos uploaded yet. Start with a clear exterior shot.
                </p>
              )}

              {photos.map((photo) => {
                const fullUrl = photo.url.startsWith("http")
                  ? photo.url
                  : `${BACKEND_URL}${photo.url}`;

                return (
                  <div
                    key={photo._id}
                    className="relative overflow-hidden rounded-md border border-slate-800 bg-slate-950"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fullUrl}
                      alt={photo.caption || "Matatu photo"}
                      className="h-20 w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent px-1.5 pb-1 pt-2 text-[9px] text-slate-200">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate">
                          {photo.caption || "Uploaded photo"}
                        </span>
                        {photo.status && (
                          <span className="ml-1 shrink-0 rounded-full bg-slate-900/80 px-1.5 py-0.5 text-[8px] uppercase tracking-wide text-slate-300">
                            {photo.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {error && (
        <p className="text-[11px] text-amber-200">
          {error}
        </p>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 border-t border-slate-800/80 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Incoming requests
              </h2>
              <p className="text-[11px] text-slate-400">
                New ride requests near your current location will appear here.
              </p>
            </div>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
              {hasIncoming ? incoming.length : 0}
            </span>
          </div>

          {loadingIncoming && (
            <div className="space-y-2">
              <div className="h-6 w-full animate-pulse rounded-full bg-slate-800/70" />
              <div className="h-6 w-full animate-pulse rounded-full bg-slate-800/70" />
            </div>
          )}

          {!loadingIncoming && !hasIncoming && !error && (
            <p className="text-[11px] text-slate-400">
              No nearby ride requests right now. When passengers request rides
              near you, they will appear here.
            </p>
          )}

          {!loadingIncoming && hasIncoming && (
            <div className="divide-y divide-slate-800/80">
              {incoming.map((ride) => {
                const id = (ride._id as any) || (ride as any).id || "";
                const createdAt = ride.createdAt
                  ? new Date(ride.createdAt)
                  : null;

                const pickup = (ride as any).pickup;
                let pickupLabel = "—";
                if (
                  pickup &&
                  Array.isArray(pickup.coordinates) &&
                  pickup.coordinates.length === 2
                ) {
                  const [lng, lat] = pickup.coordinates as [number, number];
                  pickupLabel = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                }

                let distanceLabel = "—";
                if (
                  coords &&
                  pickup &&
                  Array.isArray(pickup.coordinates) &&
                  pickup.coordinates.length === 2
                ) {
                  const [lng, lat] = pickup.coordinates as [number, number];
                  const distanceMeters = haversineDistanceMeters(coords, {
                    lat,
                    lng,
                  });
                  if (Number.isFinite(distanceMeters)) {
                    const km = distanceMeters / 1000;
                    const speedKmh = 25;
                    const etaMinutes =
                      (distanceMeters / 1000 / speedKmh) * 60;
                    distanceLabel = `${km.toFixed(1)} km · ~${Math.round(
                      etaMinutes,
                    )} min`;
                  }
                }

                return (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-3 py-2"
                  >
                    <div className="space-y-0.5 text-[11px]">
                      <div className="font-medium text-slate-100">
                        {pickupLabel}
                      </div>
                      <div className="text-slate-400">
                        {createdAt
                          ? createdAt.toLocaleString()
                          : "Just now"}
                        {distanceLabel !== "—" && (
                          <span className="text-slate-500">
                            {" "}· {distanceLabel}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAccept(String(id))}
                      className="inline-flex items-center rounded-md border border-emerald-600/60 bg-emerald-600/20 px-2 py-1 text-[11px] font-medium text-emerald-100 transition hover:border-emerald-400 hover:bg-emerald-600/30"
                    >
                      Accept
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-3 border-t border-slate-800/80 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Assigned passengers
              </h2>
              <p className="text-[11px] text-slate-400">
                A summary of rides that are currently assigned to you.
              </p>
            </div>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
              {hasAssigned ? assigned.length : 0}
            </span>
          </div>

          {loadingAssigned && (
            <div className="space-y-2">
              <div className="h-6 w-full animate-pulse rounded-full bg-slate-800/70" />
              <div className="h-6 w-full animate-pulse rounded-full bg-slate-800/70" />
            </div>
          )}

          {!loadingAssigned && !hasAssigned && (
            <p className="text-[11px] text-slate-400">
              You have no active assigned passengers. Accepted rides will show
              up here.
            </p>
          )}

          {!loadingAssigned && hasAssigned && (
            <div className="divide-y divide-slate-800/80">
              {assigned.map((ride) => {
                const id = (ride._id as any) || (ride as any).id || "";
                const createdAt = ride.createdAt
                  ? new Date(ride.createdAt)
                  : null;

                return (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-3 py-2"
                  >
                    <div className="space-y-0.5 text-[11px] text-slate-200">
                      <div className="font-semibold">
                        Ride {String(id).slice(0, 6)}
                      </div>
                      <div className="text-slate-400">
                        Status:{" "}
                        <span className="text-emerald-300">{ride.status}</span>
                      </div>
                      {createdAt && (
                        <div className="text-slate-400">
                          Requested at: {createdAt.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
    </DriverDashboardShell>
  );
}
