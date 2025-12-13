"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface MatatuGalleryItem {
  id: string;
  plate: string;
  route: string;
  sacco: string;
  photoUrl: string;
  tagline?: string;
}

const MATATU_CARDS: MatatuGalleryItem[] = [
  {
    id: "m1",
    plate: "KAA 123A",
    route: "CBD – Rongai",
    sacco: "Rongai Line",
    photoUrl:
      "https://images.pexels.com/photos/6724519/pexels-photo-6724519.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tagline: "Classic Rongai vibes with clean sound and bright graffiti.",
  },
  {
    id: "m2",
    plate: "KBB 456B",
    route: "CBD – Embakasi",
    sacco: "Eastern Shuttle",
    photoUrl:
      "https://images.pexels.com/photos/1489366/pexels-photo-1489366.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tagline: "Low-key but fast. Perfect for weekday commutes.",
  },
  {
    id: "m3",
    plate: "KCC 789C",
    route: "CBD – Ngong Road",
    sacco: "Ngong Express",
    photoUrl:
      "https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tagline: "Neon-lit interior with strong playlist game.",
  },
  {
    id: "m4",
    plate: "KDD 321D",
    route: "CBD – Thika Road",
    sacco: "Super Highway",
    photoUrl:
      "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tagline: "Spacious seats and chill vibes for the highway.",
  },
];

export default function MatatuGalleryPage() {
  const [index, setIndex] = useState(0);
  const [detailsForId, setDetailsForId] = useState<string | null>(null);

  const active = MATATU_CARDS[index] ?? null;
  const remaining = Math.max(
    0,
    MATATU_CARDS.length - index - (active ? 1 : 0),
  );

  const hasCards = MATATU_CARDS.length > 0;

  const title = useMemo(() => {
    if (!active) return "No matatus in gallery";
    return active.route;
  }, [active]);

  const subtitle = useMemo(() => {
    if (!active) return "Swipe when matatus become available";
    return active.sacco;
  }, [active]);

  const handleSkip = () => {
    setDetailsForId(null);
    setIndex((prev) =>
      prev + 1 < MATATU_CARDS.length ? prev + 1 : prev,
    );
  };

  const handleViewDetails = () => {
    if (!active) return;
    setDetailsForId(active.id);
    // Selection can be wired to favourites or booking in a later iteration.
  };

  const handleDragEnd = (_: any, info: any) => {
    const offsetX = info?.offset?.x ?? 0;
    if (offsetX < -80) {
      handleSkip();
    } else if (offsetX > 80) {
      handleViewDetails();
    }
  };

  const details = useMemo(
    () => MATATU_CARDS.find((m) => m.id === detailsForId) ?? null,
    [detailsForId],
  );

  return (
    <div className="relative flex min-h-[100vh] flex-col bg-slate-950 text-xs text-slate-50">
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h1 className="text-lg font-semibold tracking-tight md:text-2xl">
            Matatu gallery
          </h1>
          <p className="mt-1 max-w-md text-[11px] text-slate-300 md:text-xs">
            Tinder-style swipe deck for Nairobi matatus. Swipe left to skip,
            swipe right to view matatu details.
          </p>
        </div>
        {hasCards && (
          <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] text-slate-300">
            {index + 1} / {MATATU_CARDS.length}
          </span>
        )}
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-24 pt-2 md:pb-12">
        {!active && (
          <div className="flex h-full w-full flex-col items-center justify-center text-center text-[11px] text-slate-400">
            <p>No matatus in the gallery right now.</p>
          </div>
        )}

        {active && (
          <div className="w-full max-w-sm">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Featured matatu
                </div>
                <div className="text-sm font-semibold text-slate-50">
                  {title}
                </div>
                <div className="text-[11px] text-slate-400">{subtitle}</div>
              </div>
              {remaining > 0 && (
                <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] text-slate-400">
                  +{remaining} more
                </span>
              )}
            </div>

            <div className="mt-1 h-64 sm:h-72">
              <AnimatePresence initial={false}>
                <motion.div
                  key={active.id}
                  className="relative h-full overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-soft"
                  initial={{ x: 40, opacity: 0, rotate: 5 }}
                  animate={{ x: 0, opacity: 1, rotate: 0 }}
                  exit={{ x: -40, opacity: 0, rotate: -5 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.3}
                  onDragEnd={handleDragEnd}
                  role="group"
                  tabIndex={0}
                  aria-label={`Matatu ${active.plate} on route ${active.route}`}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      handleSkip();
                    } else if (event.key === "ArrowRight") {
                      event.preventDefault();
                      handleViewDetails();
                    }
                  }}
                >
                  {active.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={active.photoUrl}
                      alt={active.plate}
                      className="h-full w-full object-cover opacity-90"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[11px] text-slate-400">
                      Live matatu preview
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-50">
                    <div>
                      <div className="font-semibold">{active.plate}</div>
                      <div className="text-slate-200">{active.route}</div>
                    </div>
                    <div className="text-right text-[10px] text-slate-300">
                      <div>{active.sacco}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-1.5 font-medium text-slate-200 shadow-sm transition hover:border-slate-500 hover:bg-slate-800"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleViewDetails}
                className="flex-1 rounded-full bg-sky-500 px-4 py-1.5 text-[11px] font-semibold text-slate-950 shadow-glow-mint hover:bg-sky-400"
              >
                View details
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-slate-500">
              Swipe left to skip · Swipe right to view details.
            </p>
          </div>
        )}
      </main>

      {details && (
        <section className="fixed inset-x-0 bottom-0 z-20 rounded-t-3xl border-t border-slate-800 bg-slate-950/95 px-4 pb-6 pt-4 text-[11px] text-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.6)] backdrop-blur">
          <div className="mx-auto flex max-w-md flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wide text-slate-500">
                  Matatu details
                </div>
                <div className="text-sm font-semibold">
                  {details.plate} · {details.route}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailsForId(null)}
                className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-slate-300 hover:border-slate-500"
              >
                Close
              </button>
            </div>
            {details.tagline && (
              <p className="text-[11px] text-slate-300">{details.tagline}</p>
            )}
            <p className="text-[10px] text-slate-500">
              These are sample public matatu visuals to showcase the gallery
              experience. In live mode, you will see real vehicles from your
              corridor.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
