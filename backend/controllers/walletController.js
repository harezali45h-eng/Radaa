import { getWalletForUser, payFareFromWallet } from "../services/walletService.js";
import { initiateMpesaStkPushService } from "../services/mpesaService.js";
import RidePayment from "../models/RidePayment.js";

export const getWallet = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const wallet = await getWalletForUser(userId);
    res.json(wallet);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const depositWithMpesa = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { amount, phoneNumber, accountReference, description, matatuId } =
      req.body || {};

    const result = await initiateMpesaStkPushService({
      userId,
      amount,
      phoneNumber,
      accountReference,
      description,
      matatuId,
      purpose: "deposit",
    });

    res.status(201).json(result);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const payFare = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { amount, matatuId, reference } = req.body || {};
    const rawKey =
      (req.headers["idempotency-key"] ||
        req.headers["x-idempotency-key"]) ??
      undefined;
    const idempotencyKey =
      typeof rawKey === "string" && rawKey.trim().length > 0
        ? rawKey.trim()
        : undefined;

    if (idempotencyKey) {
      const existing = await RidePayment.findOne({
        user: userId,
        idempotencyKey,
        purpose: "fare",
        provider: "wallet"
      });

      if (existing) {
        const wallet = await getWalletForUser(userId);
        return res.status(200).json({
          wallet,
          receipt: {
            paymentId: existing._id,
            amount: existing.amount,
            balance: wallet.balance,
            loyaltyPoints: wallet.loyaltyPoints,
            status: existing.status
          }
        });
      }
    }

    const { wallet, payment } = await payFareFromWallet(userId, amount, {
      matatuId,
      reference,
      idempotencyKey
    });
    res.status(200).json({
      wallet,
      receipt: {
        paymentId: payment._id,
        amount: payment.amount,
        balance: wallet.balance,
        loyaltyPoints: wallet.loyaltyPoints,
        status: payment.status
      }
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};
