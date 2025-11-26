import express from "express";
import { requireRoutesV1 } from "../middleware/featureFlagMiddleware.js";
import {
  getRouteById,
  searchRoutes,
  getMatatusOnRoute
} from "../controllers/routesController.js";

const router = express.Router();

router.get("/routes/:id", requireRoutesV1, getRouteById);
router.get("/search/route", requireRoutesV1, searchRoutes);
router.get("/routes/:id/matatus", requireRoutesV1, getMatatusOnRoute);

export default router;
