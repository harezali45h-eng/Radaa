import mongoose from "mongoose";
import RidePayment from "../models/RidePayment.js";
import PaymentConfirmation from "../models/PaymentConfirmation.js";
import User from "../models/User.js";
import Matatu from "../models/Matatu.js";
import { ValidationError, ApiError } from "../utils/errors.js";
import { applyDepositToWallet } from "./walletService.js";
import { creditDriverWalletFromFare } from "./driverWalletService.js";

const MPESA_ENV = process.env.MPESA_ENV || "sandbox";

const MPESA_BASE_URL =
  MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL;
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;

let tokenCache = {
  token: null,
  expiresAt: 0
};

const ensureMpesaConfig = () => {
  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET || !MPESA_SHORTCODE || !MPESA_PASSKEY) {
    throw new ValidationError("Mpesa configuration is incomplete");
  }
};

const getTimestamp = () => {
  const date = new Date();
  const pad = (value) => value.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

const getMpesaPassword = (timestamp) => {
  const raw = `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`;
  return Buffer.from(raw).toString("base64");
};

const normalizePhoneNumber = (value) => {
  if (!value) {
    return "";
  }

  const digits = String(value).replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("254")) {
    return digits;
  }

  if (digits.length === 10 && digits.startsWith("0")) {
    return `254${digits.slice(1)}`;
  }

  if (digits.length === 9 && digits.startsWith("7")) {
    return `254${digits}`;
  }

  if (digits.length === 13 && digits.startsWith("2540")) {
    return `254${digits.slice(4)}`;
  }

  return digits;
};

