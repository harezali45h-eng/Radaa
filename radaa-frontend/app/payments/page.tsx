"use client";

import { useState } from "react";
import { initiatePayment, verifyPayment } from "../../lib/api";
import { useNotifications } from "@/context/NotificationContext";

export default function PaymentsPage() {
  const { addNotification } = useNotifications();
  const [amount, setAmount] = useState(50);
  const [method, setMethod] = useState("mpesa");
  const [transactionId, setTransactionId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const userId = typeof window !== "undefined" ? window.localStorage.getItem("radaa_user_id") : null;

  const handleInitiate = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await initiatePayment({ userId, amount, method });
      setResult(res);
      if (res.transactionId) setTransactionId(res.transactionId);

      addNotification({
        type: "payment",
        title: "Payment initiated",
        message: `Started a ${method} payment for KES ${amount}.`
      });
    } catch (e) {
      setResult({ error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!userId || !transactionId) return;
    setLoading(true);
    try {
      const res = await verifyPayment({
        userId,
        amount,
        method,
        transactionId
      });
      setResult(res);

      const status = res?.verification?.status;
      if (status === "success") {
        addNotification({
          type: "payment",
          title: "Payment confirmed",
          message: `Payment ${transactionId} was verified successfully.`
        });
      } else {
        addNotification({
          type: "payment",
          title: "Payment verification",
          message: `Verification for payment ${transactionId} completed with status: ${status ?? "unknown"}.`
        });
      }
    } catch (e) {
      setResult({ error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="text-xs text-slate-300">
          This page uses a placeholder payment gateway. Wire it up to Mpesa STK Push, Stripe, or
          Flutterwave in production.
        </p>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-1">
            <span className="block text-slate-300">Amount (KES)</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm"
            />
          </label>

          <label className="space-y-1">
            <span className="block text-slate-300">Method</span>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm"
            >
              <option value="mpesa">Mpesa (placeholder)</option>
              <option value="card">Card (placeholder)</option>
              <option value="flutterwave">Flutterwave (placeholder)</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="block text-slate-300">Transaction ID (for verify)</span>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm"
              placeholder="Auto-filled when initiate returns an ID"
            />
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleInitiate}
            disabled={loading || !userId}
            className="rounded bg-sky-500 px-3 py-1 text-xs font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Initiate payment
          </button>
          <button
            onClick={handleVerify}
            disabled={loading || !userId || !transactionId}
            className="rounded bg-emerald-500 px-3 py-1 text-xs font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Verify payment
          </button>
        </div>

        {result && (
          <pre className="mt-3 max-h-40 overflow-auto rounded bg-slate-950 p-2 text-[10px] text-slate-200">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}
