"use client";

import type { ReactNode } from "react";

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export type BadgeTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "brand"
  | "muted";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  tone?: BadgeTone;
  soft?: boolean;
}

export function Badge({
  children,
  className,
  tone = "brand",
  soft,
}: BadgeProps) {
  const base = "inline-flex items-center rounded-pill px-2.5 py-0.5 text-[10px] font-medium";

  const toneClass = (() => {
    const softBase = "bg-opacity-15 text-opacity-90";

    switch (tone) {
      case "success":
        return soft
          ? cn("bg-kenyanGreen/15 text-kenyanGreen", softBase)
          : "bg-kenyanGreen text-slate-950";
      case "warning":
        return soft
          ? cn("bg-sunYellow/15 text-sunYellow", softBase)
          : "bg-sunYellow text-slate-950";
      case "danger":
        return soft
          ? cn("bg-red-500/15 text-red-300", softBase)
          : "bg-red-500 text-white";
      case "info":
        return soft
          ? cn("bg-deepIndigo/15 text-deepIndigo", softBase)
          : "bg-deepIndigo text-slate-50";
      case "muted":
        return soft
          ? cn("bg-slate-700/40 text-slate-200", softBase)
          : "bg-slate-700 text-slate-100";
      case "brand":
      default:
        return soft
          ? cn("bg-safariOrange/18 text-safariOrange", softBase)
          : "bg-gradient-kenya-sun text-slate-950";
    }
  })();

  return (
    <span className={cn(base, "shadow-soft", toneClass, className)}>
      {children}
    </span>
  );
}
