import { haversineDistanceMeters, type LatLng } from "./distance";

export interface StagePoint {
  id: string;
  name: string | null;
  lat: number;
  lng: number;
}

export interface Corridor {
  id: string;
  name: string | null;
  coordinates: LatLng[];
}

export interface ActiveStageRoute {
  originStageId: string;
  destinationStageId: string;
  corridorId: string | null;
  path: LatLng[];
}

export interface NearestStageAndCorridorResult {
  valid: boolean;
  nearestStage: StagePoint | null;
  nearestCorridor: Corridor | null;
  distanceMeters: number;
}

export function findNearestStage(
  point: LatLng | null | undefined,
  stages: StagePoint[],
): StagePoint | null {
  if (!point || !Array.isArray(stages) || stages.length === 0) {
    return null;
  }

  let best: StagePoint | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const stage of stages) {
    const distance = haversineDistanceMeters(point, {
      lat: stage.lat,
      lng: stage.lng,
    });

    if (!Number.isFinite(distance)) {
      continue;
    }

    if (distance < bestDistance) {
      bestDistance = distance;
      best = stage;
    }
  }

  return best;
}

export function isNearStageOrCorridor(
  point: LatLng | null | undefined,
  stages: StagePoint[],
  corridors: Corridor[],
  options?: {
    stageThresholdMeters?: number;
    corridorThresholdMeters?: number;
  },
): NearestStageAndCorridorResult {
  const stageThresholdMeters = options?.stageThresholdMeters ?? 80;
  const corridorThresholdMeters = options?.corridorThresholdMeters ?? 100;

  if (!point) {
    return {
      valid: false,
      nearestStage: null,
      nearestCorridor: null,
      distanceMeters: Number.POSITIVE_INFINITY,
    };
  }

  const nearestStage = findNearestStage(point, stages);

  let bestCorridor: Corridor | null = null;
  let bestCorridorDistance = Number.POSITIVE_INFINITY;

  corridors.forEach((corridor) => {
    const coords = corridor.coordinates;
    if (!coords || coords.length === 0) return;

    coords.forEach((coord) => {
      const distance = haversineDistanceMeters(point, coord);
      if (!Number.isFinite(distance)) return;
      if (distance < bestCorridorDistance) {
        bestCorridorDistance = distance;
        bestCorridor = corridor;
      }
    });
  });

  let distanceToStage = Number.POSITIVE_INFINITY;
  if (nearestStage) {
    const d = haversineDistanceMeters(point, {
      lat: nearestStage.lat,
      lng: nearestStage.lng,
    });
    if (Number.isFinite(d)) {
      distanceToStage = d;
    }
  }

  const nearStage =
    nearestStage &&
    Number.isFinite(distanceToStage) &&
    distanceToStage <= stageThresholdMeters;

  const nearCorridor =
    bestCorridor &&
    Number.isFinite(bestCorridorDistance) &&
    bestCorridorDistance <= corridorThresholdMeters;

  const bestDistance = Math.min(distanceToStage, bestCorridorDistance);

  return {
    valid: Boolean(nearStage || nearCorridor),
    nearestStage: nearestStage ?? null,
    nearestCorridor: bestCorridor,
    distanceMeters: Number.isFinite(bestDistance)
      ? bestDistance
      : Number.POSITIVE_INFINITY,
  };
}

export function buildRouteBetweenStages(
  originStage: StagePoint | null,
  destinationStage: StagePoint | null,
  corridors: Corridor[],
  options?: {
    maxSnapDistanceMeters?: number;
  },
): ActiveStageRoute | null {
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
  const maxSnapDistanceMeters = options?.maxSnapDistanceMeters ?? 400;

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

      if (
        Number.isFinite(distanceToOrigin) &&
        distanceToOrigin < nearestOriginDistance
      ) {
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

    return {
      originStageId: originStage.id,
      destinationStageId: destinationStage.id,
      corridorId: bestCorridor.id,
      path,
    };
  }

  const fallbackPath: LatLng[] = [originPoint, destinationPoint];

  return {
    originStageId: originStage.id,
    destinationStageId: destinationStage.id,
    corridorId: null,
    path: fallbackPath,
  };
}
