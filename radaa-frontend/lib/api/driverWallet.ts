import API from "../api";

export interface DriverWalletTransaction {
  type: "credit" | "withdrawal" | "adjustment" | string;
  amount: number;
  balanceAfter: number;
  reference?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

export interface DriverWalletWithdrawal {
  amountRequested: number;
  platformCut: number;
  driverShare: number;
  status: "pending" | "approved" | "paid" | "failed" | string;
  isManualPayout?: boolean;
  mpesaReceiptNumber?: string;
  phoneNumber?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverWallet {
  driver: string;
  walletBalance: number;
  pendingWithdrawals: number;
  totalEarned: number;
  currency: string;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
  transactions: DriverWalletTransaction[];
  withdrawals: DriverWalletWithdrawal[];
}

export async function getDriverWallet(): Promise<DriverWallet> {
  const res = await API.get<{ success?: boolean; data: DriverWallet }>(
    "/driver/wallet",
  );
  const payload = res.data;
  if (!payload || !payload.data) {
    throw new Error("Invalid driver wallet response");
  }
  return payload.data;
}

export async function requestDriverWithdrawal(input: {
  amount: number;
  phoneNumber: string;
}): Promise<{ wallet: DriverWallet; withdrawal: DriverWalletWithdrawal }> {
  const res = await API.post<{
    success?: boolean;
    data: { wallet: DriverWallet; withdrawal: DriverWalletWithdrawal };
  }>("/driver/withdraw", input);
  const payload = res.data;
  if (!payload || !payload.data) {
    throw new Error("Invalid driver withdrawal response");
  }
  return payload.data;
}
