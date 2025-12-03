import express from "express";
import { startTrip, stopTrip, getTripHistory } from "../controllers/tripController.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { startTripSchema, stopTripSchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/start", validateRequest(startTripSchema), startTrip);
router.post("/:id/stop", validateRequest(stopTripSchema), stopTrip);
router.get("/user/:userId", getTripHistory);

export default router;
