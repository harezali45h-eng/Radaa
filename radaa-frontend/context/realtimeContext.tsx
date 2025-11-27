"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useSocket } from "@/hooks/useSocket";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";

const MODE_STORAGE_KEY = "radaa_active_mode";
type Mode = "passenger" | "driver";

function getInitialMode(): Mode {
  if (typeof window === "undefined") return "passenger";

  try {
    const stored = window.localStorage.getItem(MODE_STORAGE_KEY);
    if (stored === "driver" || stored === "passenger") {
      return stored as Mode;
    }
  } catch (error) {
    console.error("[realtime] failed to read mode from storage", error);
  }

  return "passenger";
}

interface LatLng {
  lat: number;
  lng: number;
}

interface RealtimeMatatu {
  id: string;
  plate?: string;
  numberPlate?: string;
  route?: string;
  location?: LatLng;
  status?: string;
}

interface RideAssignedPayload {
  id?: string;
  rideId?: string;
  matatuId?: string;
  matatuPlate?: string;
  passengerId?: string;
  pickupLocation?: LatLng;
  location?: LatLng;
  passengerLocation?: LatLng;
  [key: string]: any;
}

interface RealtimeContextValue {
  matatus: RealtimeMatatu[];
  lastRideAssigned: RideAssignedPayload | null;
  driverOnline: boolean;
  setDriverOnline: (online: boolean) => void;
  activeMode: Mode;
}

const RealtimeContext = createContext<RealtimeContextValue | undefined>(undefined);

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { connect, on, off, emit } = useSocket();
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const [matatus, setMatatus] = useState<RealtimeMatatu[]>([]);
  const [lastRideAssigned, setLastRideAssigned] = useState<RideAssignedPayload | null>(null);
  const [activeMode, setActiveModeState] = useState<Mode>(() => getInitialMode());
  const [driverOnline, setDriverOnlineState] = useState<boolean>(
    () => getInitialMode() === "driver"
  );

  useEffect(() => {
    connect();

    const handleMatatuUpdate = (payload: any) => {
      const updates: RealtimeMatatu[] = Array.isArray(payload) ? payload : [payload];

      setMatatus((current) => {
        const map = new Map<string, RealtimeMatatu>();
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

    const handleRideAssigned = (payload: RideAssignedPayload) => {
      if (!payload) return;

      setLastRideAssigned(payload);

      const matatuLabel =
        payload.matatuPlate || (payload as any).matatuName || (payload as any).matatuNumberPlate;

      addNotification({
        type: "trip",
        title: "New ride assigned",
        message: matatuLabel
          ? `A new ride was assigned to ${matatuLabel}.`
          : "A new ride was assigned."
      });
    };

    const handleRideCreated = (payload: any) => {
      if (!payload) return;

      addNotification({
        type: "trip",
        title: "New ride created",
        message: "A passenger just created a new ride request."
      });
    };

    const handleSaccoUpdate = (payload: any) => {
      void payload;
      addNotification({
        type: "system",
        title: "SACCO stats updated",
        message: "Live SACCO metrics were updated."
      });
    };

    const handlePassengerLiveUpdate = (payload: any) => {
      void payload;
    };

    on("matatus:live_update", handleMatatuUpdate);
    on("matatu:live_update", handleMatatuUpdate as any);
    on("ride:assigned", handleRideAssigned as any);
    on("ride:created", handleRideCreated as any);
    on("sacco:update", handleSaccoUpdate as any);
    on("passenger:live_update", handlePassengerLiveUpdate as any);

    return () => {
      off("matatus:live_update", handleMatatuUpdate);
      off("matatu:live_update", handleMatatuUpdate as any);
      off("ride:assigned", handleRideAssigned as any);
      off("ride:created", handleRideCreated as any);
      off("sacco:update", handleSaccoUpdate as any);
      off("passenger:live_update", handlePassengerLiveUpdate as any);
    };
  }, [connect, on, off, addNotification]);

  const setDriverOnline = useCallback(
    (online: boolean) => {
      setDriverOnlineState(online);

      const nextMode: Mode = online ? "driver" : "passenger";
      setActiveModeState(nextMode);

      emit(online ? "driver:online" : "driver:offline", { online });

      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(MODE_STORAGE_KEY, nextMode);
        } catch (error) {
          console.error("[realtime] failed to persist mode to storage", error);
        }
      }

      console.log("[realtime] setDriverOnline", { online, mode: nextMode });
    },
    [emit]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!user) return;

    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(MODE_STORAGE_KEY);
    } catch (error) {
      console.error("[realtime] failed to read mode from storage for role init", error);
    }

    if (stored === "driver" || stored === "passenger") {
      return;
    }

    const role = (user as any)?.role as string | undefined;
    if (role === "driver") {
      setDriverOnline(true);
    } else {
      setDriverOnline(false);
    }
  }, [user, setDriverOnline]);

  const value: RealtimeContextValue = useMemo(
    () => ({ matatus, lastRideAssigned, driverOnline, setDriverOnline, activeMode }),
    [matatus, lastRideAssigned, driverOnline, setDriverOnline, activeMode]
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtime(): RealtimeContextValue {
  const ctx = useContext(RealtimeContext);

  if (!ctx) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }

  return ctx;
}
