"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import type { MarkerStatus, MatatuLike } from "@/lib/map/markerHelpers";
import { chooseColor, formatMatatuLabel } from "@/lib/map/markerHelpers";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";

interface MatatuMarkerProps {
  matatu: MatatuLike & { id?: string };
  status: MarkerStatus;
  style: CSSProperties;
  onSelect?: () => void;
}

export function MatatuMarker({
  matatu,
  status,
  style,
  onSelect,
}: MatatuMarkerProps) {
  const label = formatMatatuLabel(matatu);

  const photosEnabled = useIsFeatureEnabled("map_photos_v1", false);

  const thumbnailSrc = useMemo(() => {
    if (!photosEnabled || !matatu.mainPhotoUrl) {
      return null;
    }

    const url = matatu.mainPhotoUrl;

    if (url.startsWith("http")) {
      return url;
    }

    const backend =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    return `${backend}${url}`;
  }, [photosEnabled, matatu.mainPhotoUrl]);

   const [visible, setVisible] = useState(false);

   useEffect(() => {
     if (typeof window === "undefined") {
       setVisible(true);
       return;
     }

     const frame = window.requestAnimationFrame(() => {
       setVisible(true);
     });

     return () => {
       window.cancelAnimationFrame(frame);
     };
   }, []);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold shadow transition-opacity duration-300 ease-out ${chooseColor(
        status,
      )}`}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
      }}
      aria-label={label}
    >
      {thumbnailSrc && (
        <span
          className="mr-1 inline-block h-4 w-4 overflow-hidden rounded-full border border-slate-900 bg-slate-900"
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailSrc}
            alt=""
            className="h-full w-full object-cover"
          />
        </span>
      )}
      <span aria-hidden="true">{label}</span>
    </button>
  );
}

export default MatatuMarker;
