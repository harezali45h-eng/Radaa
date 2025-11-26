import type { CSSProperties } from "react";
import type { MarkerStatus, MatatuLike } from "@/lib/map/markerHelpers";
import { chooseColor, formatMatatuLabel } from "@/lib/map/markerHelpers";

interface MatatuMarkerProps {
  matatu: MatatuLike & { id?: string };
  status: MarkerStatus;
  style: CSSProperties;
  onSelect?: () => void;
}

export function MatatuMarker({ matatu, status, style, onSelect }: MatatuMarkerProps) {
  const label = formatMatatuLabel(matatu);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold shadow ${chooseColor(
        status
      )}`}
      style={style}
    >
      {label}
    </button>
  );
}

export default MatatuMarker;
