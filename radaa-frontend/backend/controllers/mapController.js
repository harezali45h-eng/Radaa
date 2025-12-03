import Matatu from "../models/Matatu.js";
import Route from "../models/Route.js";
import { getRatingSummariesForMatatus } from "../services/ratingsService.js";
import { isFeatureEnabled } from "../utils/featureFlags.js";
import { FEATURE_FLAG_KEYS } from "../config/featureFlags.js";

export const getMapMarkers = async (req, res, next) => {
  try {
    const enabled = await isFeatureEnabled(FEATURE_FLAG_KEYS.GLOBAL_MAP_V1, "global_map");

    if (!enabled) {
      return res
        .status(404)
        .json({ success: false, message: "Global map feature disabled" });
    }

    const matatus = await Matatu.find({ isOnline: true }).lean();

    const ids = matatus.map((m) => m._id.toString());
    const ratingMap = await getRatingSummariesForMatatus(ids);

    const markers = matatus.map((m) => {
      const mainApprovedPhoto = Array.isArray(m.photos)
        ? m.photos.find((p) => p && p.status === "approved")
        : null;

      const rating = ratingMap[m._id.toString()] || { avgRating: 0, count: 0 };

      const lat = m.location?.lat ?? null;
      const lng = m.location?.lng ?? null;

      return {
        id: m._id,
        plate: m.plate,
        route: m.route,
        driverName: m.driverName || null,
        driverPhone: m.driverPhone || null,
        sacco: m.sacco || null,
        location: lat != null && lng != null ? { lat, lng } : null,
        mainPhotoUrl: mainApprovedPhoto ? mainApprovedPhoto.url : null,
        rating
      };
    });

    return res.json({ success: true, data: markers });
  } catch (error) {
    return next(error);
  }
};

export const getRoutePolyline = async (req, res, next) => {
  try {
    const { routeId } = req.params;

    const route = await Route.findById(routeId).lean();

    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }

    return res.json({
      success: true,
      data: {
        id: route._id,
        name: route.name,
        polyline: route.polyline
      }
    });
  } catch (error) {
    return next(error);
  }
};
