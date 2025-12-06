import express from "express";
import {
  createRidePayment,
  redeemFreeRide,
  initiatePayment,
  verifyPayment,
  mpesaDeposit,
  mpesaFare
} from "../controllers/paymentController.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { createRidePaymentSchema, redeemFreeRideSchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/ride", validateRequest(createRidePaymentSchema), createRidePayment);
router.post("/redeem-free", validateRequest(redeemFreeRideSchema), redeemFreeRide);
router.post("/initiate", initiatePayment);
router.post("/verify", verifyPayment);
router.post("/mpesa/deposit", mpesaDeposit);
router.post("/mpesa/fare", mpesaFare);

export default router;
