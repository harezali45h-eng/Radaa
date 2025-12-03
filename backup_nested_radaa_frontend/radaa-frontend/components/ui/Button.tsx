"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  fullWidth?: boolean;
}

export function Button({
  children,
  className,
  variant = "primary",
  fullWidth,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-pill px-4 py-2 text-xs font-semibold tracking-tight transition-all duration-150 ease-snappy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60";

  const variantClass = (() => {
    switch (variant) {
      case "secondary":
        return "border border-white/15 bg-slate-900/70 text-slate-50 shadow-soft hover:border-white/30";
      case "ghost":
        return "text-slate-100 hover:bg-white/5";
      case "outline":
        return "border border-kenyanGreen/70 text-kenyanGreen bg-transparent hover:bg-kenyanGreen/10";
      case "primary":
      default:
        return "bg-gradient-kenya-sun text-slate-950 shadow-glow-kenya hover:brightness-110";
    }
  })();

  return (
    <button
      type={props.type ?? "button"}
      className={cn(base, variantClass, fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
}
