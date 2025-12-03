import express from "express";
import rateLimit from "express-rate-limit";
import requireAuth from "../middleware/requireAuth.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import {
  createEphemeralRequest,
  getNearbyEphemeralRequests,
  acceptEphemeralRequest,
  cancelEphemeralRequest,
  lockRequest,
  pingPassengerLocation
} from "../controllers/requestsController.js";
import {
  createEphemeralRequestSchema,
  getNearbyEphemeralRequestsSchema,
  acceptEphemeralRequestSchema,
  cancelEphemeralRequestSchema,
  lockRequestSchema,
  pingPassengerLocationSchema
} from "../utils/validationSchemas.js";

const router = express.Router();

const requestsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});

const requireDriverRole = (req, res, next) => {
  if (!req.user || (req.user.role !== "driver" && req.user.role !== "admin")) {
    return res.status(403).json({ success: false, message: "Driver access required" });
  }

  return next();
};

router.post(
  "/",
  requireAuth,
  requestsLimiter,
  validateRequest(createEphemeralRequestSchema),
  createEphemeralRequest
);
router.get(
  "/nearby",
  requireAuth,
  requestsLimiter,
  requireDriverRole,
  validateRequest(getNearbyEphemeralRequestsSchema),
  getNearbyEphemeralRequests
);
router.post(
  "/:id/accept",
  requireAuth,
  requestsLimiter,
  requireDriverRole,
  validateRequest(acceptEphemeralRequestSchema),
  acceptEphemeralRequest
);
router.post(
  "/:id/cancel",
  requireAuth,
  requestsLimiter,
  validateRequest(cancelEphemeralRequestSchema),
  cancelEphemeralRequest
);
router.post(
  "/:id/lock",
  requireAuth,
  requestsLimiter,
  validateRequest(lockRequestSchema),
  lockRequest
);
router.post(
  "/:id/ping-location",
  requireAuth,
  requestsLimiter,
  validateRequest(pingPassengerLocationSchema),
  pingPassengerLocation
);

export default router;