export const getMpesaAccessToken = async () => {
  ensureMpesaConfig();

  const now = Date.now();
  if (tokenCache.token && tokenCache.expiresAt > now + 60000) {
    return tokenCache.token;
  }

  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");

  const response = await fetch(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`
      }
    }
  );

  if (!response.ok) {
    throw new ApiError(response.status, "Failed to obtain Mpesa access token", "MPESA_AUTH_ERROR");
  }

  const data = await response.json();
  const accessToken = data.access_token;
  const expiresIn = Number(data.expires_in) || 0;

  if (!accessToken) {
    throw new ApiError(500, "Invalid Mpesa auth response", "MPESA_AUTH_ERROR");
  }

  tokenCache = {
    token: accessToken,
    expiresAt: now + Math.max(expiresIn - 60, 60) * 1000
  };

  return accessToken;
};

export const initiateMpesaStkPushService = async ({
  userId,
  amount,
  phoneNumber,
  accountReference,
  description,
  matatuId,
  purpose,
  tripId,
  driverId,
  fareAmount
}) => {
  if (!userId || amount == null || !phoneNumber) {
    throw new ValidationError("userId, amount, and phoneNumber are required");
  }

  ensureMpesaConfig();

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found", "NOT_FOUND");
  }

  let matatu = null;
  if (matatuId) {
    matatu = await Matatu.findById(matatuId);
    if (!matatu) {
      throw new ApiError(404, "Matatu not found", "NOT_FOUND");
    }
  }

  const normalizedAmount = Math.max(1, Math.round(Number(amount)));
  if (Number.isNaN(normalizedAmount)) {
    throw new ValidationError("amount must be a valid number");
  }

  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

  const token = await getMpesaAccessToken();
  const timestamp = getTimestamp();
  const password = getMpesaPassword(timestamp);

  const callbackUrl = MPESA_CALLBACK_URL;
  if (!callbackUrl) {
    throw new ValidationError("MPESA_CALLBACK_URL is not configured");
  }

  const effectivePurpose = purpose || "other";

  const payload = {
    BusinessShortCode: MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: normalizedAmount,
    PartyA: normalizedPhoneNumber,
    PartyB: MPESA_SHORTCODE,
    PhoneNumber: normalizedPhoneNumber,
    CallBackURL: callbackUrl,
    AccountReference:
      accountReference ||
      (effectivePurpose === "deposit"
        ? "Radaa Wallet"
        : matatu?.plate || "Radaa Ride"),
    TransactionDesc:
      description ||
      (effectivePurpose === "deposit"
        ? "Radaa wallet deposit"
        : "Radaa ride payment")
  };

  const response = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      "Failed to initiate Mpesa STK push",
      "MPESA_STK_ERROR"
    );
  }

  const data = await response.json();

  if (data.ResponseCode !== "0") {
    throw new ApiError(
      502,
      data.ResponseDescription || "Mpesa STK push was rejected",
      "MPESA_STK_ERROR"
    );
  }

  const providerPaymentId = data.CheckoutRequestID || data.MerchantRequestID;

  const numericFare =
    fareAmount != null && !Number.isNaN(Number(fareAmount))
      ? Number(fareAmount)
      : undefined;

  const payment = await RidePayment.create({
    user: userId,
    matatu: matatuId || null,
    trip: tripId || null,
    driver: driverId || null,
    amount: normalizedAmount,
    currency: "KES",
    provider: "mpesa",
    providerPaymentId,
    status: "pending",
    method: "mpesa",
    transactionId: providerPaymentId,
    purpose: effectivePurpose,
    fareAmount: numericFare,
    serviceFee:
      numericFare != null && normalizedAmount >= numericFare
        ? normalizedAmount - numericFare
        : undefined,
    totalPaid: normalizedAmount
  });

  try {
    await PaymentConfirmation.create({
      user: userId,
      payment: payment._id,
      amount: payment.amount,
      currency: payment.currency || "KES",
      purpose: effectivePurpose,
      channel: "mpesa",
      status: "pending",
      meta: {
        merchantRequestId: data.MerchantRequestID,
        checkoutRequestId: data.CheckoutRequestID
      }
    });
  } catch {
    // best-effort; do not block STK on confirmation write
  }

  return {
    paymentId: payment._id,
    provider: "mpesa",
    status: "pending",
    amount: normalizedAmount,
    currency: "KES",
    merchantRequestId: data.MerchantRequestID,
    checkoutRequestId: data.CheckoutRequestID,
    customerMessage: data.CustomerMessage
  };
};

const parseCallbackMetadata = (items) => {
  if (!Array.isArray(items)) {
    return {};
  }

  const result = {};

  items.forEach((item) => {
    if (!item || !item.Name) {
      return;
    }

    if (item.Name === "Amount") {
      result.amount = item.Value;
    }

    if (item.Name === "MpesaReceiptNumber") {
      result.receipt = item.Value;
    }

    if (item.Name === "TransactionDate") {
      result.transactionDate = item.Value;
    }

    if (item.Name === "PhoneNumber") {
      result.phoneNumber = item.Value;
    }
  });

  return result;
};

const parseMpesaCallback = (body) => {
  const callback = body && body.Body && body.Body.stkCallback;

  if (!callback) {
    throw new ValidationError("Invalid Mpesa callback payload");
  }

  const metadata = parseCallbackMetadata(
    callback.CallbackMetadata && callback.CallbackMetadata.Item
  );

  return {
    merchantRequestId: callback.MerchantRequestID,
    checkoutRequestId: callback.CheckoutRequestID,
    resultCode: callback.ResultCode,
    resultDesc: callback.ResultDesc,
    amount: metadata.amount,
    receipt: metadata.receipt,
    transactionDate: metadata.transactionDate,
    phoneNumber: metadata.phoneNumber
  };
};

const parseMpesaCallbackDate = (value) => {
  if (!value) {
    return new Date();
  }

  const raw = String(value);
  if (raw.length !== 14) {
    return new Date();
  }

  const year = Number(raw.slice(0, 4));
  const month = Number(raw.slice(4, 6)) - 1;
  const day = Number(raw.slice(6, 8));
  const hours = Number(raw.slice(8, 10));
  const minutes = Number(raw.slice(10, 12));
  const seconds = Number(raw.slice(12, 14));

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    Number.isNaN(seconds)
  ) {
    return new Date();
  }

  return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
};

export const handleMpesaCallbackService = async (body) => {
  const {
    merchantRequestId,
    checkoutRequestId,
    resultCode,
    resultDesc,
    amount,
    receipt,
    transactionDate
  } = parseMpesaCallback(body);

  const providerPaymentId = checkoutRequestId || merchantRequestId;

  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      const payment = await RidePayment.findOne({
        provider: "mpesa",
        providerPaymentId
      }).session(session);

      if (!payment) {
        throw new ApiError(404, "Mpesa payment not found", "NOT_FOUND");
      }

      if (resultCode !== 0) {
        payment.status = "failed";
        payment.transactionId = receipt || payment.transactionId;
        await payment.save({ session });

        await PaymentConfirmation.findOneAndUpdate(
          { payment: payment._id },
          {
            $set: {
              status: "failed",
              meta: {
                resultCode,
                resultDesc,
                receipt: receipt || null
              }
            }
          },
          { session },
        ).catch(() => undefined);

        result = {
          payment,
          resultCode,
          resultDesc
        };
        return;
      }

      const normalizedAmount = amount != null ? Number(amount) : payment.amount;
      if (normalizedAmount != null && !Number.isNaN(normalizedAmount)) {
        payment.amount = normalizedAmount;
      }

      payment.status = "success";
      payment.currency = payment.currency || "KES";
      payment.transactionId = receipt || payment.transactionId;
      payment.method = "mpesa";

      const totalPaid =
        payment.amount != null && !Number.isNaN(Number(payment.amount))
          ? Number(payment.amount)
          : undefined;

      if (payment.purpose === "fare" && totalPaid != null) {
        const serviceFee = 6;
        const fareBase = totalPaid - serviceFee;

        payment.totalPaid = totalPaid;
        payment.serviceFee = serviceFee;
        payment.fareAmount = fareBase >= 0 ? fareBase : 0;

        if (payment.driver) {
          await creditDriverWalletFromFare(
            {
              driverId: payment.driver,
              amount: totalPaid,
              reference: receipt || undefined,
              meta: {
                paymentId: payment._id,
                user: payment.user,
                trip: payment.trip || null,
                matatu: payment.matatu || null,
                providerPaymentId,
                transactionDate: parseMpesaCallbackDate(transactionDate)
              }
            },
            session
          );
        }
      }

      if (payment.purpose === "deposit" && !payment.walletApplied) {
        await applyDepositToWallet(payment.user, payment.amount, {
          session,
          reference: receipt || undefined
        });
        payment.walletApplied = true;
      }

      await payment.save({ session });

      await PaymentConfirmation.findOneAndUpdate(
        { payment: payment._id },
        {
          $set: {
            status: payment.status,
            meta: {
              resultCode,
              resultDesc,
              receipt: receipt || payment.transactionId,
              transactionDate: parseMpesaCallbackDate(transactionDate)
            }
          }
        },
        { session },
      ).catch(() => undefined);

      result = {
        payment,
        resultCode,
        resultDesc
      };
    });
  } finally {
    session.endSession();
  }

  return result;
};
