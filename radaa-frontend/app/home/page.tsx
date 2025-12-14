"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useBoltLiveRadar } from "@/src/features/bolt/hooks/useBoltLiveRadar";
import type { BoltBounds } from "@/src/features/bolt/types";

const LiveRadarMap = dynamic(
  () => import("@/src/features/bolt/components/LiveRadarMap"),
  { ssr: false },
);

export default function AboutPage() {
  const { matatus, displayPositions, bounds, setBounds, loading } =
    useBoltLiveRadar();

  const driversOnline = matatus.length;

  const handleBoundsChange = (next: BoltBounds | null) => {
    setBounds(next);
  };

  return (
    <div className="relative min-h-dvh pb-20 pt-4 text-xs">
      <LiveRadarMap
        matatus={matatus}
        displayPositions={displayPositions}
        bounds={bounds}
        onBoundsChange={handleBoundsChange}
        loading={loading}
      />

      <main className="relative z-10 mx-auto flex max-w-md flex-col gap-4 px-3 sm:px-4">
        <section className="radaa-glass-card space-y-3 p-4">
          <p className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
            Kaa Radaa ujue mat yako iko wapi
          </p>
          <h1 className="text-lg font-semibold tracking-tight sm:text-2xl">
            Radaa is your live matatu radar.
          </h1>
          <p className="text-slate-300">
            See nearby matatus in real time, choose your route with confidence,
            and keep your fares and trips in one tidy place.
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Live view powered by drivers and SACCOS along Nairobi corridors.
            </span>
            <span className="rounded-full bg-slate-900/70 px-2 py-0.5 text-emerald-300">
              {driversOnline} online
            </span>
          </div>
          <div className="flex gap-2 pt-1">
            <Link href="/map" className="radaa-btn-primary text-[11px]">
              Open live map
            </Link>
            <Link href="/gallery" className="radaa-btn-secondary text-[11px]">
              Browse gallery
            </Link>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <div className="radaa-card-soft space-y-2 p-3">
            <h2 className="text-xs font-semibold text-slate-100">
              How Radaa works
            </h2>
            <ul className="space-y-1.5 pl-4 text-[11px] text-slate-300 list-disc marker:text-slate-500">
              <li>Check live matatus and routes before you walk to the stage.</li>
              <li>Track recent trips and loyalty rewards in one place.</li>
              <li>Keep fares organised, digital or cash.</li>
            </ul>
          </div>

          <div className="radaa-card-soft space-y-2 p-3">
            <h2 className="text-xs font-semibold text-slate-100">
              Safety &amp; trust
            </h2>
            <p className="text-[11px] text-slate-300">
              Radaa is built to make everyday public transport feel more
              transparent. We focus on clear information, predictable routes,
              and trip history that you can reference later.
            </p>
            <p className="text-[10px] text-slate-400">
              Radaa does not replace official safety channels. In any emergency,
              always contact local authorities or your SACCO operator first.
            </p>
          </div>
        </section>

        <section className="radaa-card-soft space-y-2 p-3">
          <h2 className="text-xs font-semibold text-slate-100">
            Terms, privacy &amp; data
          </h2>
          <p className="text-[11px] text-slate-300">
            We use your location and basic profile details to show nearby
            matatus, calculate routes, and keep your trip history and wallet in
            sync. Location is only accessed while you&apos;re actively using live
            features like the map or ride requests.
          </p>
          <p className="text-[10px] text-slate-400">
            By using Radaa you agree that your data may be processed to provide
            transport services, improve reliability, and prevent fraud.
          </p>
          <p className="pt-1 text-[10px] text-slate-500">
            Radaa is an experimental mobility product built for Kenyan public
            transport. Features may change over time as we test, learn, and ship
            improvements.
          </p>
        </section>
      </main>
    </div>
  );
}
