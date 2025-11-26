import express from "express";
import { getMapMarkers, getRoutePolyline } from "../controllers/mapController.js";

const router = express.Router();

router.get("/map/markers", getMapMarkers);
router.get("/map/route/:routeId", getRoutePolyline);

export default router;
