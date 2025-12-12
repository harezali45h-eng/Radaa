import API from "@/lib/api";
import { io, type Socket } from "socket.io-client";
import type {
  BoltBounds,
  BoltLatLng,
  BoltLiveMatatu,
  BoltMatatuProfile,
  BoltSuggestion,
} from "@/src/features/bolt/types";

const RAW_SOCKET_URL = (process.env.NEXT_PUBLIC_SOCKET_URL || "").replace(
  /\/+$/,
  "",
);

const LIVE_POLL_INTERVAL_MS =
  Number(process.env.NEXT_PUBLIC_LIVE_MAP_POLL_INTERVAL_MS) ||
  Number(process.env.LIVE_MAP_POLL_INTERVAL_MS) ||
  5000;

let boltSocket: Socket | null = null;

export function getLivePollInterval() {
  return LIVE_POLL_INTERVAL_MS;
}

export async function suggestions(q: string): Promise<{
  suggestions: BoltSuggestion[];
  recent: BoltSuggestion[];
}> {
  const query = q.trim();
  if (!query) {
    return { suggestions: [], recent: [] };
  }

  const res = await API.get("/bolt/suggestions", {
    params: { q: query },
  });

  const data = (res.data && (res.data as any).data) || res.data;

  if (!data || typeof data !== "object") {
    return { suggestions: [], recent: [] };
  }

  const suggestionsArray = Array.isArray((data as any).suggestions)
    ? ((data as any).suggestions as BoltSuggestion[])
    : [];
  const recentArray = Array.isArray((data as any).recent)
    ? ((data as any).recent as BoltSuggestion[])
    : [];

  return { suggestions: suggestionsArray, recent: recentArray };
}

export async function getRouteMatatus(
  routeId: string,
): Promise<BoltMatatuProfile[]> {
  if (!routeId) return [];

  const res = await API.get(`/bolt/routes/${routeId}/matatus`);
  const data = (res.data && (res.data as any).data) || res.data;

  if (!Array.isArray(data)) return [];
  return data as BoltMatatuProfile[];
}

export async function getLive(
  bounds: BoltBounds | null,
  limit: number = 400,
): Promise<BoltLiveMatatu[]> {
  const params: Record<string, string | number> = {
    limit,
  };

  if (bounds) {
    const bbox = `${bounds.minLng},${bounds.minLat},${bounds.maxLng},${bounds.maxLat}`;
    params.bbox = bbox;
  }

  const res = await API.get("/bolt/live", { params });
  const data = (res.data && (res.data as any).data) || res.data;

  if (!Array.isArray(data)) return [];
  return data as BoltLiveMatatu[];
}

export type BoltLiveEventType = "update" | "join" | "leave";

export interface BoltLiveUpdate {
  type: BoltLiveEventType;
  matatu: BoltLiveMatatu;
}

function ensureBoltSocket(): Socket | null {
  if (typeof window === "undefined") return null;
  if (!RAW_SOCKET_URL) return null;

  if (!boltSocket) {
    boltSocket = io(`${RAW_SOCKET_URL}/realtime`, {
      autoConnect: true,
      transports: ["websocket"],
      path: "/socket.io",
      withCredentials: true,
    });
  }

  return boltSocket;
}

export function subscribeLiveSocket(
  onUpdate: (update: BoltLiveUpdate) => void,
): () => void {
  const socket = ensureBoltSocket();
  if (!socket) return () => {};

  const handler = (payload: any) => {
    if (!payload) return;

    const id = String(payload.id || payload.matatuId || payload.driverId || "");
    if (!id) return;

    const lat =
      payload.lat ??
      payload.location?.lat ??
      payload.position?.lat ??
      undefined;
    const lng =
      payload.lng ??
      payload.location?.lng ??
      payload.position?.lng ??
      undefined;

    const location: BoltLatLng | null =
      typeof lat === "number" && typeof lng === "number"
        ? { lat, lng }
        : null;

    const matatu: BoltLiveMatatu = {
      id,
      plate: payload.plate || payload.numberPlate || undefined,
      numberPlate: payload.numberPlate || undefined,
      sacco: payload.sacco || null,
      route: payload.route || null,
      speedKph:
        typeof payload.speed === "number" && Number.isFinite(payload.speed)
          ? payload.speed
          : null,
      bearing:
        typeof payload.bearing === "number" && Number.isFinite(payload.bearing)
          ? payload.bearing
          : null,
      location,
      lastUpdated: payload.lastUpdated || null,
    };

    onUpdate({ type: "update", matatu });
  };

  socket.on("matatus:live_update", handler);
  socket.on("matatu:live_update", handler);

  return () => {
    if (!boltSocket) return;
    boltSocket.off("matatus:live_update", handler);
    boltSocket.off("matatu:live_update", handler);
  };
}

export function computeBearing(from: BoltLatLng, to: BoltLatLng): number {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const bearingRad = Math.atan2(y, x);
  const bearingDeg = (bearingRad * 180) / Math.PI;
  return (bearingDeg + 360) % 360;
}

export function interpolatePosition(
  from: BoltLatLng,
  to: BoltLatLng,
): (t: number) => BoltLatLng {
  return (t: number) => {
    const clamped = Math.max(0, Math.min(1, t));

    const lngDiff = to.lng - from.lng;
    const wrappedDiff =
      Math.abs(lngDiff) > 180 ? lngDiff - Math.sign(lngDiff) * 360 : lngDiff;

    return {
      lat: from.lat + (to.lat - from.lat) * clamped,
      lng: from.lng + wrappedDiff * clamped,
    };
  };
}
