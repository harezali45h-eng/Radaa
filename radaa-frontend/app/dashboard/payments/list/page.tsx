"use client";

import { useEffect, useState } from "react";
import WalletDashboard from "@/components/WalletDashboard";

export default function PaymentsListPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setUserId(window.localStorage.getItem("radaa_user_id"));
  }, []);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="text-xs text-slate-300">
          Your wallet, Mpesa deposits, and fare payments all live here now.
          Loyalty and balance data comes directly from your Radaa wallet.
        </p>
      </header>

      {!userId && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-100">
          No user ID found. Make sure you are logged in via the auth screens
          before viewing payments.
        </div>
      )}

      {userId && (
        <section className="space-y-4">
          <WalletDashboard />
        </section>
      )}
    </div>
  );
}
