"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import {
  getDriverWallet,
  requestDriverWithdrawal,
  type DriverWallet,
  type DriverWalletTransaction,
  type DriverWalletWithdrawal,
} from "@/lib/api/driverWallet";

export default function DriverWalletDashboardPage() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const role = (user as any)?.role as string | undefined;
  const isDriver = role === "driver";

  const [wallet, setWallet] = useState<DriverWallet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [amount, setAmount] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [withdrawing, setWithdrawing] = useState<boolean>(false);

  const loadWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDriverWallet();
      setWallet(data);
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Failed to load wallet";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isDriver) {
      setLoading(false);
      if (!user) {
        setError("You need to be signed in as a driver to view this page.");
      } else {
        setError("Driver role is required to access the driver wallet dashboard.");
      }
      return;
    }

    void loadWallet();

    const interval = window.setInterval(() => {
      void loadWallet();
    }, 20000);

    return () => {
      window.clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDriver]);

  const handleWithdraw = async () => {
    if (!wallet) return;

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      addNotification({
        type: "system",
        title: "Invalid amount",
        message: "Please enter a positive withdrawal amount.",
      });
      return;
    }

    if (!phoneNumber || phoneNumber.trim().length < 9) {
      addNotification({
        type: "system",
        title: "Invalid phone",
        message: "Please enter a valid Mpesa phone number.",
      });
      return;
    }

    setWithdrawing(true);
    try {
      const result = await requestDriverWithdrawal({
        amount: parsedAmount,
        phoneNumber: phoneNumber.trim(),
      });

      setWallet(result.wallet);
      setAmount("");

      addNotification({
        type: "payment",
        title: "Withdrawal requested",
        message:
          "Your withdrawal request has been submitted. It will be processed as a manual Mpesa payout.",
      });
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Withdrawal failed";
      addNotification({
        type: "system",
        title: "Could not request withdrawal",
        message,
      });
    } finally {
      setWithdrawing(false);
    }
  };

  const transactions: DriverWalletTransaction[] = wallet?.transactions ?? [];
  const withdrawals: DriverWalletWithdrawal[] = wallet?.withdrawals ?? [];

  if (!isDriver) {
    return (
      <div className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Driver wallet</h1>
          <p className="text-xs text-slate-300">
            You must be signed in as a driver to view this dashboard.
          </p>
        </header>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Driver wallet</h1>
        <p className="text-xs text-slate-300">
          View your ride earnings, pending withdrawals, and request Mpesa payouts.
        </p>
      </header>

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          Loading wallet...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200">
          {error}
        </div>
      )}

      {wallet && !loading && !error && (
        <>
          <section className="grid gap-4 md:grid-cols-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-slate-400">Wallet balance</div>
              <div className="mt-1 text-lg font-semibold text-emerald-400">
                KES {wallet.walletBalance.toLocaleString()}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Total funds currently available for withdrawal.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-slate-400">Pending withdrawals</div>
              <div className="mt-1 text-lg font-semibold text-amber-300">
                KES {wallet.pendingWithdrawals.toLocaleString()}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Withdrawals requested but not yet paid out.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-slate-400">Total earned</div>
              <div className="mt-1 text-lg font-semibold text-sky-400">
                KES {wallet.totalEarned.toLocaleString()}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Cumulative fare revenue credited from completed rides.
              </p>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-[1.4fr,1fr] text-xs">
            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">
                    Transaction history
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Credits from rides and debits from withdrawal requests.
                  </p>
                </div>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
                  {transactions.length}
                </span>
              </div>

              {transactions.length === 0 && (
                <p className="text-[11px] text-slate-400">
                  No driver wallet transactions yet. Once riders pay via Mpesa, your
                  earnings will appear here.
                </p>
              )}

              {transactions.length > 0 && (
                <div className="overflow-x-auto rounded-md border border-slate-800 bg-slate-950/80">
                  <table className="min-w-full border-collapse text-[11px]">
                    <thead className="bg-slate-900/80 text-slate-300">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Type</th>
                        <th className="px-3 py-2 text-left font-medium">Amount</th>
                        <th className="px-3 py-2 text-left font-medium">Balance</th>
                        <th className="px-3 py-2 text-left font-medium">When</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime(),
                        )
                        .map((tx, idx) => (
                          <tr
                            key={`${tx.createdAt}-${idx}`}
                            className="border-t border-slate-800/80"
                          >
                            <td className="px-3 py-2 text-slate-100">
                              {tx.type === "credit" && (
                                <span className="text-emerald-300">Credit</span>
                              )}
                              {tx.type === "withdrawal" && (
                                <span className="text-amber-300">Withdrawal</span>
                              )}
                              {tx.type === "adjustment" && (
                                <span className="text-sky-300">Adjustment</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-slate-200">
                              KES {tx.amount.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-slate-300">
                              KES {tx.balanceAfter.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-slate-400">
                              {new Date(tx.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">
                    Request withdrawal
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Submit a withdrawal request. Payouts are processed via Mpesa as
                    manual B2C transfers.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="space-y-1 block">
                  <span className="text-slate-300">Amount (KES)</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
                  />
                </label>

                <label className="space-y-1 block">
                  <span className="text-slate-300">Mpesa phone number</span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
                    placeholder="e.g. 07xx... or 2547xx..."
                  />
                </label>

                <button
                  type="button"
                  onClick={handleWithdraw}
                  disabled={withdrawing || !wallet || wallet.walletBalance <= 0}
                  className="mt-2 inline-flex items-center rounded-md border border-emerald-600/60 bg-emerald-600/20 px-3 py-1.5 text-[11px] font-medium text-emerald-100 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-600/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {withdrawing ? "Submitting..." : "Request withdrawal"}
                </button>

                <p className="mt-1 text-[11px] text-slate-500">
                  Platform cut per withdrawal is applied server-side (default 4
                  KES). You will receive the net driver share.
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800 mt-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Recent withdrawals
                  </h3>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
                    {withdrawals.length}
                  </span>
                </div>

                {withdrawals.length === 0 && (
                  <p className="text-[11px] text-slate-400">
                    You have not requested any withdrawals yet.
                  </p>
                )}

                {withdrawals.length > 0 && (
                  <div className="max-h-52 overflow-auto rounded-md border border-slate-800 bg-slate-950/80">
                    <table className="min-w-full border-collapse text-[11px]">
                      <thead className="bg-slate-900/80 text-slate-300">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">Amount</th>
                          <th className="px-3 py-2 text-left font-medium">Driver share</th>
                          <th className="px-3 py-2 text-left font-medium">Status</th>
                          <th className="px-3 py-2 text-left font-medium">Requested</th>
                        </tr>
                      </thead>
                      <tbody>
                        {withdrawals
                          .slice()
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime(),
                          )
                          .map((w, idx) => (
                            <tr
                              key={`${w.createdAt}-${idx}`}
                              className="border-t border-slate-800/80"
                            >
                              <td className="px-3 py-2 text-slate-100">
                                KES {w.amountRequested.toLocaleString()}
                              </td>
                              <td className="px-3 py-2 text-slate-200">
                                KES {w.driverShare.toLocaleString()}
                              </td>
                              <td className="px-3 py-2 text-slate-300">
                                {w.status}
                              </td>
                              <td className="px-3 py-2 text-slate-400">
                                {new Date(w.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
