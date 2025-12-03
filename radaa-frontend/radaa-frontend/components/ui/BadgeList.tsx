"use client";

import type { ReactNode } from "react";
import { Badge, type BadgeTone } from "./Badge";

interface BadgeListProps {
  items: Array<{
    id: string | number;
    label: ReactNode;
    tone?: BadgeTone;
  }>;
  inline?: boolean;
}

export function BadgeList({ items, inline }: BadgeListProps) {
  if (!items || items.length === 0) return null;

  const Wrapper = inline ? "span" : "div";

  return (
    <Wrapper
      className={inline ? "inline-flex flex-wrap gap-1" : "flex flex-wrap gap-1"}
    >
      {items.map((badge) => (
        <Badge key={badge.id} tone={badge.tone ?? "muted"} soft>
          {badge.label}
        </Badge>
      ))}
    </Wrapper>
  );
}
