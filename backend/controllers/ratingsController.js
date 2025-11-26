import { createRating, getMatatuRatings } from "../services/ratingsService.js";
import { isFeatureEnabled } from "../utils/featureFlags.js";
import { FEATURE_FLAG_KEYS } from "../config/featureFlags.js";

export const createRatingHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const enabled = await isFeatureEnabled(FEATURE_FLAG_KEYS.RATINGS_V1, req.user._id);
    if (!enabled) {
      return res
        .status(404)
        .json({ success: false, message: "Ratings feature disabled" });
    }

    const body = req.body || {};

export const getMatatuRatingsHandler = async (req, res, next) => {
  try {
    const enabled = await isFeatureEnabled(FEATURE_FLAG_KEYS.RATINGS_V1, "ratings_read");

    if (!enabled) {
      return res
        .status(404)
        .json({ success: false, message: "Ratings feature disabled" });
    }

    const matatuId = req.params.id;
    const page = req.query?.page;
    const pageSize = req.query?.pageSize;

    const result = await getMatatuRatings({ matatuId, page, pageSize });

    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};
    const userIdFromToken = req.user._id.toString();

    const { matatuId, driverId, rating, comment } = body;

    const { rating: ratingDoc, summary } = await createRating({
      userId: userIdFromToken,
      matatuId,
      driverId,
      rating,
      comment
    });

    return res.status(201).json({
      success: true,
      data: {
        rating: ratingDoc,
        summary
      }
    });
  } catch (error) {
    return next(error);
  }
};
