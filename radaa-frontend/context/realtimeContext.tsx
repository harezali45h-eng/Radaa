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
}

const RealtimeContext = createContext<RealtimeContextValue | undefined>(undefined);

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { connect, on, off, emit } = useSocket();
  const { addNotification } = useNotifications();

  const [matatus, setMatatus] = useState<RealtimeMatatu[]>([]);
  const [lastRideAssigned, setLastRideAssigned] = useState<RideAssignedPayload | null>(null);
  const [driverOnline, setDriverOnlineState] = useState(false);

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
      emit(online ? "driver:online" : "driver:offline", { online });
    },
    [emit]
  );

  const value: RealtimeContextValue = useMemo(
    () => ({ matatus, lastRideAssigned, driverOnline, setDriverOnline }),
    [matatus, lastRideAssigned, driverOnline, setDriverOnline]
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
