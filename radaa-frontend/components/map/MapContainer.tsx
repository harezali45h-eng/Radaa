import type { CSSProperties } from "react";
import type { LatLng, MatatuLike, MarkerStatus } from "@/lib/map/markerHelpers";
import MatatuMarker from "./MatatuMarker";
import PassengerMarker from "./PassengerMarker";

interface PassengerPoint {
  id: string;
  location: LatLng;
}

interface Matatu extends MatatuLike {
  id: string;
  status?: string;
  location?: LatLng | null;
  isTracked?: boolean;
}

interface MapContainerProps {
  matatus: Matatu[];
  passengers: PassengerPoint[];
  userLocation: LatLng | null;
  displayPositions: Record<string, LatLng>;
  project: (location: LatLng | null | undefined) => CSSProperties;
  onCenterOnMe: () => void;
  onSelectMatatu: (id: string) => void;
  isLoading: boolean;
  hasAnyLocation: boolean;
  driverMode?: boolean;
  showCenterOnMe?: boolean;
  routePath?: LatLng[];
  heatmapPoints?: LatLng[];
  heatmapEnabled?: boolean;
  onMapClick?: (location: LatLng) => void;
}

function resolveStatus(matatu: Matatu, driverMode?: boolean): MarkerStatus {
  if (driverMode || matatu.isTracked) {
    return "driver";
  }

  return matatu.location ? "online" : "offline";
}

export default function MapContainer({
  matatus,
  passengers,
  userLocation,
  displayPositions,
  project,
  onCenterOnMe,
  onSelectMatatu,
  isLoading,
  hasAnyLocation,
  driverMode,
  showCenterOnMe = true,
  routePath,
  heatmapPoints,
  heatmapEnabled,
  onMapClick,
}: MapContainerProps) {
  const showEmptyState = !isLoading && !hasAnyLocation;
  const effectiveMode: "user" | "driver" = driverMode ? "driver" : "user";
  const showMatatus = effectiveMode === "user";
  const showPassengers = effectiveMode === "driver";

  return (
    <div
      className="relative mt-4 min-h-[320px] h-[55vh] md:h-[65vh] overflow-hidden rounded-lg bg-slate-950"
      onClick={(event) => {
        if (!onMapClick || !event.currentTarget.getBoundingClientRect) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const xRatio = (event.clientX - rect.left) / Math.max(rect.width, 1);
        const yRatio = (event.clientY - rect.top) / Math.max(rect.height, 1);

        if (!userLocation) {
          return;
        }

        const approxLat = userLocation.lat + (0.5 - yRatio) * 0.02;
        const approxLng = userLocation.lng + (xRatio - 0.5) * 0.02;

        onMapClick({ lat: approxLat, lng: approxLng });
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
          <div className="absolute inset-4 rounded-lg border border-slate-800/60" />
        </div>
      )}

      {!isLoading && showEmptyState && (
        <div className="flex h-full items-center justify-center text-xs text-slate-500">
          Waiting for live location data...
        </div>
      )}

      {!isLoading && !showEmptyState && (
        <>
          {Array.isArray(routePath) && routePath.length >= 2 && (
            <>
              {routePath.map((point, index) => {
                if (index === 0) return null;
                const prev = routePath[index - 1];
                const start = project(prev);
                const end = project(point);

                const x1 = parseFloat(String(start.left).replace("%", ""));
                const y1 = parseFloat(String(start.top).replace("%", ""));
                const x2 = parseFloat(String(end.left).replace("%", ""));
                const y2 = parseFloat(String(end.top).replace("%", ""));

                const dx = x2 - x1;
                const dy = y2 - y1;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);

                return (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={`route-${index}`}
                    className="pointer-events-none absolute h-[2px] bg-amber-300/90 shadow-sm shadow-amber-500/50"
                    style={{
                      left: `${x1}%`,
                      top: `${y1}%`,
                      width: `${length}%`,
                      transformOrigin: "0 50%",
                      transform: `rotate(${angle}deg)`,
                    }}
                  />
                );
              })}
            </>
          )}

          {heatmapEnabled &&
            Array.isArray(heatmapPoints) &&
            heatmapPoints.map((point, index) => {
              const style = project(point);
              return (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={`heat-${index}`}
                  className="pointer-events-none absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/30 blur-md"
                  style={style}
                />
              );
            })}

          {showMatatus &&
            matatus.map((m) => {
              const position = displayPositions[m.id] ?? m.location ?? null;
              if (!position) return null;

              const style = project(position);
              const status = resolveStatus(m, driverMode);

              return (
                <MatatuMarker
                  key={m.id}
                  matatu={m}
                  status={status}
                  style={style}
                  onSelect={() => onSelectMatatu(m.id)}
                />
              );
            })}

          {showPassengers &&
            passengers.map((p) => {
              const style = project(p.location);
              return <PassengerMarker key={p.id} style={style} />;
            })}

          {userLocation && (
            <div
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-sky-500 shadow-lg"
              style={project(userLocation)}
            />
          )}
        </>
      )}

      {showCenterOnMe && (
        <button
          type="button"
          onClick={onCenterOnMe}
          className="absolute bottom-3 right-3 z-10 inline-flex items-center rounded-md border border-sky-600/60 bg-sky-600/20 px-2.5 py-1 text-[10px] font-medium text-sky-100 shadow hover:border-sky-400 hover:bg-sky-600/30"
        >
          Center on me
        </button>
      )}
    </div>
  );
}
