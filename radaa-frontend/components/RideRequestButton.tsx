"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { requestRide } from "@/lib/api/rides";

export default function RideRequestButton() {
  const { token } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (!token) {
      addNotification({
        type: "system",
        title: "Sign in required",
        message: "You need to be signed in to request a ride."
      });
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      addNotification({
        type: "system",
        title: "Location unavailable",
        message: "Geolocation is not available in this browser."
      });
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await requestRide(
            {
              pickup: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            },
            token
          );

          addNotification({
            type: "trip",
            title: "Ride requested",
            message: "We are finding a nearby driver for you."
          });
        } catch (error: any) {
          const message = error instanceof Error ? error.message : "Failed to request ride";
          addNotification({
            type: "system",
            title: "Ride request failed",
            message
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
          message
        });
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex flex-none items-center justify-center rounded-md border border-emerald-600/40 bg-emerald-600/10 px-3 py-1.5 text-[11px] font-medium text-emerald-200 transition hover:border-emerald-400/70 hover:bg-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Requesting ride..." : "Request a ride"}
    </button>
  );
}
