import express from "express";
import {
  registerMatatu,
  getLiveMatatus,
  getMatatuDetails,
  updateMatatuLocation,
  getMatatuIdentity
} from "../controllers/matatuController.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { matatuLocationSchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/", registerMatatu);
router.get("/live", getLiveMatatus);
router.get("/:id/identity", getMatatuIdentity);
router.get("/:id", getMatatuDetails);
router.post("/:id/location", validateRequest(matatuLocationSchema), updateMatatuLocation);

export default router;
