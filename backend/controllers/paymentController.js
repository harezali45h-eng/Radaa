import {
  createRidePaymentService,
  redeemFreeRideService,
  initiatePaymentService,
  verifyPaymentService
} from "../services/paymentService.js";
import { initiateMpesaStkPushService } from "../services/mpesaService.js";

export const createRidePayment = async (req, res, next) => {
  try {
    const result = await createRidePaymentService(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const mpesaDeposit = async (req, res, next) => {
  try {
    const result = await initiateMpesaStkPushService({
      ...req.body,
      purpose: "deposit"
    });
    res.status(201).json(result);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const mpesaFare = async (req, res, next) => {
  try {
    const result = await initiateMpesaStkPushService({
      ...req.body,
      purpose: "fare"
    });
    res.status(201).json(result);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const initiatePayment = async (req, res, next) => {
  try {
    const result = await initiatePaymentService(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const result = await verifyPaymentService(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const redeemFreeRide = async (req, res, next) => {
  try {
    const result = await redeemFreeRideService(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};
