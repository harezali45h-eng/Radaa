import express from "express";
import multer from "multer";
import requireAuth from "../middleware/requireAuth.js";
import optionalAuth from "../middleware/optionalAuth.js";
import {
  uploadMatatuPhotoV2,
  listMatatuPhotosV2,
  deleteMatatuPhotoV2,
} from "../controllers/matatuPhotoController.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

router.post(
  "/:id/photos/v2",
  requireAuth,
  upload.single("photo"),
  uploadMatatuPhotoV2,
);

router.get(
  "/:id/photos/v2",
  optionalAuth,
  listMatatuPhotosV2,
);

router.delete(
  "/:id/photos/:photoId",
  requireAuth,
  deleteMatatuPhotoV2,
);

export default router;
