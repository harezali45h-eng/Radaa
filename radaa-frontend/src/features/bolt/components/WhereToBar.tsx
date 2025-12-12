"use client";

import type { BoltSuggestion } from "@/src/features/bolt/types";
import { boltBottomBarClass, boltBottomBarInnerClass } from "@/src/features/bolt/utils/theme";
import { useBoltSuggestions } from "@/src/features/bolt/hooks/useBoltSuggestions";

interface WhereToBarProps {
  onSelectSuggestion?: (item: BoltSuggestion) => void;
}

export function WhereToBar({ onSelectSuggestion }: WhereToBarProps) {
  const { query, setQuery, suggestions, recent, loading } = useBoltSuggestions();

  const handleSelect = (item: BoltSuggestion) => {
    if (onSelectSuggestion) onSelectSuggestion(item);
  };

  return (
    <div className={boltBottomBarClass}>
      <div className={boltBottomBarInnerClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-300">
            ●
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-200 sm:text-xs">
              Where to?
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destination, stage, or landmark"
              className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-[12px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-genz-accent focus:ring-1 focus:ring-genz-accent sm:text-sm"
            />
          </div>
          {loading && (
            <span className="flex-none text-[10px] text-slate-400">Searching…</span>
          )}
        </div>

        {(suggestions.length > 0 || recent.length > 0) && (
          <div className="mt-3 space-y-2 text-[11px] text-slate-200">
            {suggestions.length > 0 && (
              <div>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Suggestions
                </div>
                <div className="max-h-40 space-y-1 overflow-y-auto">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="flex w-full items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-2 text-left hover:bg-slate-800"
                    >
                      <div>
                        <div className="font-medium text-slate-50">
                          {item.primaryText}
                        </div>
                        {item.secondaryText && (
                          <div className="text-[10px] text-slate-400">
                            {item.secondaryText}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] uppercase text-slate-500">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {recent.length > 0 && (
              <div>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Recent
                </div>
                <div className="flex flex-col gap-1">
                  {recent.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 text-left hover:border-slate-600"
                    >
                      <div>
                        <div className="font-medium text-slate-50">
                          {item.primaryText}
                        </div>
                        {item.secondaryText && (
                          <div className="text-[10px] text-slate-400">
                            {item.secondaryText}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">Recent</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WhereToBar;
