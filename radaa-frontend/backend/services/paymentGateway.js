import { ValidationError } from "../utils/errors.js";

// Placeholder payment gateway integration for Mpesa, Stripe, Flutterwave, etc.
// This module is intentionally credential-free and does not call any real APIs.

export const initiatePaymentGateway = async ({ userId, amount, method }) => {
  if (!userId || amount == null || !method) {
    throw new ValidationError("userId, amount, and method are required to initiate payment");
  }

  const transactionId = `PLACEHOLDER-${Date.now()}`;

  return {
    status: "pending",
    provider: method,
    transactionId,
    amount,
    currency: "KES"
  };
};

export const verifyPaymentGateway = async ({ transactionId, method }) => {
  if (!transactionId) {
    throw new ValidationError("transactionId is required to verify payment");
  }

  // In a real implementation, this would call the provider SDK / REST API.
  // For now we just assume success.
  return {
    status: "success",
    provider: method || "placeholder",
    transactionId,
    currency: "KES"
  };
};
