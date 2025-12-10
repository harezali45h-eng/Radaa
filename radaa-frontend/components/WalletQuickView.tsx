"use client";

import { useWallet } from "@/hooks/useWallet";

export default function WalletQuickView() {
  const { wallet, loading, error } = useWallet();

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-[11px] text-slate-300">
        Loading wallet...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-[11px] text-red-200">
        {error}
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-[11px] text-slate-300">
        Wallet information is not available.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-[11px] text-slate-200">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Wallet snapshot
          </div>
          <div className="mt-1 text-sm font-semibold text-emerald-400">
            KES {wallet.balance.toLocaleString()}
          </div>
        </div>
        <div className="text-right text-[10px] text-slate-400">
          <div>Loyalty: {wallet.loyaltyPoints.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
