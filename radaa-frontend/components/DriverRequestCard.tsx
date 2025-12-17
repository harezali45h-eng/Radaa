"use client";

import type { DriverAssignedRequest } from "@/hooks/useDriverRealtime";

interface DriverRequestCardProps {
  request: DriverAssignedRequest;
  timeLeftSeconds: number | null;
  onAccept: () => void;
  onReject: () => void;
  pickupStageName?: string | null;
  destinationStageName?: string | null;
}

function formatLatLng(value: { lat: number; lng: number } | null): string {
  if (!value) return "—";
  return `${value.lat.toFixed(4)}, ${value.lng.toFixed(4)}`;
}

export default function DriverRequestCard({
  request,
  timeLeftSeconds,
  onAccept,
  onReject,
  pickupStageName,
  destinationStageName,
}: DriverRequestCardProps) {
  const distanceLabel = (() => {
    const meters = request.distanceMeters;
    if (meters == null || !Number.isFinite(meters)) return "—";
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  })();

  const etaLabel = (() => {
    const seconds = request.etaSeconds;
    if (seconds == null || !Number.isFinite(seconds)) return "—";
    const minutes = Math.max(1, Math.round(seconds / 60));
    return `${minutes} min`;
  })();

  const countdownLabel = (() => {
    if (timeLeftSeconds == null) return "—";
    const clamped = Math.max(0, timeLeftSeconds);
    return `${clamped}s`;
  })();

  const pickupPrimaryLabel =
    pickupStageName && pickupStageName.trim().length > 0
      ? pickupStageName
      : formatLatLng(request.pickup);
  const pickupSecondaryLabel =
    pickupStageName && request.pickup ? formatLatLng(request.pickup) : null;

  const destinationPrimaryLabel =
    destinationStageName && destinationStageName.trim().length > 0
      ? destinationStageName
      : formatLatLng(request.destination);
  const destinationSecondaryLabel =
    destinationStageName && request.destination
      ? formatLatLng(request.destination)
      : null;

  return (
    <div className="space-y-2 text-xs text-emerald-50">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
            Incoming ride request
          </div>
          <p className="text-[11px] text-emerald-100/80">
            A passenger nearby has been assigned to you. Accept before the timer
            expires.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 text-[10px]">
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-200">
            Expires in {countdownLabel}
          </span>
          <span className="text-emerald-200/90">
            {distanceLabel} · {etaLabel} ETA
          </span>
        </div>
      </div>

      <div className="mt-1 grid gap-1 border-t border-emerald-700/60 pt-2 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-emerald-300/90">Pickup</span>
          <span className="text-right">
            <span className="block font-semibold text-emerald-50">
              {pickupPrimaryLabel}
            </span>
            {pickupSecondaryLabel && (
              <span className="block font-mono text-[10px] text-emerald-200/80">
                {pickupSecondaryLabel}
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-emerald-300/90">Destination</span>
          <span className="text-right">
            <span className="block font-semibold text-emerald-50">
              {destinationPrimaryLabel}
            </span>
            {destinationSecondaryLabel && (
              <span className="block font-mono text-[10px] text-emerald-200/80">
                {destinationSecondaryLabel}
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onReject}
          className="inline-flex items-center rounded-md border border-emerald-700/60 bg-transparent px-2.5 py-1 text-[11px] font-medium text-emerald-200 hover:bg-emerald-900/60"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="inline-flex items-center rounded-md bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-emerald-950 shadow-sm transition hover:bg-emerald-400"
        >
          Accept ride
        </button>
      </div>
    </div>
  );
}
