"use client";

import type { ReactNode } from "react";

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "solid" | "glass" | "subtle";
}

export function Card({ children, className, variant = "glass" }: CardProps) {
  const base = "rounded-card border backdrop-blur-md";

  const variantClass =
    variant === "solid"
      ? "border-slate-800/90 bg-slate-950/90 shadow-soft"
      : variant === "subtle"
        ? "border-slate-800/70 bg-slate-900/70 shadow-soft"
        : "radaa-glass-card";

  return <section className={cn(base, variantClass, className)}>{children}</section>;
}
