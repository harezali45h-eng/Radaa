"use client";

import { useEffect, useMemo, useState } from "react";
import type { BoltLatLng, BoltSuggestion } from "@/src/features/bolt/types";
import {
  boltBottomBarClass,
  boltBottomBarInnerClass,
  boltPrimaryButtonClass,
} from "@/src/features/bolt/utils/theme";
import { useBoltSuggestions } from "@/src/features/bolt/hooks/useBoltSuggestions";
import { useGoogleMaps } from "@/context/GoogleMapsContext";

interface WhereToBarProps {
  onSelectSuggestion?: (item: BoltSuggestion) => void;
  canRequestRide?: boolean;
  onRequestRide?: () => void;
  requesting?: boolean;
  selectedLabel?: string | undefined | null;
  inline?: boolean;
}

export function WhereToBar({
  onSelectSuggestion,
  canRequestRide,
  onRequestRide,
  requesting,
  selectedLabel,
  inline = false,
}: WhereToBarProps) {
  const { query, setQuery, suggestions, recent, loading } = useBoltSuggestions();
  const [placeSuggestions, setPlaceSuggestions] = useState<BoltSuggestion[]>([]);

  const { isLoaded, apiKey } = useGoogleMaps();

  useEffect(() => {
    const trimmed = query.trim();
    if (!isLoaded || !apiKey || trimmed.length < 3) {
      setPlaceSuggestions([]);
      return;
    }

    let cancelled = false;
    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: trimmed,
        componentRestrictions: { country: "ke" },
      },
      (predictions) => {
      if (cancelled) return;
      if (!predictions || !Array.isArray(predictions)) {
        setPlaceSuggestions([]);
        return;
      }
      const mapped: BoltSuggestion[] = predictions.map((p) => ({
        id: p.place_id,
        primaryText:
          p.structured_formatting?.main_text || p.description || trimmed,
        secondaryText:
          p.structured_formatting?.secondary_text || undefined,
        type: "place",
        location: null,
      }));
      setPlaceSuggestions(mapped);
    },
    );

    return () => {
      cancelled = true;
    };
  }, [apiKey, isLoaded, query]);

  const handleSelect = (item: BoltSuggestion) => {
    if (!onSelectSuggestion) return;

    if (item.type === "place" && !item.location && isLoaded && apiKey) {
      const element = document.createElement("div");
      const service = new google.maps.places.PlacesService(element);
      service.getDetails(
        {
          placeId: item.id,
          fields: ["geometry", "name", "formatted_address"],
        },
        (result, status) => {
          if (
            !result ||
            status !== google.maps.places.PlacesServiceStatus.OK ||
            !result.geometry ||
            !result.geometry.location
          ) {
            onSelectSuggestion(item);
            return;
          }
          const loc: BoltLatLng = {
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
          };
          const next: BoltSuggestion = {
            ...item,
            location: loc,
            primaryText: item.primaryText || result.name || item.id,
            secondaryText:
              item.secondaryText || result.formatted_address || undefined,
          };
          onSelectSuggestion(next);
        },
      );
      return;
    }

    onSelectSuggestion(item);
  };

  const combinedSuggestions = useMemo(() => {
    if (placeSuggestions.length === 0) return suggestions;
    const existingIds = new Set(suggestions.map((s) => s.id));
    const merged = [...placeSuggestions];
    suggestions.forEach((s) => {
      if (!existingIds.has(s.id)) merged.push(s);
    });
    return merged;
  }, [placeSuggestions, suggestions]);

  const isQueryReady = query.trim().length > 0;
  const effectiveCanRequestRide = isQueryReady || Boolean(canRequestRide);

  const containerClass = inline
    ? "mt-4"
    : boltBottomBarClass;

  return (
    <div className={containerClass}>
      <div className={boltBottomBarInnerClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-300">
            ●
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold tracking-tight text-slate-50 sm:text-sm">
              Where to?
            </div>
            <p className="mt-0.5 text-[10px] text-slate-400">
              Choose your stage or landmark to get matched routes.
            </p>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destination, stage, or landmark"
              className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-[12px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-genz-accent focus:ring-1 focus:ring-genz-accent sm:text-sm"
            />
            {selectedLabel && (
              <p className="mt-1 text-[10px] text-slate-400">
                Selected: {selectedLabel}
              </p>
            )}
          </div>
          {loading && (
            <span className="flex-none text-[10px] text-slate-400">Searching…</span>
          )}
        </div>

        {(combinedSuggestions.length > 0 || recent.length > 0) && (
          <div className="mt-3 space-y-2 text-[11px] text-slate-200">
            {combinedSuggestions.length > 0 && (
              <div>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Suggestions
                </div>
                <div className="max-h-40 space-y-1 overflow-y-auto">
                  {combinedSuggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="flex w-full items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-2 text-left hover:bg-slate-800"
                    >
                      <div>
                        <div className="font-medium text-slate-50">
                          {item.primaryText}
                        </div>
                        {item.secondaryText && (
                          <div className="text-[10px] text-slate-400">
                            {item.secondaryText}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] uppercase text-slate-500">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {recent.length > 0 && (
              <div>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Recent
                </div>
                <div className="flex flex-col gap-1">
                  {recent.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 text-left hover:border-slate-600"
                    >
                      <div>
                        <div className="font-medium text-slate-50">
                          {item.primaryText}
                        </div>
                        {item.secondaryText && (
                          <div className="text-[10px] text-slate-400">
                            {item.secondaryText}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">Recent</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {effectiveCanRequestRide && (
          <button
            type="button"
            onClick={onRequestRide}
            className={boltPrimaryButtonClass}
            disabled={requesting}
          >
            {requesting ? "Requesting..." : "Request Ride"}
          </button>
        )}
      </div>
    </div>
  );
}

export default WhereToBar;
