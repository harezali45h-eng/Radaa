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
      return "bg-sky-400 text-slate-950 border-sky-300";
    case "online":
      return "bg-emerald-400 text-slate-950 border-emerald-300";
    case "offline":
    default:
      return "bg-slate-600 text-slate-50 border-slate-400";
  }
}
