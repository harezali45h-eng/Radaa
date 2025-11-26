import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  matatuId: { type: mongoose.Schema.Types.ObjectId, ref: "Matatu", required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

ratingSchema.index({ matatuId: 1, createdAt: -1 });
ratingSchema.index({ driverId: 1, createdAt: -1 });
ratingSchema.index({ userId: 1, createdAt: -1 });

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
