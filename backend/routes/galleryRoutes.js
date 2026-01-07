import express from "express";
import { getDriverGallery } from "../controllers/galleryController.js";

const router = express.Router();

// Public driver gallery endpoint
// GET /api/gallery/drivers
router.get("/drivers", getDriverGallery);

export default router;
