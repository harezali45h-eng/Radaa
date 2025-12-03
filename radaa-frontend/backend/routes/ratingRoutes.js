import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { createRatingSchema } from "../utils/validationSchemas.js";
import { createRatingHandler } from "../controllers/ratingsController.js";

const router = express.Router();

router.post("/", requireAuth, validateRequest(createRatingSchema), createRatingHandler);

export default router;
