"use client";

import { useEffect, useState } from "react";
import { emitEvent } from "@/lib/sockets";
import { haversineDistanceMeters, type LatLng } from "@/lib/location/distance";
import { useNotifications } from "@/context/NotificationContext";

interface ActiveRequestWatcherProps {
  requestId: string;
  pickupLocation: LatLng;
  apiBaseUrl?: string;
}

export function ActiveRequestWatcher({
  requestId,
  pickupLocation,
  apiBaseUrl,
}: ActiveRequestWatcherProps) {
  const { addNotification } = useNotifications();
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!navigator.geolocation) return;
    if (cancelled) return;

    let watchId: number | null = null;

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (cancelled) return;

        const current: LatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const distance = haversineDistanceMeters(current, pickupLocation);

        if (!Number.isFinite(distance)) return;

        if (distance > 500) {
          setCancelled(true);

          const root =
            apiBaseUrl ||
            process.env.NEXT_PUBLIC_API_URL ||
            process.env.NEXT_PUBLIC_API_BASE_URL ||
            "";

          const urlBase = root.replace(/\/+$/, "");

          const run = async () => {
            try {
              const primary = await fetch(
                `${urlBase}/api/requests/${encodeURIComponent(requestId)}`,
                { method: "DELETE" },
              );

              if (!primary.ok) {
                await fetch(
                  `${urlBase}/api/requests/${encodeURIComponent(requestId)}/cancel`,
                  { method: "POST" },
                );
              }
            } catch {
              // swallow network errors; UI still treats as cancelled locally
            }

            emitEvent("request:cancelled", { id: requestId });

            addNotification({
              type: "trip",
              title: "Request cancelled — you moved too far",
              message:
                "We auto-cancelled your pickup after you moved more than 500m from the original pin.",
            });
          };

          void run();
        }
      },
      () => {
        // ignore geolocation errors for watcher; main flows can report separately
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => {
      if (watchId != null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [requestId, pickupLocation, apiBaseUrl, cancelled, addNotification]);

  return null;
}
