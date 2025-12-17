import express from "express";
import { getStages } from "../controllers/stagesController.js";

const router = express.Router();

router.get("/", getStages);

export default router;
