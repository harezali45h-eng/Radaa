import express from "express";
import { getWallet, depositWithMpesa, payFare } from "../controllers/walletController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getWallet);
router.post("/deposit", depositWithMpesa);
router.post("/pay-fare", payFare);

export default router;
