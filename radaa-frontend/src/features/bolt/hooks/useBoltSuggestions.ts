"use client";

import { useEffect, useState } from "react";
import type { BoltSuggestion } from "@/src/features/bolt/types";
import { suggestions as fetchSuggestions } from "@/src/features/bolt/api/boltApi";

export function useBoltSuggestions() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<BoltSuggestion[]>([]);
  const [recent, setRecent] = useState<BoltSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setItems([]);
      return;
    }

    let cancelled = false;
    const handle = window.setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetchSuggestions(trimmed);
        if (cancelled) return;
        setItems(res.suggestions || []);
        setRecent(res.recent || []);
      } catch {
        if (cancelled) return;
        setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [query]);

  return {
    query,
    setQuery,
    suggestions: items,
    recent,
    loading,
  };
}
