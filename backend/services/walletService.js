import mongoose from "mongoose";
import Wallet from "../models/Wallet.js";
import RidePayment from "../models/RidePayment.js";
import { ValidationError } from "../utils/errors.js";

export const getOrCreateWalletForUser = async (userId, session) => {
  if (!userId) {
    throw new ValidationError("userId is required for wallet operations");
  }

  let query = Wallet.findOne({ user: userId });
  if (session) {
    query = query.session(session);
  }

  let wallet = await query;

  if (!wallet) {
    if (session) {
      const [created] = await Wallet.create(
        [
          {
            user: userId,
            balance: 0,
            loyaltyPoints: 0,
            transactions: []
          }
        ],
        { session }
      );
      wallet = created;
    } else {
      wallet = await Wallet.create({
        user: userId,
        balance: 0,
        loyaltyPoints: 0,
        transactions: []
      });
    }
  }

  return wallet;
};

export const getWalletForUser = async (userId) => {
  const wallet = await getOrCreateWalletForUser(userId);
  return wallet;
};

export const applyDepositToWallet = async (userId, amount, options = {}) => {
  const { session, reference } = options || {};
  if (amount == null || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
    throw new ValidationError("Deposit amount must be a positive number");
  }

  const wallet = await getOrCreateWalletForUser(userId, session);
  const normalizedAmount = Math.round(Number(amount));

  wallet.balance += normalizedAmount;
  wallet.transactions.push({
    type: "deposit",
    amount: normalizedAmount,
    timestamp: new Date(),
    balanceAfter: wallet.balance,
    reference: reference || undefined,
    status: "success"
  });

  if (session) {
    await wallet.save({ session });
  } else {
    await wallet.save();
  }
  return wallet;
};

export const payFareFromWallet = async (userId, amount, options = {}) => {
  const { matatuId, reference, idempotencyKey } = options || {};
  if (amount == null || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
    throw new ValidationError("Fare amount must be a positive number");
  }

  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      const wallet = await getOrCreateWalletForUser(userId, session);
      const normalizedAmount = Math.round(Number(amount));

      if (wallet.balance < normalizedAmount) {
        throw new ValidationError("Wallet balance haitoshi kulipa hii fare.");
      }

      wallet.balance -= normalizedAmount;
      wallet.transactions.push({
        type: "fare",
        amount: normalizedAmount,
        timestamp: new Date(),
        balanceAfter: wallet.balance,
        matatu: matatuId || null,
        reference: reference || undefined,
        status: "success"
      });

      const totalFareSpent = wallet.transactions
        .filter((tx) => tx.type === "fare")
        .reduce((sum, tx) => sum + (tx.amount || 0), 0);

      const expectedPoints = Math.floor(totalFareSpent / 1500) * 50;
      wallet.loyaltyPoints = expectedPoints;

      await wallet.save({ session });

      const paymentDocs = await RidePayment.create(
        [
          {
            user: userId,
            matatu: matatuId || null,
            amount: normalizedAmount,
            currency: "KES",
            provider: "wallet",
            providerPaymentId:
              reference || `wallet-${Date.now().toString(36)}`,
            status: "success",
            method: "wallet",
            transactionId: reference || undefined,
            purpose: "fare",
            idempotencyKey: idempotencyKey || undefined
          }
        ],
        { session }
      );

      const payment = paymentDocs[0];

      result = {
        wallet,
        payment
      };
    });
  } finally {
    session.endSession();
  }

  return result;
};
