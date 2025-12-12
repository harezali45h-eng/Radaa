export const FEATURE_FLAG_KEYS = {
  ROUTES_V1: "ROUTES_V1",
  DRIVER_REQUESTS_V1: "DRIVER_REQUESTS_V1",
  AUTO_CANCEL_V1: "AUTO_CANCEL_V1",
  DRIVER_SIGNUP_V1: "driver_signup_v1",
  SACCO_ADMIN_V1: "sacco_admin_v1",
  MATATU_PHOTOS_V1: "matatu_photos_v1",
  GLOBAL_MAP_V1: "global_map_v1",
  RATINGS_V1: "ratings_v1",
  UI_REVAMP_V1: "ui_revamp_v1",
  MAP_PHOTOS_V1: "map_photos_v1",
  TRIP_UI_V1: "trip_ui_v1",
  DRIVER_ONBOARD_V1: "driver_onboard_v1",
  SACCO_ONBOARD_V1: "sacco_onboard_v1",
  NEW_THEME_V1: "ff_new_theme",
  SIMPLIFIED_NAV_V1: "ff_simplified_nav",
  SWIPE_MATATUS_V1: "ff_swipe_matatus",
  LIVE_ONLY_MAP_V1: "ff_live_only_map",
  FARE_SUGGESTIONS_V1: "ff_fare_suggestions",
  PAYMENT_CONFIRM_V1: "ff_payment_confirm"
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
  },
  [FEATURE_FLAG_KEYS.UI_REVAMP_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_UI_REVAMP_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.MAP_PHOTOS_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_MAP_PHOTOS_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.TRIP_UI_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_TRIP_UI_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.DRIVER_ONBOARD_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_DRIVER_ONBOARD_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.SACCO_ONBOARD_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_SACCO_ONBOARD_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.NEW_THEME_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_NEW_THEME_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.SIMPLIFIED_NAV_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_SIMPLIFIED_NAV_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.SWIPE_MATATUS_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_SWIPE_MATATUS_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.LIVE_ONLY_MAP_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_LIVE_ONLY_MAP_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.FARE_SUGGESTIONS_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_FARE_SUGGESTIONS_V1),
    rolloutPercent: 0
  },
  [FEATURE_FLAG_KEYS.PAYMENT_CONFIRM_V1]: {
    enabled: parseBoolEnv(process.env.FEATURE_FALLBACK_PAYMENT_CONFIRM_V1),
    rolloutPercent: 0
  }
};
