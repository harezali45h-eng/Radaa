import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import {
  createLiveRequest,
  getActiveLiveRequest,
  cancelLiveRequest,
  getVisibleLiveRequests
} from "../controllers/liveRequestsController.js";
import {
  createLiveRequestSchema,
  getVisibleLiveRequestsSchema
} from "../utils/validationSchemas.js";

const router = express.Router();

const requireDriverRole = (req, res, next) => {
  if (!req.user || (req.user.role !== "driver" && req.user.role !== "admin")) {
    return res
      .status(403)
      .json({ success: false, message: "Driver access required" });
  }

  return next();
};

router.post(
  "/",
  requireAuth,
  validateRequest(createLiveRequestSchema),
  createLiveRequest
);

router.get("/", requireAuth, getActiveLiveRequest);

router.get("/active", requireAuth, getActiveLiveRequest);

router.post(
  "/:id/cancel",
  requireAuth,
  cancelLiveRequest
);

router.get(
  "/visible",
  requireAuth,
  requireDriverRole,
  validateRequest(getVisibleLiveRequestsSchema),
  getVisibleLiveRequests
);

export default router;
