"use client";

import { useParams } from "next/navigation";

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Wallet payment
        </h1>
        <p className="text-xs text-slate-300">
          This screen no longer shows trip-based details. Your payments are now
          handled through the Radaa wallet and loyalty engine.
        </p>
      </header>

      <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
        <p>
          Reference ID: <span className="font-mono text-slate-100">{id}</span>
        </p>
        <p className="mt-2">
          Tafadhali tumia ukurasa wa Wallet kuona balance yako, loyalty points,
          na historia ya fare uliolipa.
        </p>
      </section>
    </div>
  );
}
