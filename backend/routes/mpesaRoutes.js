import express from "express";
import { initiateMpesaStkPush, mpesaStkCallback } from "../controllers/mpesaController.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { initiateMpesaPaymentSchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/stk-push", validateRequest(initiateMpesaPaymentSchema), initiateMpesaStkPush);
router.post("/callback", mpesaStkCallback);

export default router;
