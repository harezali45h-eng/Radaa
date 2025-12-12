"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BoltBounds, BoltLatLng, BoltLiveMatatu } from "@/src/features/bolt/types";
import {
  getLive,
  getLivePollInterval,
  interpolatePosition,
  subscribeLiveSocket,
} from "@/src/features/bolt/api/boltApi";

export interface UseBoltLiveRadarOptions {
  initialBounds?: BoltBounds | null;
  limit?: number;
}

export function useBoltLiveRadar(options: UseBoltLiveRadarOptions = {}) {
  const { initialBounds = null, limit = 400 } = options;

  const [bounds, setBounds] = useState<BoltBounds | null>(initialBounds);
  const [matatus, setMatatus] = useState<BoltLiveMatatu[]>([]);
  const [displayPositions, setDisplayPositions] = useState<
    Record<string, BoltLatLng>
  >({});
  const [loading, setLoading] = useState(false);

  const latestMatatusRef = useRef<BoltLiveMatatu[]>([]);
  latestMatatusRef.current = matatus;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const live = await getLive(bounds, limit);
        if (cancelled) return;
        setMatatus(live);
      } catch {
        if (cancelled) return;
        setMatatus([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    const interval = window.setInterval(load, getLivePollInterval());

    const unsubscribe = subscribeLiveSocket((update) => {
      if (!update?.matatu) return;

      setMatatus((current) => {
        const map = new Map<string, BoltLiveMatatu>();
        current.forEach((m) => map.set(m.id, m));
        const existing = map.get(update.matatu.id) || null;
        map.set(update.matatu.id, { ...(existing || {}), ...update.matatu });
        return Array.from(map.values());
      });
    });

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      unsubscribe();
    };
  }, [bounds, limit]);

  useEffect(() => {
    let frameId: number;
    let lastTs: number | null = null;

    const durationMs = 400;

    const step = (ts: number) => {
      if (lastTs == null) lastTs = ts;
      const nowMatatus = latestMatatusRef.current;

      setDisplayPositions((prev) => {
        const next: Record<string, BoltLatLng> = { ...prev };

        nowMatatus.forEach((m) => {
          if (!m.location) return;

          const current = prev[m.id] ?? m.location;
          const interp = interpolatePosition(current, m.location);
          const t = Math.min(1, (ts - (lastTs as number)) / durationMs);
          next[m.id] = interp(t);
        });

        return next;
      });

      frameId = window.requestAnimationFrame(step);
    };

    frameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const hasAnyLocation = useMemo(
    () => matatus.some((m) => m.location),
    [matatus],
  );

  return {
    matatus,
    displayPositions,
    setBounds,
    bounds,
    loading,
    hasAnyLocation,
  };
}
