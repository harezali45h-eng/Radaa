"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { requestRide } from "@/lib/api/rides";
import { useTheme } from "@/context/ThemeContext";
import { calculateFareWithFee } from "@/utils/payments";

const payFare = async (amount: number, phone: string) => {
  try {
    const res = await fetch("/api/mpesa/pay", {
      method: "POST",
      body: JSON.stringify({ fare: amount, phone }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert("Payment failed: " + JSON.stringify(data.error || data));
      return;
    }

    alert("Check your phone for MPesa STK Popup!");
  } catch (error: any) {
    alert("Payment failed: " + (error?.message || "Unexpected error"));
  }
};

export default function RideRequestButton() {
  const { user, token } = useAuth();
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
        message: "Geolocation is not available in this browser.",
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

          if (typeof window !== "undefined") {
            const fareInput = window.prompt(
              "Enter agreed fare (KES)",
              "",
            );

            if (!fareInput) {
              return;
            }

            const fareValue = Number(fareInput);

            if (Number.isNaN(fareValue) || fareValue <= 0) {
              alert("Invalid fare amount. Please enter a positive number.");
              return;
            }

            const defaultPhone = user?.phone || "";

            const phoneInput = window.prompt(
              "Confirm Mpesa phone number (2547xxxxxxxx)",
              defaultPhone,
            );

            if (!phoneInput) {
              return;
            }

            const { totalCharge } = calculateFareWithFee(fareValue);

            await payFare(totalCharge, phoneInput);
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

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`${primaryButtonClass} flex-none rounded-full px-5 py-2 text-[11px] font-medium disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {loading ? "Requesting ride..." : "Request ride"}
    </button>
  );
}
