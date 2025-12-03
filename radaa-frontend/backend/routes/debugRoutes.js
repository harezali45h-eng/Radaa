import express from "express";
import { getDbDebugInfo } from "../controllers/debugController.js";
import { emitMatatuUpdate } from "../realtime/devEmitHelpers.js";
import { emitMatatuUpdate as emitMatatuRealtimeUpdate } from "../realtime/events/matatu.js";
import { emitPassengerRequest } from "../realtime/events/passenger.js";
import { seedSampleRoute } from "../controllers/routesController.js";
import { isFeatureEnabled } from "../utils/featureFlags.js";
import { FEATURE_FLAG_KEYS } from "../config/featureFlags.js";

const router = express.Router();

router.get("/db", getDbDebugInfo);

if (process.env.NODE_ENV !== "production") {
  router.post("/realtime/emit-matatu", (req, res, next) => {
    try {
      emitMatatuUpdate(req.app, req.body || {});
      res.json({ status: "ok" });
    } catch (error) {
      next(error);
    }
  });

  router.post("/matatu-broadcast", (req, res, next) => {
    try {
      emitMatatuRealtimeUpdate(req.app, req.body || {});
      res.json({ status: "ok" });
    } catch (error) {
      next(error);
    }
  });

  router.post("/passenger-broadcast", (req, res, next) => {
    try {
      emitPassengerRequest(req.app, req.body || {});
      res.json({ status: "ok" });
    } catch (error) {
      next(error);
    }
  });

  router.post("/routes/seed-sample", seedSampleRoute);

  router.post("/emit-request", async (req, res, next) => {
    try {
      const enabled = await isFeatureEnabled(FEATURE_FLAG_KEYS.DRIVER_REQUESTS_V1);
      if (!enabled) {
        return res.status(404).json({ success: false, message: "Requests feature disabled" });
      }

      const payload = {
        id: `debug-${Date.now().toString(36)}`,
        pickup: {
          lat: -1.2921,
          lng: 36.8219
        },
        partySize: 1,
        meta: {
          note: "Debug ride request",
          tags: ["debug", "sample"]
        }
      };

      emitPassengerRequest(req.app, payload);

      return res.json({ status: "ok", payload });
    } catch (error) {
      return next(error);
    }
  });
}

export default router;
