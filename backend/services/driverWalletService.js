import mongoose from "mongoose";
import DriverWallet from "../models/DriverWallet.js";
import AuditLog from "../models/AuditLog.js";
import { ValidationError } from "../utils/errors.js";

const PLATFORM_CUT_FLAT = Number(process.env.PLATFORM_CUT_FLAT || 4);

export const getOrCreateDriverWallet = async (driverId, session) => {
  if (!driverId) {
    throw new ValidationError("driverId is required for driver wallet operations");
  }

  let query = DriverWallet.findOne({ driver: driverId });
  if (session) {
    query = query.session(session);
  }

  let wallet = await query;

  if (!wallet) {
    if (session) {
      const [created] = await DriverWallet.create(
        [
          {
            driver: driverId,
            walletBalance: 0,
            pendingWithdrawals: 0,
            totalEarned: 0,
            currency: "KES",
            transactions: [],
            withdrawals: [],
          },
        ],
        { session },
      );
      wallet = created;
    } else {
      wallet = await DriverWallet.create({
        driver: driverId,
        walletBalance: 0,
        pendingWithdrawals: 0,
        totalEarned: 0,
        currency: "KES",
        transactions: [],
        withdrawals: [],
      });
    }
  }

  return wallet;
};

export const getDriverWalletWithHistory = async (driverId) => {
  const wallet = await getOrCreateDriverWallet(driverId);
  return wallet;
};

export const creditDriverWalletFromFare = async (
  { driverId, amount, reference, meta },
  session,
) => {
  if (amount == null || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
    throw new ValidationError("Credit amount must be a positive number");
  }

  const normalizedAmount = Math.round(Number(amount));
  const wallet = await getOrCreateDriverWallet(driverId, session);

  wallet.walletBalance += normalizedAmount;
  wallet.totalEarned += normalizedAmount;

  wallet.transactions.push({
    type: "credit",
    amount: normalizedAmount,
    balanceAfter: wallet.walletBalance,
    reference: reference || undefined,
    meta: meta || undefined,
    createdAt: new Date(),
  });

  if (session) {
    await wallet.save({ session });
  } else {
    await wallet.save();
  }

  await AuditLog.create(
    [
      {
        type: "driver_wallet_credit",
        userId: driverId,
        meta: {
          amount: normalizedAmount,
          reference: reference || undefined,
          ...(meta || {}),
        },
      },
    ],
    session ? { session } : undefined,
  );

  return wallet;
};

export const requestDriverWithdrawal = async ({
  driverId,
  amountRequested,
  phoneNumber,
}) => {
  if (!driverId) {
    throw new ValidationError("driverId is required");
  }

  if (
    amountRequested == null ||
    Number.isNaN(Number(amountRequested)) ||
    Number(amountRequested) <= 0
  ) {
    throw new ValidationError("Withdrawal amount must be a positive number");
  }

  if (!phoneNumber || typeof phoneNumber !== "string") {
    throw new ValidationError("phoneNumber is required for withdrawals");
  }

  const normalizedAmount = Math.round(Number(amountRequested));

  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      const wallet = await getOrCreateDriverWallet(driverId, session);

      if (wallet.walletBalance < normalizedAmount) {
        throw new ValidationError("Wallet balance is insufficient for withdrawal");
      }

      const platformCut = PLATFORM_CUT_FLAT;
      const driverShare = normalizedAmount - platformCut;

      if (driverShare <= 0) {
        throw new ValidationError(
          "Withdrawal amount is too small after platform cut is applied",
        );
      }

      wallet.walletBalance -= normalizedAmount;
      wallet.pendingWithdrawals += normalizedAmount;

      const withdrawalRecord = {
        amountRequested: normalizedAmount,
        platformCut,
        driverShare,
        status: "pending",
        isManualPayout: true,
        mpesaReceiptNumber: undefined,
        phoneNumber,
        failureReason: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      wallet.withdrawals.push(withdrawalRecord);

      wallet.transactions.push({
        type: "withdrawal",
        amount: normalizedAmount,
        balanceAfter: wallet.walletBalance,
        reference: undefined,
        meta: {
          platformCut,
          driverShare,
          phoneNumber,
        },
        createdAt: new Date(),
      });

      await wallet.save({ session });

      await AuditLog.create(
        [
          {
            type: "driver_withdrawal_requested",
            userId: driverId,
            meta: {
              amountRequested: normalizedAmount,
              platformCut,
              driverShare,
              phoneNumber,
            },
          },
        ],
        { session },
      );

      result = {
        wallet,
        withdrawal: withdrawalRecord,
      };
    });
  } finally {
    session.endSession();
  }

  return result;
};
