"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getProfile, type AuthUser } from "@/lib/api/auth";
import { getLiveMatatus, getLoyaltyStatus } from "@/lib/api";
import RideRequestButton from "@/components/RideRequestButton";

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

interface LiveMatatuPreview {
  id: string;
  plate?: string;
  numberPlate?: string;
  route?: string;
}

interface DashboardStats {
  activeMatatus: number;
  liveSample: LiveMatatuPreview[];
  loyalty: LoyaltyStatus | null;
}

export default function DashboardHomePage() {
  const { user, token, logout } = useAuth();

  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getProfile(token);
        if (!cancelled) {
          setProfile(result);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load profile";
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
  }, [token]);

  const effectiveUser = profile ?? user;

  useEffect(() => {
    const id = (profile ?? user)?._id;
    if (!id) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      setStatsLoading(true);
      try {
        const [liveMatatus, loyalty] = await Promise.all([
          getLiveMatatus().catch(() => []),
          getLoyaltyStatus(id).catch(() => null),
        ]);

        if (cancelled) return;

        const array = Array.isArray(liveMatatus)
          ? (liveMatatus as LiveMatatuPreview[])
          : [];

        setStats({
          activeMatatus: array.length,
          liveSample: array.slice(0, 6),
          loyalty: loyalty as LoyaltyStatus | null,
        });
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [profile, user]);

  const activeTripsCount = 0; // placeholder until trips API is wired

  return (
    <div className="radaa-dashboard-bg">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back{effectiveUser ? ", " : ""}
            {effectiveUser?.username}
          </h1>
          <p className="text-xs text-slate-300">
            Your central hub for matatus, trips, loyalty, and payments.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-sm transition hover:border-red-500/60 hover:bg-red-600/10 hover:text-red-200"
        >
          Log out
        </button>
      </header>

      <section className="radaa-card space-y-2 p-3 text-xs">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Quick actions
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <Link
            href="/map"
            className="inline-flex flex-none items-center justify-center rounded-md border border-sky-600/40 bg-sky-600/15 px-3 py-1.5 font-medium text-sky-200 transition hover:border-sky-400/70 hover:bg-sky-600/25"
          >
            Open live map
          </Link>
          <Link
            href="/dashboard/matatus/list"
            className="inline-flex flex-none items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/90"
          >
            View matatus
          </Link>
          <Link
            href="/dashboard/trips/list"
            className="inline-flex flex-none items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/90"
          >
            View trips
          </Link>
          <Link
            href="/payments"
            className="inline-flex flex-none items-center justify-center rounded-md border border-emerald-600/40 bg-emerald-600/10 px-3 py-1.5 font-medium text-emerald-200 transition hover:border-emerald-400/70 hover:bg-emerald-600/20"
          >
            Payments & wallet
          </Link>
          <RideRequestButton />
        </div>
      </section>

      {loading && (
        <div className="radaa-card p-4 text-xs text-slate-300">
          Loading your profile...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200">
          {error}
        </div>
      )}

      {effectiveUser && !loading && !error && (
        <>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="radaa-card p-4 text-xs">
              <div className="text-slate-400">Email</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">
                {effectiveUser.email}
              </div>
            </div>
            <div className="radaa-card p-4 text-xs">
              <div className="text-slate-400">Handle</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">
                {effectiveUser.handle || "Not set"}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
              <div className="text-slate-400">Joined</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">
                {effectiveUser.createdAt
                  ? new Date(effectiveUser.createdAt).toLocaleDateString()
                  : "—"}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
              <div className="text-slate-400">Active matatus</div>
              <div className="mt-1 text-lg font-semibold text-sky-400">
                {statsLoading ? "—" : (stats?.activeMatatus ?? 0)}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Based on current live map data.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
              <div className="text-slate-400">Wallet summary</div>
              <div className="mt-1 text-lg font-semibold text-emerald-400">
                KES {stats?.loyalty?.balance ?? 0}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Loyalty points: {stats?.loyalty?.loyaltyPoints ?? 0}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
              <div className="text-slate-400">Trip stats</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">
                {stats?.loyalty?.ridesTaken ?? 0} rides taken
              </div>
              <div className="mt-1 text-xs text-slate-300">
                Paid rides: {stats?.loyalty?.ridesPaid ?? 0}
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-sky-500"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(
                        100,
                        ((stats?.loyalty?.loyalty?.paidRidesCount ?? 0) / 10) *
                          100,
                      ),
                    )}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                {stats?.loyalty?.loyalty?.paidRidesCount ?? 0}/10 paid rides
                towards a free ride.
              </p>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
            <div className="radaa-card p-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-100">
                    Live map preview
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Quick glance at matatus currently online. Open the full map
                    for details.
                  </div>
                </div>
                <a
                  href="/map"
                  className="text-[11px] font-medium text-sky-400 hover:text-sky-300"
                >
                  Open map
                </a>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                {statsLoading && (
                  <div className="col-span-3 h-16 animate-pulse rounded-lg bg-slate-800/60" />
                )}
                {!statsLoading && stats?.liveSample.length === 0 && (
                  <p className="col-span-3 text-slate-400">
                    No live matatus at the moment.
                  </p>
                )}
                {!statsLoading &&
                  stats?.liveSample.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/80 px-2 py-2"
                    >
                      <div>
                        <div className="text-[11px] font-semibold text-slate-100">
                          {m.plate || m.numberPlate || m.id.slice(0, 4)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {m.route ?? "Route TBD"}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-3 radaa-card p-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-100">
                    Your active trips
                  </div>
                  <div className="text-[11px] text-slate-400">
                    When a trip is live, it will appear here with quick actions.
                  </div>
                </div>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
                  {activeTripsCount}
                </span>
              </div>
              <div className="rounded-md border border-dashed border-slate-700 bg-slate-900/60 px-3 py-4 text-[11px] text-slate-400">
                No active trips right now. Start a ride from your matatu or
                trips section.
              </div>
              <a
                href="/dashboard/trips/list"
                className="inline-flex items-center text-[11px] font-medium text-sky-400 hover:text-sky-300"
              >
                View all trips
              </a>
            </div>
          </section>
        </>
      )}

      {!loading && !effectiveUser && !error && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-100">
          We couldn&apos;t find your profile details. Try signing out and back
          in again.
        </div>
      )}
    </div>
  );
}
