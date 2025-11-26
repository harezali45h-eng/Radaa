export const FEATURE_FLAG_KEYS = {
  ROUTES_V1: "ROUTES_V1",
  DRIVER_REQUESTS_V1: "DRIVER_REQUESTS_V1",
  AUTO_CANCEL_V1: "AUTO_CANCEL_V1",
  DRIVER_SIGNUP_V1: "driver_signup_v1",
  SACCO_ADMIN_V1: "sacco_admin_v1",
  MATATU_PHOTOS_V1: "matatu_photos_v1",
  GLOBAL_MAP_V1: "global_map_v1",
  RATINGS_V1: "ratings_v1"
};

const parseBoolEnv = (value) => {
  if (!value) return false;
  const normalized = String(value).trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
};

export const featureFlagDefaults = {
  [FEATURE_FLAG_KEYS.ROUTES_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_ROUTES_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.DRIVER_REQUESTS_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_DRIVER_REQUESTS_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.AUTO_CANCEL_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_AUTO_CANCEL_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.DRIVER_SIGNUP_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_DRIVER_SIGNUP_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.SACCO_ADMIN_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_SACCO_ADMIN_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.MATATU_PHOTOS_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_MATATU_PHOTOS_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.GLOBAL_MAP_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_GLOBAL_MAP_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.RATINGS_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_RATINGS_V1),
    rolloutPercent: 0
  }
};
