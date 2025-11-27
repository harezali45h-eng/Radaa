"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getLoyaltyStatus } from "../../lib/api";

interface LoyaltyStatus {
  userId: string;
  balance: number;
  ridesTaken: number;
  ridesPaid: number;
  loyaltyPoints: number;
  loyalty: {
    paidRidesCount: number;
    freeRides: number;
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [data, setData] = useState<LoyaltyStatus | null>(null);

  useEffect(() => {
    const userId = typeof window !== "undefined" ? window.localStorage.getItem("radaa_user_id") : null;
    if (!userId) return;
    getLoyaltyStatus(userId)
      .then((res) => setData(res))
      .catch(() => undefined);
  }, []);

  const progress = data ? (data.loyalty.paidRidesCount / 10) * 100 : 0;

  const isDriver = (user as any)?.role === "driver";

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Your Profile</h1>
        <p className="text-xs text-slate-300">
          This screen focuses on your ride and loyalty stats. Hook it up to your auth profile data
          later.
        </p>
      </section>

      {isDriver && user && (
        <section className="space-y-3 radaa-card p-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-100">Driver profile</div>
              <div className="text-[11px] text-slate-400">
                Basic details for your driver account.
              </div>
            </div>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
              Verification:{" "}
              <span className="font-semibold">
                {(user as any).driverVerificationStatus || "pending"}
              </span>
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <div className="text-slate-400">Name</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">{user.username}</div>
            </div>
            <div>
              <div className="text-slate-400">Driver ID</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">{user._id}</div>
            </div>
            <div>
              <div className="text-slate-400">Phone</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">
                {user.phone || "Not set"}
              </div>
            </div>
            <div>
              <div className="text-slate-400">License number</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">
                {(user as any).driverProfile?.licenseNumber || "Not set"}
              </div>
            </div>
            <div>
              <div className="text-slate-400">SACCO</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">
                {(user as any).driverProfile?.saccoName || "Not set"}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Vehicle</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">
                {(user as any).driverProfile?.vehicleRegistration || "Not set"}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="radaa-card p-4 text-xs">
          <div className="text-slate-400">Balance</div>
          <div className="mt-1 text-lg font-semibold text-emerald-400">
            KES {data?.balance ?? 0}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
          <div className="text-slate-400">Rides taken</div>
          <div className="mt-1 text-lg font-semibold">{data?.ridesTaken ?? 0}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
          <div className="text-slate-400">Free rides available</div>
          <div className="mt-1 text-lg font-semibold text-amber-300">
            {data?.loyalty?.freeRides ?? 0}
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Loyalty progress</div>
            <div className="text-slate-400">Complete 10 paid rides to unlock a free ride.</div>
          </div>
          <div className="text-right text-slate-300">
            {data?.loyalty.paidRidesCount ?? 0}/10 paid rides
          </div>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-400"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      </section>
    </div>
  );
}
