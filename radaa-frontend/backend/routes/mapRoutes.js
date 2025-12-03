import express from "express";
import { getMapMarkers, getRoutePolyline } from "../controllers/mapController.js";

const router = express.Router();

router.get("/markers", getMapMarkers);
router.get("/route/:routeId", getRoutePolyline);

export default router;
