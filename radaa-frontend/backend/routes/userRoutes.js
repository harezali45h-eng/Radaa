import express from "express";
import { getUsers, createUser, getLoyaltyStatus } from "../controllers/userController.js";

const router = express.Router();
router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id/loyalty", getLoyaltyStatus);

export default router;
