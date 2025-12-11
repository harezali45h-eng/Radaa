import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 1 : 0;
  res.json({ status: "ok", db: dbState });
});

export default router;
