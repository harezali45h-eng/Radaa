import express from "express";
import multer from "multer";
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/register", upload.single("profilePhoto"), registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Auth service OK" });
});

export default router;
