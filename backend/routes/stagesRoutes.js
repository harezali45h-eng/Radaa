import express from "express";
import { getStages, getStagesGeoJson } from "../controllers/stagesController.js";

const router = express.Router();

router.get("/", getStages);
router.get("/geojson", getStagesGeoJson);

export default router;
