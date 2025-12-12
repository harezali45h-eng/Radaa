"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import API, {
  getPaymentConfirmations,
  markPaymentConfirmationSeen,
  type PaymentConfirmationDTO,
} from "@/lib/api";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";

export default function WalletDashboard() {
  const { wallet, loading, error, refresh } = useWallet();

  const [depositOpen, setDepositOpen] = useState(false);
  const [fareOpen, setFareOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const paymentConfirmEnabled = useIsFeatureEnabled(
    "ff_payment_confirm",
    false,
  );
  const [confirmations, setConfirmations] = useState<
    PaymentConfirmationDTO[] | null
  >(null);
  const [confirmationsLoading, setConfirmationsLoading] = useState(false);
  const [confirmationsError, setConfirmationsError] = useState<string | null>(
    null,
  );

  const totalFareSpent = (wallet?.transactions || [])
    .filter((tx) => tx.type === "fare")
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);

  useEffect(() => {
    if (!paymentConfirmEnabled) {
      setConfirmations(null);
      setConfirmationsError(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setConfirmationsLoading(true);
      setConfirmationsError(null);

      try {
        const list = await getPaymentConfirmations(10);
        if (!cancelled) {
          setConfirmations(list || []);
        }
      } catch (err: any) {
        if (!cancelled) {
          const message =
            (err?.response?.data?.message as string) ||
            err?.message ||
            "Failed to load payment confirmations";
          setConfirmationsError(message);
        }
      } finally {
        if (!cancelled) {
          setConfirmationsLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [paymentConfirmEnabled]);

  const handleMarkConfirmationSeen = async (id: string) => {
    try {
      const updated = await markPaymentConfirmationSeen(id);
      setConfirmations((current) =>
        current
          ? current.map((item) => (item._id === updated._id ? updated : item))
          : current,
      );
    } catch {
      // keep UI best-effort; do not surface errors here
    }
  };

  const handleDeposit = async () => {
    setActionError(null);
    setStatusMessage(null);

    if (!amount || amount <= 0) {
      setActionError("Weka kiasi sahihi cha KSh kabla ya kuendelea.");
      return;
    }
    if (!phoneNumber) {
      setActionError("Weka nambari yako ya Mpesa ili tukutumié STK.");
      return;
    }

    setSubmitting(true);
    try {
      await API.post("/wallet/deposit", {
        amount,
        phoneNumber,
      });
      setStatusMessage(
        "Tumetuma Mpesa STK kwa simu yako. Thibitisha hapo kisha balance ita-update."
      );
      setDepositOpen(false);
    } catch (err: any) {
      const message =
        (err?.response?.data?.message as string) || err?.message ||
        "Mpesa deposit imeshindikana. Jaribu tena baadaye.";
      setActionError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayFare = async () => {
    setActionError(null);
    setStatusMessage(null);

    if (!amount || amount <= 0) {
      setActionError("Weka kiasi cha fare kabla ya kuendelea.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post("/wallet/pay-fare", { amount });
      setStatusMessage("Fare imelipwa kutoka kwa wallet yako bila stress.");
      setFareOpen(false);
      if (res?.data) {
        refresh();
      }
    } catch (err: any) {
      const message =
        (err?.response?.data?.message as string) || err?.message ||
        "Kulipa fare kupitia wallet kimeshindikana.";
      setActionError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/85 p-4 text-xs shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-50">Wallet yako</h2>
          <p className="text-[11px] text-slate-300">
            Tumia wallet yako kulipa fare bila stress. Zawadi zako ziko hapa —
            endelea kusave na kusafiri.
          </p>
        </div>
        <div className="mt-2 flex flex-col items-start gap-2 sm:mt-0 sm:items-end">
          <div className="text-[11px] text-slate-400">Balance</div>
          <div className="text-lg font-semibold text-emerald-400">
            {loading ? "…" : `KES ${wallet?.balance ?? 0}`}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-2 rounded-md border border-red-500/50 bg-red-500/10 p-2 text-[11px] text-red-100">
          {error}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
        <button
          type="button"
          onClick={() => {
            setAmount(0);
            setDepositOpen(true);
            setStatusMessage(null);
            setActionError(null);
          }}
          className="inline-flex items-center rounded-md border border-emerald-500/70 bg-emerald-500/15 px-3 py-1.5 font-medium text-emerald-100 hover:border-emerald-400 hover:bg-emerald-500/25"
        >
          Deposit with Mpesa
        </button>
        <button
          type="button"
          onClick={() => {
            setAmount(0);
            setFareOpen(true);
            setStatusMessage(null);
            setActionError(null);
          }}
          className="inline-flex items-center rounded-md border border-sky-500/70 bg-sky-500/15 px-3 py-1.5 font-medium text-sky-100 hover:border-sky-400 hover:bg-sky-500/25"
        >
          Pay Fare
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] text-slate-400">Loyalty points</div>
          <div className="mt-1 text-base font-semibold text-amber-300">
            {wallet?.loyaltyPoints ?? 0}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Kwa kila 1500 umetumia kama fare, unapata points 50.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[11px] text-slate-400">Total fare spent</div>
          <div className="mt-1 text-base font-semibold text-slate-100">
            KES {totalFareSpent}
          </div>
        </div>
      </div>

      {paymentConfirmEnabled && confirmationsLoading && (
        <p className="mt-3 text-[11px] text-slate-400">
          Checking recent payments…
        </p>
      )}
      {paymentConfirmEnabled && confirmationsError && (
        <p className="mt-3 text-[11px] text-red-300">{confirmationsError}</p>
      )}
      {paymentConfirmEnabled &&
        confirmations &&
        confirmations.length > 0 && (
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-[11px]">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-100">
                  Recent payments
                </div>
                <div className="text-[10px] text-slate-400">
                  STK and wallet payments linked to your account.
                </div>
              </div>
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300">
                {confirmations.filter((item) => !item.seenAt).length} new
              </span>
            </div>

            <div className="mt-3 space-y-1.5">
              {confirmations.map((item) => {
                const created = new Date(item.createdAt);
                const isNew = !item.seenAt;
                const statusLabel = item.status || "pending";

                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => handleMarkConfirmationSeen(item._id)}
                    className="flex w-full items-center justify-between rounded-md border border-slate-800 bg-slate-950/80 px-3 py-2 text-left hover:border-slate-600 hover:bg-slate-900"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-50">
                          KES {item.amount}
                        </span>
                        <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                          {item.channel || "mpesa"}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-400">
                        {item.purpose === "fare"
                          ? "Ride fare"
                          : item.purpose === "deposit"
                            ? "Wallet deposit"
                            : "Payment"}
                        {" "}
                        · {created.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          statusLabel === "success"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : statusLabel === "failed"
                              ? "bg-red-500/15 text-red-300"
                              : "bg-slate-800 text-slate-200"
                        }`}
                      >
                        {statusLabel}
                      </span>
                      {isNew && (
                        <span className="rounded-full bg-sky-500/20 px-1.5 py-0.5 text-[9px] text-sky-300">
                          New
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      {statusMessage && (
        <p className="mt-3 text-[11px] text-emerald-200">{statusMessage}</p>
      )}
      {actionError && (
        <p className="mt-2 text-[11px] text-red-300">{actionError}</p>
      )}

      {/* Deposit modal */}
      {depositOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs shadow-glass-elevated">
            <h3 className="text-sm font-semibold text-slate-50">
              Deposit with Mpesa
            </h3>
            <p className="mt-1 text-[11px] text-slate-400">
              Weka kiasi cha kuweka na nambari yako ya Mpesa. Utapata STK prompt
              mara moja.
            </p>
            <label className="mt-3 block text-[11px] text-slate-300">
              Amount (KES)
              <input
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                min={1}
              />
            </label>
            <label className="mt-3 block text-[11px] text-slate-300">
              Mpesa phone number
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="2547xxxxxxxx"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </label>
            <div className="mt-4 flex justify-end gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setDepositOpen(false);
                }}
                className="rounded-md border border-slate-700 px-3 py-1 text-slate-200 hover:border-slate-500"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeposit}
                disabled={submitting}
                className="rounded-md border border-emerald-500 bg-emerald-600 px-3 py-1 font-semibold text-slate-50 hover:border-emerald-400 hover:bg-emerald-500 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send STK"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay fare modal */}
      {fareOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs shadow-glass-elevated">
            <h3 className="text-sm font-semibold text-slate-50">Pay Fare</h3>
            <p className="mt-1 text-[11px] text-slate-400">
              Tumia balance ya wallet yako kulipa fare bila kusumbua cash.
            </p>
            <label className="mt-3 block text-[11px] text-slate-300">
              Fare amount (KES)
              <input
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                min={1}
              />
            </label>
            <div className="mt-4 flex justify-end gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => setFareOpen(false)}
                className="rounded-md border border-slate-700 px-3 py-1 text-slate-200 hover:border-slate-500"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePayFare}
                disabled={submitting}
                className="rounded-md border border-sky-500 bg-sky-600 px-3 py-1 font-semibold text-slate-50 hover:border-sky-400 hover:bg-sky-500 disabled:opacity-60"
              >
                {submitting ? "Processing…" : "Pay now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
