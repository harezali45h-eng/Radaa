import { isFeatureEnabled } from "../utils/featureFlags.js";
import { FEATURE_FLAG_KEYS } from "../config/featureFlags.js";

const buildFeatureMiddleware = (key, options = {}) => {
  const { disabledStatus = 404, disabledMessage = "Feature disabled" } = options;

  return async (req, res, next) => {
    try {
      const userId = req.user?._id ? req.user._id.toString() : null;
      const enabled = await isFeatureEnabled(key, userId);

      if (!enabled) {
        return res.status(disabledStatus).json({ success: false, message: disabledMessage });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

export const requireRoutesV1 = buildFeatureMiddleware(FEATURE_FLAG_KEYS.ROUTES_V1, {
  disabledStatus: 404,
  disabledMessage: "Routes feature disabled"
});

export { FEATURE_FLAG_KEYS };
