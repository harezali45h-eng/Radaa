"use client";

import type { BoltMatatuProfile } from "@/src/features/bolt/types";
import { boltCardClass } from "@/src/features/bolt/utils/theme";

interface MatatuProfileSheetProps {
  matatu: BoltMatatuProfile | null;
  onClose?: () => void;
}

export function MatatuProfileSheet({
  matatu,
  onClose,
}: MatatuProfileSheetProps) {
  if (!matatu) return null;

  const plate = matatu.plate || matatu.numberPlate || matatu.id;
  const lastUpdated = matatu.lastUpdated
    ? new Date(matatu.lastUpdated)
    : null;

  const lastUpdatedLabel = lastUpdated
    ? `${lastUpdated.toLocaleTimeString()}`
    : "";

  return (
    <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-30 px-3 pb-5 sm:px-4 sm:pb-6">
      <div
        className={`${boltCardClass} mx-auto max-w-md px-4 pb-4 pt-3 shadow-glass-elevated`}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Matatu profile
            </div>
            <div className="text-base font-semibold text-slate-50">
              {plate}
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-xs text-slate-300 hover:border-slate-500 hover:text-slate-100"
            >
              ×
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          {matatu.route && (
            <div>
              <div className="text-slate-500">Route</div>
              <div className="font-medium text-slate-100">{matatu.route}</div>
            </div>
          )}
          {matatu.sacco && (
            <div>
              <div className="text-slate-500">Sacco</div>
              <div className="font-medium text-slate-100">{matatu.sacco}</div>
            </div>
          )}
          {typeof matatu.speedKph === "number" && (
            <div>
              <div className="text-slate-500">Speed</div>
              <div className="font-medium text-slate-100">
                {matatu.speedKph.toFixed(0)} km/h
              </div>
            </div>
          )}
          {typeof matatu.bearing === "number" && (
            <div>
              <div className="text-slate-500">Heading</div>
              <div className="font-medium text-slate-100">
                {Math.round(matatu.bearing)}°
              </div>
            </div>
          )}
          {matatu.location && (
            <div className="col-span-2 mt-1 grid grid-cols-2 gap-2">
              <div>
                <div className="text-slate-500">Lat</div>
                <div className="font-mono text-[11px] text-slate-200">
                  {matatu.location.lat.toFixed(5)}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Lng</div>
                <div className="font-mono text-[11px] text-slate-200">
                  {matatu.location.lng.toFixed(5)}
                </div>
              </div>
            </div>
          )}
        </div>

        {lastUpdatedLabel && (
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
            <span>Live radar</span>
            <span>Updated {lastUpdatedLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MatatuProfileSheet;
