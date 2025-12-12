import express from "express";
import {
  getBoltSuggestions,
  getBoltRouteMatatus,
  getBoltLive,
} from "../controllers/boltController.js";

const router = express.Router();

router.get("/suggestions", getBoltSuggestions);
router.get("/routes/:routeId/matatus", getBoltRouteMatatus);
router.get("/live", getBoltLive);

export default router;
