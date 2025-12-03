import express from "express";
import rateLimit from "express-rate-limit";
import requireAuth from "../middleware/requireAuth.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import {
  createRideRequest,
  getNearbyRideRequests,
  acceptRideRequest,
  cancelRideRequest,
  getUserRides,
  getDriverAssignedRides
} from "../controllers/rideController.js";
import {
  createRideRequestSchema,
  getNearbyRideRequestsSchema,
  acceptRideRequestSchema,
  cancelRideRequestSchema,
  getUserRidesSchema
} from "../utils/validationSchemas.js";

const router = express.Router();

const rideWriteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false
});

const requireDriverRole = (req, res, next) => {
  if (!req.user || (req.user.role !== "driver" && req.user.role !== "admin")) {
    return res.status(403).json({ success: false, message: "Driver access required" });
  }

  return next();
};

const requireUserRole = (req, res, next) => {
  if (!req.user || (req.user.role !== "user" && req.user.role !== "admin")) {
    return res.status(403).json({ success: false, message: "User access required" });
  }

  return next();
};

router.post(
  "/request",
  requireAuth,
  rideWriteLimiter,
  requireUserRole,
  validateRequest(createRideRequestSchema),
  createRideRequest
);

router.get(
  "/nearby",
  requireAuth,
  requireDriverRole,
  validateRequest(getNearbyRideRequestsSchema),
  getNearbyRideRequests
);

router.get("/driver/assigned", requireAuth, requireDriverRole, getDriverAssignedRides);

router.post(
  "/:id/accept",
  requireAuth,
  rideWriteLimiter,
  requireDriverRole,
  validateRequest(acceptRideRequestSchema),
  acceptRideRequest
);

router.post(
  "/:id/cancel",
  requireAuth,
  rideWriteLimiter,
  validateRequest(cancelRideRequestSchema),
  cancelRideRequest
);

router.get(
  "/user/:id",
  requireAuth,
  validateRequest(getUserRidesSchema),
  getUserRides
);

export default router;
