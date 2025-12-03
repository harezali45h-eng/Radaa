import express from "express";
import {
  adminLogin,
  getUserStats,
  getMatatuStats,
  getRideStats,
  getFreeRideStats,
  getActiveTripsStats
} from "../controllers/adminController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", adminLogin);

router.get("/stats/users", adminAuth, getUserStats);
router.get("/stats/matatus", adminAuth, getMatatuStats);
router.get("/stats/rides", adminAuth, getRideStats);
router.get("/stats/free-rides", adminAuth, getFreeRideStats);
router.get("/stats/active-trips", adminAuth, getActiveTripsStats);

export default router;
