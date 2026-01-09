import express from "express";
import { getMapMarkers, getRoutePolyline, getOnlinePassengers } from "../controllers/mapController.js";

const router = express.Router();

router.get("/markers", getMapMarkers);
router.get("/route/:routeId", getRoutePolyline);
router.get("/online-passengers", getOnlinePassengers);

export default router;
