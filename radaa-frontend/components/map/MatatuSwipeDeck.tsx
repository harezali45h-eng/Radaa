"use client";

import { useEffect, useMemo, useState } from "react";

export interface SwipeMatatu {
  id: string;
  plate?: string;
  numberPlate?: string;
  route?: string;
  sacco?: string;
  mainPhotoUrl?: string | null;
  rating?: {
    avgRating: number;
    count: number;
  };
  distanceMeters?: number;
  etaMinutes?: number | null;
}

interface MatatuSwipeDeckProps {
  items: SwipeMatatu[];
  onSelect?: (id: string) => void;
}

export function MatatuSwipeDeck({ items, onSelect }: MatatuSwipeDeckProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex((prev) => {
      if (items.length === 0) return 0;
      return prev >= items.length ? 0 : prev;
    });
  }, [items.length]);

  const active = items[index] ?? null;
  const remainingCount = Math.max(0, items.length - index - (active ? 1 : 0));

  const title = useMemo(() => {
    if (!active) return "No matatus nearby";
    if (active.route) return active.route;
    return "Matatu";
  }, [active]);

  const subtitle = useMemo(() => {
    if (!active) return "";
    if (active.sacco) return active.sacco;
    return "Swipe through nearby options";
  }, [active]);

  const handleSkip = () => {
    setIndex((prev) => (prev + 1 < items.length ? prev + 1 : prev));
  };

  const handleLike = () => {
    if (active && onSelect) {
      onSelect(active.id);
    }
    setIndex((prev) => (prev + 1 < items.length ? prev + 1 : prev));
  };

  if (!active) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
        No nearby matatus to show right now.
      </div>
    );
  }

  const displayPlate =
    active.plate || active.numberPlate || active.id.slice(0, 6);
  const km =
    active.distanceMeters != null ? active.distanceMeters / 1000 : null;
  const eta = active.etaMinutes != null ? Math.round(active.etaMinutes) : null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs shadow-soft backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Nearby match
          </div>
          <div className="text-sm font-semibold text-slate-50">{title}</div>
          {subtitle && (
            <div className="text-[11px] text-slate-400">{subtitle}</div>
          )}
        </div>
        {remainingCount > 0 && (
          <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] text-slate-400">
            +{remainingCount} more
          </span>
        )}
      </div>

      <div className="relative mb-3 overflow-hidden rounded-xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900">
        {active.mainPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={active.mainPhotoUrl}
            alt={displayPlate}
            className="h-32 w-full object-cover opacity-90"
          />
        ) : (
          <div className="flex h-32 items-center justify-center text-[11px] text-slate-400">
            Live matatu preview
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-slate-100">
          <div>
            <div className="font-semibold">{displayPlate}</div>
            {active.route && (
              <div className="text-slate-300">Route {active.route}</div>
            )}
          </div>
          <div className="text-right text-[10px] text-slate-200">
            {km != null && <div>{km.toFixed(1)} km away</div>}
            {eta != null && <div>~{eta} min ETA</div>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleSkip}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-medium text-slate-200 shadow-sm transition hover:border-slate-500 hover:bg-slate-800"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={handleLike}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-sky-500 bg-sky-600/80 px-3 py-1.5 text-[11px] font-semibold text-slate-50 shadow-soft transition hover:bg-sky-500"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default MatatuSwipeDeck;
