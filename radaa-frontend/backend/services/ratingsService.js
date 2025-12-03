import mongoose from "mongoose";
import Rating from "../models/Rating.js";
import { ValidationError } from "../utils/errors.js";

const toObjectId = (id) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    throw new ValidationError("Invalid id");
  }
};

export const createRating = async ({ userId, matatuId, driverId, rating, comment }) => {
  if (!userId || !matatuId) {
    throw new ValidationError("userId and matatuId are required");
  }

  const value = typeof rating === "number" ? rating : Number(rating);

  if (!Number.isFinite(value) || value < 1 || value > 5) {
    throw new ValidationError("rating must be between 1 and 5");
  }

  const doc = await Rating.create({
    userId: toObjectId(userId),
    matatuId: toObjectId(matatuId),
    driverId: driverId ? toObjectId(driverId) : undefined,
    rating: value,
    comment: comment || ""
  });

  const summary = await getRatingSummaryForMatatu(matatuId);

  return { rating: doc, summary };
};

export const getRatingSummaryForMatatu = async (matatuId) => {
  const [row] = await Rating.aggregate([
    { $match: { matatuId: toObjectId(matatuId) } },
    { $group: { _id: "$matatuId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);

  if (!row) {
    return { avgRating: 0, count: 0 };
  }

  return {
    avgRating: row.avgRating,
    count: row.count
  };
};

export const getMatatuRatings = async ({ matatuId, page = 1, pageSize = 10 }) => {
  const safePage = Number(page) || 1;
  const safePageSize = Number(pageSize) || 10;
  const limit = Math.min(Math.max(safePageSize, 1), 50);
  const skip = (safePage - 1) * limit;

  const [summary, reviews, total] = await Promise.all([
    getRatingSummaryForMatatu(matatuId),
    Rating.find({ matatuId: toObjectId(matatuId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Rating.countDocuments({ matatuId: toObjectId(matatuId) })
  ]);

  return {
    summary,
    reviews,
    total,
    page: safePage,
    pageSize: limit
  };
};

export const getRatingSummariesForMatatus = async (matatuIds) => {
  if (!Array.isArray(matatuIds) || matatuIds.length === 0) {
    return {};
  }

  const objectIds = matatuIds.map((id) => toObjectId(id));

  const rows = await Rating.aggregate([
    { $match: { matatuId: { $in: objectIds } } },
    { $group: { _id: "$matatuId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);

  const map = {};

  for (const row of rows) {
    map[row._id.toString()] = {
      avgRating: row.avgRating,
      count: row.count
    };
  }

  return map;
};
