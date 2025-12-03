import express from "express";
import multer from "multer";
import requireAuth from "../middleware/requireAuth.js";
import optionalAuth from "../middleware/optionalAuth.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { getMatatuRatingsSchema, photoModerationSchema } from "../utils/validationSchemas.js";
import {
  uploadMatatuPhoto,
  getMatatuPhotos,
  approveMatatuPhoto,
  rejectMatatuPhoto
} from "../controllers/matatuMediaController.js";
import { getMatatuRatingsHandler } from "../controllers/ratingsController.js";

const router = express.Router();

const upload = multer({ dest: "uploads" });

router.post("/:id/photos", requireAuth, upload.single("photo"), uploadMatatuPhoto);

router.get("/:id/photos", optionalAuth, getMatatuPhotos);

router.post(
  "/:id/photos/:photoId/approve",
  requireAuth,
  validateRequest(photoModerationSchema),
  approveMatatuPhoto
);

router.post(
  "/:id/photos/:photoId/reject",
  requireAuth,
  validateRequest(photoModerationSchema),
  rejectMatatuPhoto
);

router.get(
  "/:id/ratings",
  validateRequest(getMatatuRatingsSchema),
  getMatatuRatingsHandler
);

export default router;
