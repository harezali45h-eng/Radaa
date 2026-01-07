"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { BoltMatatuProfile } from "@/src/features/bolt/types";
import { boltCardClass, boltSecondaryButtonClass } from "@/src/features/bolt/utils/theme";

interface TinderGalleryProps {
  items: BoltMatatuProfile[];
  onOpenOnMap?: (matatuId: string) => void;
}

export function TinderGallery({ items, onOpenOnMap }: TinderGalleryProps) {
  const [index, setIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const active = items[index] ?? null;
  const remaining = Math.max(0, items.length - index - (active ? 1 : 0));

  const title = useMemo(() => {
    if (!active) return "No matatus yet";
    if (active.route) return active.route;
    return "Matatu";
  }, [active]);

  const subtitle = useMemo(() => {
    if (!active) return "Check back when matatus become available";
    return active.sacco || "Browse nearby matatus";
  }, [active]);

  const handleAdvance = () => {
    setIndex((prev) => (prev + 1 < items.length ? prev + 1 : prev));
    setImageError(false);
  };

  const handleSkip = () => {
    handleAdvance();
  };

  const handleLike = () => {
    // For now, liking is purely client-side. This can later hook into
    // preferences without touching existing logic.
    handleAdvance();
  };

  const handleOpenOnMap = () => {
    if (active && onOpenOnMap) {
      onOpenOnMap(active.id);
    }
  };

  const handleShare = async () => {
    if (!active) return;

    const plate = active.plate || active.numberPlate || active.id;
    const route = active.route ? ` on route ${active.route}` : "";

    const text = `Check this matatu ${plate}${route} on Radaa.`;

    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ text });
      } catch {
        // ignore share cancellation/errors
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        // Silent copy to clipboard keeps this additive.
      } catch {
        // ignore
      }
    }
  };

  if (!active) {
    return (
      <div className="radaa-neon-card p-4 text-xs text-slate-300">
        <div className="relative z-10">
          No nearby matatus to show right now. Kaa Radaa ujue mat yako iko wapi — check again in a few minutes.
        </div>
      </div>
    );
  }

  const plate = active.plate || active.numberPlate || active.id.slice(0, 6);

  const primaryPhotoUrl =
    active && Array.isArray(active.photos) && active.photos[0]
      ? active.photos[0]
      : null;

  return (
    <div className="relative">
      <div className="radaa-neon-card relative p-3 transition-transform duration-200 ease-snappy hover:-translate-y-1 hover:scale-[1.01]">
        <div className="relative z-10">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Nearby matatu
              </div>
              <div className="text-sm font-semibold text-slate-50">{title}</div>
              <div className="text-[11px] text-slate-400">{subtitle}</div>
            </div>
            {remaining > 0 && (
              <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] text-slate-400">
                +{remaining} more
              </span>
            )}
          </div>

          <div className="mt-1 h-40">
            <AnimatePresence initial={false}>
              <motion.div
                key={active.id}
                className="relative h-full overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900"
                initial={{ x: 40, opacity: 0, rotate: 6 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                exit={{ x: -40, opacity: 0, rotate: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                role="group"
                tabIndex={0}
                aria-label={
                  active.route
                    ? `Matatu ${plate} on route ${active.route}`
                    : `Matatu ${plate}`
                }
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    handleLike();
                  } else if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    handleSkip();
                  }
                }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 80) {
                    handleLike();
                  } else if (info.offset.x < -80) {
                    handleSkip();
                  }
                }}
              >
                {primaryPhotoUrl && !imageError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={primaryPhotoUrl}
                    alt={plate}
                    className="h-full w-full object-cover opacity-90"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[11px] text-slate-400">
                    Live matatu preview
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-50">
                  <div>
                    <div className="font-semibold">{plate}</div>
                    {active.route && (
                      <div className="text-slate-200">{active.route}</div>
                    )}
                  </div>
                  {typeof active.speedKph === "number" && (
                    <div className="text-right text-[10px] text-slate-200">
                      <div>{active.speedKph.toFixed(0)} km/h</div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
            <button
              type="button"
              onClick={handleSkip}
              className={`${boltSecondaryButtonClass} flex-1`}
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleLike}
              className="flex-1 rounded-full bg-genz-accent px-4 py-1.5 text-[11px] font-semibold text-slate-950 shadow-glow-mint hover:bg-emerald-400"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleOpenOnMap}
              className="flex-1 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-1.5 text-[11px] font-medium text-slate-100 hover:border-genz-accent hover:text-genz-accent"
            >
              Open on map
            </button>
          </div>

          <div className="mt-2 flex justify-end text-[10px] text-slate-500">
            <button
              type="button"
              onClick={handleShare}
              className="underline-offset-2 hover:underline"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TinderGallery;
