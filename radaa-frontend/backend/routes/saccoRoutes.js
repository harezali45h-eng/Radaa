import express from "express";
import multer from "multer";
import requireAuth from "../middleware/requireAuth.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import {
  saccoSetDriverEnabledSchema,
  saccoOverviewSchema,
  saccoListDriversSchema,
  saccoListMatatusSchema,
  saccoSetDriverVerificationSchema,
  saccoSetMatatuApprovalSchema
} from "../utils/validationSchemas.js";
import {
  setDriverEnabled,
  getSaccoOverview,
  getSaccoDrivers,
  getSaccoMatatus,
  uploadSaccoDoc,
  setDriverVerificationStatus,
  setMatatuApprovalStatus
} from "../controllers/saccoController.js";

const router = express.Router();

const upload = multer({ dest: "uploads" });

router.get(
  "/:id/overview",
  requireAuth,
  validateRequest(saccoOverviewSchema),
  getSaccoOverview
);

router.get(
  "/:id/drivers",
  requireAuth,
  validateRequest(saccoListDriversSchema),
  getSaccoDrivers
);

router.get(
  "/:id/matatus",
  requireAuth,
  validateRequest(saccoListMatatusSchema),
  getSaccoMatatus
);

router.post(
  "/:id/docs",
  requireAuth,
  upload.single("file"),
  uploadSaccoDoc
);

router.post(
  "/:id/driver/:driverId/disable",
  requireAuth,
  validateRequest(saccoSetDriverEnabledSchema),
  setDriverEnabled
);

router.post(
  "/:id/driver/:driverId/verification",
  requireAuth,
  validateRequest(saccoSetDriverVerificationSchema),
  setDriverVerificationStatus
);

router.post(
  "/:id/matatu/:matatuId/approval",
  requireAuth,
  validateRequest(saccoSetMatatuApprovalSchema),
  setMatatuApprovalStatus
);

export default router;
