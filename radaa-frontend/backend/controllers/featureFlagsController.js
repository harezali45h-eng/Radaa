import { getAllFeatureFlagStates } from "../utils/featureFlags.js";

export const listFeatureFlags = async (req, res, next) => {
  try {
    const flags = await getAllFeatureFlagStates();

    return res.json({ success: true, data: flags });
  } catch (error) {
    if (error?.statusCode) {
      res.status(error.statusCode);
    }
    return next(error);
  }
};
