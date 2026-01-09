import type { CSSProperties } from "react";

interface PassengerDotProps {
  style: CSSProperties;
}

export default function PassengerDot({ style }: PassengerDotProps) {
  return (
    <div
      className="pointer-events-none absolute h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D100D1] opacity-80"
      style={style}
    />
  );
}
