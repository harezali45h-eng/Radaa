"use client";

import { useEffect, useState, useCallback } from "react";
import API from "@/lib/api";

export type WalletTransactionType = "deposit" | "fare";

export interface WalletTransaction {
  type: WalletTransactionType;
  amount: number;
  timestamp: string;
}

export interface Wallet {
  _id: string;
  user: string;
  balance: number;
  loyaltyPoints: number;
  transactions: WalletTransaction[];
}

interface UseWalletResult {
  wallet: Wallet | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useWallet(): UseWalletResult {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState<number>(0);

  const refresh = useCallback(() => {
    setReloadToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await API.get<Wallet>("/wallet");
        if (!cancelled) {
          setWallet(res.data as Wallet);
        }
      } catch (err: any) {
        if (!cancelled) {
          const message =
            (err?.response?.data?.message as string) || err?.message ||
            "Failed to load wallet";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  return { wallet, loading, error, refresh };
}
