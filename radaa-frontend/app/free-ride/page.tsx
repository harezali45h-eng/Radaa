"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getLoyaltyStatus } from "@/lib/api";

interface LoyaltyStatus {
  userId: string;
  balance: number;
  ridesTaken: number;
  ridesPaid: number;
  loyaltyPoints: number;
  loyalty?: {
    paidRidesCount: number;
    freeRides: number;
  };
}

export default function FreeRidePage() {
  const { user } = useAuth();
  const [loyalty, setLoyalty] = useState<LoyaltyStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = user?._id;
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLoyaltyStatus(userId);
        if (!cancelled) {
          setLoyalty(data as LoyaltyStatus);
        }
      } catch (err: any) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load loyalty";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const paidRides = loyalty?.loyalty?.paidRidesCount ?? loyalty?.ridesPaid ?? 0;
  const totalRides = loyalty?.ridesTaken ?? 0;
  const points = loyalty?.loyaltyPoints ?? 0;
  const freeRides = loyalty?.loyalty?.freeRides ?? 0;

  const step = 10;
  const completedSteps = Math.floor(paidRides / step);
  const currentLevel = completedSteps + 1;
  const ridesIntoCurrentCycle = paidRides % step;
  const ridesToNextReward = step - (ridesIntoCurrentCycle || 0);
  const progressPercent = Math.min(100, (ridesIntoCurrentCycle / step) * 100);

  return (
    <div className="space-y-8 text-xs">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Loyalty Progress</h1>
        <p className="max-w-md text-slate-300">
          Earn free rides by taking paid trips with Radaa. Every {step} paid
          rides unlocks a new reward.
        </p>
      </header>

      {!user && (
        <p className="text-slate-300">
          Sign in to see your loyalty progress and free ride balance.
        </p>
      )}

      {user && loading && (
        <div className="space-y-3">
          <div className="h-3 w-40 animate-pulse rounded-full bg-slate-800/70" />
          <div className="h-2.5 w-full animate-pulse rounded-full bg-slate-800/70" />
          <div className="h-2 w-56 animate-pulse rounded-full bg-slate-800/70" />
        </div>
      )}

      {user && !loading && error && (
        <p className="text-sm text-red-300">{error}</p>
      )}

      {user && !loading && !error && loyalty && (
        <section className="space-y-4">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Current cycle
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900">
              <div
                className="h-full rounded-full bg-gradient-to-r from-radaa-orange via-twilightPurple to-radaa-mint"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>
                {ridesIntoCurrentCycle}/{step} paid rides this cycle
              </span>
              <span>
                {ridesToNextReward === step
                  ? "Free ride ready after your next 10 paid rides"
                  : `${ridesToNextReward} more paid rides to your next free ride`}
              </span>
            </div>
          </div>

          <dl className="grid gap-3 text-[11px] md:grid-cols-3">
            <div className="flex flex-col gap-0.5 border-b border-slate-800/70 pb-2 md:border-b-0 md:border-r md:pr-4">
              <dt className="text-slate-400">Current level</dt>
              <dd className="text-sm font-semibold text-slate-100">
                Level {currentLevel}
              </dd>
              <span className="text-[10px] text-slate-500">
                Each level represents a block of {step} paid rides.
              </span>
            </div>

            <div className="flex flex-col gap-0.5 border-b border-slate-800/70 pb-2 md:border-b-0 md:border-r md:px-4">
              <dt className="text-slate-400">Free rides available</dt>
              <dd className="text-sm font-semibold text-emerald-300">
                {freeRides}
              </dd>
              <span className="text-[10px] text-slate-500">
                Automatically applied on eligible trips.
              </span>
            </div>

            <div className="flex flex-col gap-0.5 md:pl-4">
              <dt className="text-slate-400">Lifetime stats</dt>
              <dd className="text-sm font-semibold text-slate-100">
                {totalRides} rides · {points} points
              </dd>
              <span className="text-[10px] text-slate-500">
                Points and rides include all your historical Radaa trips.
              </span>
            </div>
          </dl>
        </section>
      )}
    </div>
  );
}
