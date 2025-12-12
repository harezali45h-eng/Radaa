"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface MatatuSwipeItem {
  id: string;
  plate: string;
  route: string;
  sacco: string | null;
  driverName: string | null;
  driverPhone: string | null;
  status: string;
  online: boolean;
  lastLocation: string | null;
}

interface MatatuSwipeDeckProps {
  matatus: MatatuSwipeItem[];
}

export default function MatatuSwipeDeck({
  matatus,
}: MatatuSwipeDeckProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1 | 0>(0);

  if (!matatus || matatus.length === 0) {
    return null;
  }

  const active = matatus[Math.min(index, matatus.length - 1)];

  const handleAdvance = (dir: 1 | -1) => {
    if (matatus.length <= 1) return;
    setDirection(dir);
    setIndex((current) => {
      const next = current + dir;
      if (next < 0) return matatus.length - 1;
      if (next >= matatus.length) return 0;
      return next;
    });
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const threshold = 80;
    if (info.offset.x > threshold) {
      handleAdvance(1);
    } else if (info.offset.x < -threshold) {
      handleAdvance(-1);
    }
  };

  const total = matatus.length;
  const positionLabel = `${index + 1} / ${total}`;

  return (
    <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/90 p-4 text-xs">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            Swipe matatus
          </h2>
          <p className="text-[11px] text-slate-400">
            Swipe left / right to explore matatus like a card deck.
          </p>
        </div>
        <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-1 text-[10px] text-slate-300">
          {positionLabel}
        </span>
      </div>

      <div className="relative mt-1 h-[290px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={active.id}
            className="radaa-card absolute inset-0 flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/90 p-4 shadow-lg"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ x: direction * 32, opacity: 0.9, rotate: direction * -6 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: direction * -140, opacity: 0, rotate: direction * 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-slate-50">
                    {active.plate}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {active.route}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    active.online
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-slate-800/80 text-slate-300"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      active.online ? "bg-emerald-400" : "bg-slate-500"
                    }`}
                  />
                  {active.online ? "Online" : "Offline"}
                </span>
              </div>

              {active.sacco && (
                <div className="text-[11px] text-slate-300">
                  SACCO: <span className="font-medium">{active.sacco}</span>
                </div>
              )}

              {active.driverName && (
                <div className="flex items-center gap-2 text-[11px] text-slate-200">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-100">
                    {active.driverName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{active.driverName}</div>
                    {active.driverPhone && (
                      <div className="text-[10px] text-slate-400">
                        {active.driverPhone}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {active.lastLocation && (
                <div className="mt-1 text-[11px] text-slate-400">
                  Last location: {active.lastLocation}
                </div>
              )}

              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2">
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">
                    Status
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-slate-100">
                    {active.status}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2">
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">
                    Vibe check
                  </div>
                  <div className="mt-1 text-[11px] text-slate-200">
                    Swipe to keep exploring routes and crews.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleAdvance(-1)}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:border-slate-500 hover:text-slate-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => handleAdvance(1)}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-genz-primary px-3 py-1.5 text-[11px] font-semibold text-slate-950 shadow-sm transition hover:bg-sky-400"
              >
                Next
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-1 pt-1">
        {matatus.map((item, i) => (
          <span
            key={item.id}
            className={`h-1.5 w-1.5 rounded-full transition ${
              i === index ? "bg-sky-400" : "bg-slate-700"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
