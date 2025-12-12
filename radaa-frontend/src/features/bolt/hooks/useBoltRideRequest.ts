"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";
import { requestRide, estimateFare } from "@/lib/api/rides";
import type { BoltLatLng } from "@/src/features/bolt/types";

export function useBoltRideRequest() {
  const { user, token } = useAuth();
  const { addNotification } = useNotifications();
  const fareSuggestionsEnabled = useIsFeatureEnabled(
    "ff_fare_suggestions",
    false,
  );
  const [loading, setLoading] = useState(false);

  const requestRideTo = async (
    destination: BoltLatLng,
    options?: { routeName?: string },
  ) => {
    if (!token) {
      addNotification({
        type: "system",
        title: "Sign in required",
        message: "You need to be signed in to request a ride.",
      });
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      addNotification({
        type: "system",
        title: "Location unavailable",
        message: "Geolocation is not available in this browser.",
      });
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const pickup = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          let suggestedFare: number | null = null;

          if (fareSuggestionsEnabled) {
            try {
              const estimate = await estimateFare(
                {
                  pickup,
                  destination,
                  routeName: options?.routeName,
                },
                token,
              );

              if (
                estimate &&
                typeof estimate.suggestedFare === "number" &&
                Number.isFinite(estimate.suggestedFare)
              ) {
                suggestedFare = Math.max(1, Math.round(estimate.suggestedFare));
              }
            } catch {
              suggestedFare = null;
            }
          }

          await requestRide(
            {
              pickup,
              destination,
            },
            token,
          );

          addNotification({
            type: "trip",
            title: "Ride requested",
            message: "We are finding a nearby driver for you.",
          });

          if (suggestedFare != null && user) {
            // Keep this lightweight: surface suggestion but leave payment to
            // existing wallet / payment flows.
            addNotification({
              type: "system",
              title: "Suggested fare",
              message: `Suggested fare to your destination: KES ${suggestedFare}.`,
            });
          }
        } catch (error: any) {
          const message =
            error instanceof Error ? error.message : "Failed to request ride";
          addNotification({
            type: "system",
            title: "Ride request failed",
            message,
          });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        const message = error?.message || "Unable to fetch current location.";
        addNotification({
          type: "system",
          title: "Location error",
          message,
        });
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  return { requestRideTo, loading };
}
