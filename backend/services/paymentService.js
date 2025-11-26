import RidePayment from "../models/RidePayment.js";
import User from "../models/User.js";
import { ValidationError, ApiError } from "../utils/errors.js";
import { initiatePaymentGateway, verifyPaymentGateway } from "./paymentGateway.js";

export const createRidePaymentService = async ({
  userId,
  matatuId,
  amount,
  currency,
  provider,
  providerPaymentId,
  status
}) => {
  if (!userId || !matatuId || amount == null || !provider || !providerPaymentId) {
    throw new ValidationError("Missing required payment fields");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found", "NOT_FOUND");
  }

  const payment = await RidePayment.create({
    user: userId,
    matatu: matatuId,
    amount,
    currency: currency || "KES",
    provider,
    providerPaymentId,
    status: status || "success"
  });

  if (!user.loyalty) {
    user.loyalty = {
      paidRidesCount: 0,
      freeRides: 0
    };
  }

  user.loyalty.paidRidesCount = (user.loyalty.paidRidesCount || 0) + 1;

  if (user.loyalty.paidRidesCount >= 10) {
    user.loyalty.paidRidesCount = 0;
    user.loyalty.freeRides = (user.loyalty.freeRides || 0) + 1;
  }

  user.ridesTaken = (user.ridesTaken || 0) + 1;
  user.ridesPaid = (user.ridesPaid || 0) + 1;
  user.loyaltyPoints = (user.loyaltyPoints || 0) + 1;

  await user.save();

  return {
    payment,
    loyalty: user.loyalty
  };
};

export const initiatePaymentService = async ({ userId, amount, method }) => {
  if (!userId || amount == null || !method) {
    throw new ValidationError("userId, amount, and method are required");
  }

  const gatewayResponse = await initiatePaymentGateway({ userId, amount, method });

  return gatewayResponse;
};

export const verifyPaymentService = async ({
  userId,
  matatuId,
  amount,
  method,
  transactionId
}) => {
  if (!transactionId) {
    throw new ValidationError("transactionId is required");
  }

  const verification = await verifyPaymentGateway({ transactionId, method });

  if (verification.status !== "success") {
    return { verification };
  }

  const ridePaymentResult = await createRidePaymentService({
    userId,
    matatuId,
    amount,
    currency: verification.currency || "KES",
    provider: method || verification.provider || "placeholder",
    providerPaymentId: verification.transactionId || transactionId,
    status: verification.status
  });

  return {
    verification,
    ...ridePaymentResult
  };
};

export const redeemFreeRideService = async ({ userId, matatuId, provider }) => {
  if (!userId || !matatuId) {
    throw new ValidationError("Missing required fields");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found", "NOT_FOUND");
  }

  if (!user.loyalty || !user.loyalty.freeRides || user.loyalty.freeRides <= 0) {
    throw new ValidationError("No free rides available");
  }

  user.loyalty.freeRides -= 1;
  user.ridesTaken = (user.ridesTaken || 0) + 1;
  await user.save();

  const payment = await RidePayment.create({
    user: userId,
    matatu: matatuId,
    amount: 0,
    currency: "KES",
    provider: provider || "loyalty",
    providerPaymentId: `FREE-${Date.now()}`,
    status: "free"
  });

  return {
    payment,
    loyalty: user.loyalty
  };
};
