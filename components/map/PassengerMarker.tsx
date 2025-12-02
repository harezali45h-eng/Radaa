import type { CSSProperties } from "react";

interface PassengerMarkerProps {
  style: CSSProperties;
}

export function PassengerMarker({ style }: PassengerMarkerProps) {
  return (
    <div
      className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 shadow"
      style={style}
    />
  );
}

export default PassengerMarker;
