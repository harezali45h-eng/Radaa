"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/context/AuthContext";
import { useRealtime } from "@/context/realtimeContext";
import { useNotifications } from "@/context/NotificationContext";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";
import { useRideIntent } from "@/context/RideIntentContext";

export interface DriverRequestLocation {
  lat: number;
  lng: number;
}

export interface DriverAssignedRequest {
  requestId: string;
  distanceMeters: number | null;
  etaSeconds: number | null;
  acceptTimeoutSeconds: number | null;
  pickup: DriverRequestLocation | null;
  destination: DriverRequestLocation | null;
}

export interface UseDriverRealtimeResult {
  driverOnline: boolean;
  currentRequest: DriverAssignedRequest | null;
  timeLeftSeconds: number | null;
  location: DriverRequestLocation | null;
  goOnline: () => void;
  goOffline: () => void;
  acceptCurrentRequest: () => void;
  rejectCurrentRequest: () => void;
}

export function useDriverRealtime(): UseDriverRealtimeResult {
  const { user, token } = useAuth();
  const { driverOnline, setDriverOnline } = useRealtime();
  const { connect, emit, on, off } = useSocket();
  const { addNotification } = useNotifications();
  const { intent } = useRideIntent();
  const requireDestinationForLive = useIsFeatureEnabled("driver_onboard_v1", false);

  const [currentRequest, setCurrentRequest] = useState<DriverAssignedRequest | null>(
    null,
  );
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);
  const [location, setLocation] = useState<DriverRequestLocation | null>(null);

  const driverId = useMemo(() => {
    const raw: any = user || null;
    return raw && typeof raw._id === "string" ? raw._id : null;
  }, [user]);

  useEffect(() => {
    if (!token) return;
    connect(token);
  }, [token, connect]);

  useEffect(() => {
    if (!driverOnline) return;
    if (typeof window === "undefined" || !navigator.geolocation) return;

    let cancelled = false;
    let watchId: number | null = null;

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (cancelled) return;

        const next: DriverRequestLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(next);

        emit("driver:update_location", {
          lat: next.lat,
          lng: next.lng,
        });
      },
      () => {
        if (cancelled) return;
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => {
      cancelled = true;
      if (
        watchId != null &&
        typeof window !== "undefined" &&
        navigator.geolocation
      ) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [driverOnline, emit]);

  useEffect(() => {
    if (!currentRequest || !expiresAt) {
      setTimeLeftSeconds(null);
      return;
    }

    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const now = Date.now();
      const raw = Math.round((expiresAt - now) / 1000);
      const clamped = Number.isFinite(raw) ? Math.max(0, raw) : null;
      setTimeLeftSeconds(clamped);
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [currentRequest, expiresAt]);

  useEffect(() => {
    const handleAssigned = (payload: any) => {
      if (!payload) return;

      const rawRequestId = payload.requestId ?? payload.id ?? payload._id;
      if (!rawRequestId) return;

      const driverMatch = payload.driverId
        ? String(payload.driverId) === String(driverId)
        : true;

      if (!driverMatch) return;

      const distance =
        typeof payload.distanceMeters === "number" &&
        Number.isFinite(payload.distanceMeters)
          ? payload.distanceMeters
          : null;

      const etaSeconds =
        typeof payload.etaSeconds === "number" &&
        Number.isFinite(payload.etaSeconds)
          ? payload.etaSeconds
          : null;

      const timeoutSeconds =
        typeof payload.acceptTimeoutSeconds === "number" &&
        Number.isFinite(payload.acceptTimeoutSeconds)
          ? payload.acceptTimeoutSeconds
          : null;

      const normalizePoint = (value: any): DriverRequestLocation | null => {
        if (!value) return null;
        if (typeof value.lat === "number" && typeof value.lng === "number") {
          return { lat: value.lat, lng: value.lng };
        }
        if (
          Array.isArray(value.coordinates) &&
          value.coordinates.length === 2 &&
          typeof value.coordinates[1] === "number" &&
          typeof value.coordinates[0] === "number"
        ) {
          return {
            lat: value.coordinates[1],
            lng: value.coordinates[0],
          };
        }
        return null;
      };

      const pickup = normalizePoint(payload.pickup ?? payload.pickupLocation);
      const destination = normalizePoint(payload.destination ?? payload.dropoff);

      const assigned: DriverAssignedRequest = {
        requestId: String(rawRequestId),
        distanceMeters: distance,
        etaSeconds,
        acceptTimeoutSeconds: timeoutSeconds,
        pickup,
        destination,
      };

      setCurrentRequest(assigned);

      if (timeoutSeconds && timeoutSeconds > 0) {
        setExpiresAt(Date.now() + timeoutSeconds * 1000);
      } else {
        setExpiresAt(null);
      }

      addNotification({
        type: "trip",
        title: "New ride request",
        message: "A passenger has been assigned to you.",
      });
    };

    const handleAccepted = (payload: any) => {
      if (!payload) return;
      const rawRequestId = payload.requestId ?? payload.id ?? payload._id;
      if (!rawRequestId) return;

      setCurrentRequest((current) => {
        if (!current) return current;
        if (current.requestId !== String(rawRequestId)) return current;
        return null;
      });
      setExpiresAt(null);
      setTimeLeftSeconds(null);
    };

    const handleFailed = (payload: any) => {
      if (!payload) return;
      const rawRequestId = payload.requestId ?? payload.id ?? payload._id;
      if (!rawRequestId) return;

      setCurrentRequest((current) => {
        if (!current) return current;
        if (current.requestId !== String(rawRequestId)) return current;
        return null;
      });
      setExpiresAt(null);
      setTimeLeftSeconds(null);
    };

    on("request:assigned", handleAssigned as any);
    on("request:accepted", handleAccepted as any);
    on("request:failed", handleFailed as any);

    return () => {
      off("request:assigned", handleAssigned as any);
      off("request:accepted", handleAccepted as any);
      off("request:failed", handleFailed as any);
    };
  }, [on, off, addNotification, driverId]);

  const goOnline = useCallback(() => {
    const role = (user as any)?.role as string | undefined;
    if (!role || role !== "driver") {
      return;
    }

    if (requireDestinationForLive && !intent.destination) {
      addNotification({
        type: "system",
        title: "Destination required",
        message:
          "Set a passenger destination in the dashboard before going live.",
      });
      return;
    }

    setDriverOnline(true);

    emit("driver:availability", {
      state: "available",
      available: true,
    });
  }, [
    emit,
    setDriverOnline,
    user,
    intent.destination,
    addNotification,
    requireDestinationForLive,
  ]);

  const goOffline = useCallback(() => {
    const role = (user as any)?.role as string | undefined;
    if (!role || role !== "driver") {
      return;
    }

    setDriverOnline(false);

    emit("driver:availability", {
      state: "offline",
      available: false,
    });
  }, [emit, setDriverOnline, user]);

  const acceptCurrentRequest = useCallback(() => {
    if (!currentRequest) return;

    emit(
      "request:accept",
      { requestId: currentRequest.requestId },
      (response: any) => {
        if (response && response.success) {
          setCurrentRequest(null);
          setExpiresAt(null);
          setTimeLeftSeconds(null);
          addNotification({
            type: "trip",
            title: "Ride accepted",
            message: "The passenger has been notified of your acceptance.",
          });
        } else if (response && response.error) {
          addNotification({
            type: "system",
            title: "Could not accept ride",
            message: String(response.error),
          });
        }
      },
    );
  }, [currentRequest, emit, addNotification]);

  const rejectCurrentRequest = useCallback(() => {
    if (!currentRequest) return;

    emit(
      "request:reject",
      { requestId: currentRequest.requestId },
      (response: any) => {
        if (response && response.success) {
          setCurrentRequest(null);
          setExpiresAt(null);
          setTimeLeftSeconds(null);
        } else if (response && response.error) {
          addNotification({
            type: "system",
            title: "Could not reject ride",
            message: String(response.error),
          });
        }
      },
    );
  }, [currentRequest, emit, addNotification]);

  return {
    driverOnline,
    currentRequest,
    timeLeftSeconds,
    location,
    goOnline,
    goOffline,
    acceptCurrentRequest,
    rejectCurrentRequest,
  };
}
