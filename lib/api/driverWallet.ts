import API from "../api";

interface RequestOptions {
  method?: string;
  body?: unknown;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body } = options;

  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await API.request<{ success?: boolean; data?: T } | T>({
        url: path,
        method,
        data: body,
      });

      const data: any = response.data;
      const isJson = data !== null && typeof data !== "undefined";

      const isWrappedSuccess =
        isJson &&
        data &&
        typeof data === "object" &&
        "success" in (data as any) &&
        (data as any).success === true &&
        "data" in (data as any);

      if (isWrappedSuccess) {
        return (data as any).data as T;
      }

      return data as T;
    } catch (error: any) {
      lastError = error;
      // eslint-disable-next-line no-console
      console.error("API ERROR:", error?.response?.data || error);

      const status = error?.response?.status as number | undefined;
      const data = error?.response?.data;
      const message =
        (data &&
          typeof data === "object" &&
          ((data as any).message || (data as any).error)) ||
        error?.message ||
        "Request failed";

      if (status && status >= 500 && attempt < maxAttempts) {
        lastError = new Error(message);
        continue;
      }

      throw new Error(message);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed");
}

export interface DriverWalletTransaction {
  type: "credit" | "withdrawal" | "adjustment";
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
  isManualPayout: boolean;
  mpesaReceiptNumber?: string;
  phoneNumber?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverWallet {
  _id: string;
  driver: string;
  walletBalance: number;
  pendingWithdrawals: number;
  totalEarned: number;
  lastUpdated?: string;
  currency: string;
  transactions: DriverWalletTransaction[];
  withdrawals: DriverWalletWithdrawal[];
}

export async function getDriverWallet(): Promise<DriverWallet> {
  return request<DriverWallet>("/driver/wallet", { method: "GET" });
}

export async function requestDriverWithdrawal(payload: {
  amount: number;
  phoneNumber: string;
}): Promise<{ wallet: DriverWallet; withdrawal: DriverWalletWithdrawal }> {
  return request<{ wallet: DriverWallet; withdrawal: DriverWalletWithdrawal }>(
    "/driver/withdraw",
    {
      method: "POST",
      body: payload,
    },
  );
}
