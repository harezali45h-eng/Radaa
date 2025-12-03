import express from "express";
import { listFeatureFlags } from "../controllers/featureFlagsController.js";

const router = express.Router();

router.get("/", listFeatureFlags);

export default router;
