import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { getDriverWallet, postDriverWithdrawal } from "../controllers/driverWalletController.js";
import { changeDriverVehicle } from "../controllers/driverController.js";

const router = express.Router();

const requireDriverRole = (req, res, next) => {
  if (!req.user || (req.user.role !== "driver" && req.user.role !== "admin")) {
    return res
      .status(403)
      .json({ success: false, message: "Driver access required" });
  }

  return next();
};

router.use(requireAuth, requireDriverRole);

router.get("/wallet", getDriverWallet);
router.post("/withdraw", postDriverWithdrawal);
router.post("/vehicle/change", changeDriverVehicle);

export default router;
