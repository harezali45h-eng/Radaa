import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { getQueueOverview } from "../controllers/queueMonitorController.js";

const router = express.Router();

router.get("/queue/requests", adminAuth, getQueueOverview);

export default router;
