import express from "express";
import { listFeatureFlags } from "../controllers/featureFlagsController.js";

const router = express.Router();

router.get("/feature-flags", listFeatureFlags);

export default router;
