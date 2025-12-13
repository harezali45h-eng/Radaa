"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getNearbyMatatus, type NearbyMatatu } from "@/lib/api/passenger";
import MatatuSwipeDeck, {
  type SwipeMatatu,
} from "@/components/map/MatatuSwipeDeck";

export default function MatatuGalleryPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<SwipeMatatu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getNearbyMatatus(token);
        if (cancelled) return;

        const mapped: SwipeMatatu[] = (data || [])
          .map((m: NearbyMatatu) => {
            const id = String(m.id || m._id || "-");
            return {
              id,
              plate: m.plate || m.numberPlate || id.slice(0, 6),
              numberPlate: m.numberPlate,
              route: m.route,
              sacco: (m as any).sacco,
              mainPhotoUrl: (m as any).mainPhotoUrl ?? null,
              rating: (m as any).rating,
              distanceMeters: (m as any).distanceMeters,
              etaMinutes: (m as any).etaMinutes ?? null,
            } as SwipeMatatu;
          })
          .filter(Boolean)
          .slice(0, 32);

        setItems(mapped);
      } catch (err: any) {
        const message =
          err instanceof Error ? err.message : "Failed to load matatu gallery";
        setError(message);
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

  const hasItems = items.length > 0;

  return (
    <div className="space-y-6 text-xs">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Matatu gallery</h1>
        <p className="max-w-md text-slate-300">
          Swipe through nearby matatus, see their vibe and art, and save your
          favourites. Built for Nairobi matatu culture.
        </p>
      </header>

      {loading && (
        <div className="flex flex-col items-center space-y-4">
          <div className="h-48 w-full max-w-xs animate-pulse rounded-2xl bg-slate-300" />
          <div className="h-4 w-3/4 max-w-xs animate-pulse rounded bg-slate-300" />
          <div className="h-4 w-1/2 max-w-xs animate-pulse rounded bg-slate-300" />
        </div>
      )}

      {!loading && error && (
        <p className="my-4 text-center text-sm text-red-300">{error}</p>
      )}

      {!loading && !error && !hasItems && (
        <p className="my-4 text-center text-gray-400">
          Hakuna matatu iko karibu saa hii. Try again in a few minutes.
        </p>
      )}

      {!loading && !error && hasItems && (
        <div className="flex justify-center">
          <MatatuSwipeDeck
            items={items}
            onSelect={() => {
              // Selection can be wired to favourites or booking in a later iteration.
            }}
          />
        </div>
      )}
    </div>
  );
}
