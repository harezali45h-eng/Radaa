interface RadaaLogoMarkProps {
  className?: string;
}

export function RadaaLogoMark({ className }: RadaaLogoMarkProps) {
  return (
    <div
      className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-sky-400 to-amber-300 text-[0.7rem] font-semibold text-slate-950 shadow-sm ${className ?? ""}`}
      aria-label="Radaa logo"
    >
      R
    </div>
  );
}
