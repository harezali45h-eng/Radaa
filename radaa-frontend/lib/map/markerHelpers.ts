import { haversineDistanceMeters } from "../location/distance";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MatatuLike {
  id?: string;
  _id?: string;
  plate?: string;
  numberPlate?: string;
  route?: string;
  sacco?: string;
  driverName?: string;
  driverPhone?: string;
  location?: LatLng | null;
  mainPhotoUrl?: string | null;
  rating?: {
    avgRating: number;
    count: number;
  };
}

export type MarkerStatus = "online" | "offline" | "driver";

export function interpolateCoordinates(
  prev: LatLng | null | undefined,
  next: LatLng | null | undefined,
  progress: number,
): LatLng | null {
  if (!prev && !next) {
    return null;
  }

  if (!prev) {
    return next ?? null;
  }

  if (!next) {
    return prev ?? null;
  }

  const t = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;

  const lat = prev.lat + (next.lat - prev.lat) * t;
  const lng = prev.lng + (next.lng - prev.lng) * t;

  return { lat, lng };
}

export function formatMatatuLabel(
  matatu: MatatuLike | null | undefined,
): string {
  if (!matatu) {
    return "Matatu";
  }

  if (matatu.plate && matatu.plate.trim().length > 0) {
    return matatu.plate.trim();
  }

  if (matatu.numberPlate && matatu.numberPlate.trim().length > 0) {
    return matatu.numberPlate.trim();
  }

  if (matatu.route && matatu.route.trim().length > 0) {
    return matatu.route.trim();
  }

  if (matatu.sacco && matatu.sacco.trim().length > 0) {
    return matatu.sacco.trim();
  }

  const id = matatu.id || matatu._id;
  if (id) {
    return String(id).slice(0, 6);
  }

  return "Matatu";
}

export function chooseColor(status: MarkerStatus): string {
  switch (status) {
    case "driver":
      return "bg-amber-300 text-slate-950 border-amber-200";
    case "online":
      return "bg-emerald-400 text-slate-950 border-emerald-300";
    case "offline":
    default:
      return "bg-slate-600 text-slate-50 border-slate-400";
  }
}

function distancePointToSegmentMeters(
  point: LatLng,
  a: LatLng,
  b: LatLng,
): number {
  const dAB = haversineDistanceMeters(a, b);
  if (!Number.isFinite(dAB) || dAB <= 0) {
    return haversineDistanceMeters(point, a);
  }

  const dAP = haversineDistanceMeters(a, point);
  const dBP = haversineDistanceMeters(b, point);

  const dAB2 = dAB * dAB;
  const dAP2 = dAP * dAP;
  const dBP2 = dBP * dBP;

  if (dAP2 >= dAB2 + dBP2) {
    return dBP;
  }

  if (dBP2 >= dAB2 + dAP2) {
    return dAP;
  }

  const s = (dAB + dAP + dBP) / 2;
  const areaSq = Math.max(s * (s - dAB) * (s - dAP) * (s - dBP), 0);
  const area = Math.sqrt(areaSq);

  if (!Number.isFinite(area) || area <= 0) {
    return Math.min(dAP, dBP);
  }

  return (2 * area) / dAB;
}

export function isPointNearPolyline(
  point: LatLng,
  polyline: LatLng[],
  maxDistanceMeters = 200,
): boolean {
  if (
    !point ||
    !polyline ||
    !Array.isArray(polyline) ||
    polyline.length < 2 ||
    typeof point.lat !== "number" ||
    typeof point.lng !== "number"
  ) {
    return false;
  }

  const threshold = Number.isFinite(maxDistanceMeters) && maxDistanceMeters > 0
    ? maxDistanceMeters
    : 200;

  let minDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < polyline.length - 1; index += 1) {
    const a = polyline[index];
    const b = polyline[index + 1];

    if (
      !a ||
      !b ||
      typeof a.lat !== "number" ||
      typeof a.lng !== "number" ||
      typeof b.lat !== "number" ||
      typeof b.lng !== "number"
    ) {
      continue;
    }

    const distance = distancePointToSegmentMeters(point, a, b);
    if (Number.isFinite(distance) && distance < minDistance) {
      minDistance = distance;
      if (minDistance <= threshold) {
        return true;
      }
    }
  }

  return minDistance <= threshold;
}
