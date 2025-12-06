"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { requestRide } from "@/lib/api/rides";
import { useTheme } from "@/context/ThemeContext";

export default function RideRequestButton() {
  const { token } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const { primaryButtonClass } = useTheme();

  const handleClick = () => {
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
        message:
          "This device does not support location. Try a modern browser like Chrome on your phone.",
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
                lng: position.coords.longitude,
              },
            },
            token,
          );

          addNotification({
            type: "trip",
            title: "Ride requested",
            message: "We are finding a nearby driver for you.",
          });
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
        const code =
          error && typeof error.code === "number" ? (error.code as number) : 0;

        let message: string;
        if (code === 1) {
          message =
            "Location access is blocked. Please allow location for Radaa in your browser settings and try again.";
        } else if (code === 2) {
          message =
            "We couldn't get a GPS fix. Check that location is turned on and you have a good network signal.";
        } else if (code === 3) {
          message =
            "It is taking a bit long to find you. Move closer to a window or check your network, then try again.";
        } else {
          message = error?.message || "Unable to fetch your current location.";
        }

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

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`${primaryButtonClass} ride-cta-twende flex-none text-[11px] px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {loading ? "Locating you… please stand by." : "Request Ride – Twende!"}
    </button>
  );
}
