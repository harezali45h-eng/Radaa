import express from "express";
import {
  createLiveRequest,
  getActiveLiveRequest,
  cancelLiveRequest,
  getVisibleLiveRequests
} from "../controllers/liveRequestsController.js";
import { protect as requireAuth } from "../middleware/authMiddleware.js";

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
  getVisibleLiveRequests
);

export default router;
