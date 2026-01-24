/**
 * @param {import('expo/config').ConfigContext} ctx
 * @returns {import('expo/config').ExpoConfig}
 */
export default ({ config }) => {
  const {
    EXPO_PUBLIC_API_BASE_URL,
    EXPO_PUBLIC_SOCKET_URL,
    EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY,
  } = process.env;

  if (
    !EXPO_PUBLIC_API_BASE_URL ||
    !EXPO_PUBLIC_SOCKET_URL ||
    !EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY
  ) {
    throw new Error(
      'EXPO_PUBLIC_API_BASE_URL, EXPO_PUBLIC_SOCKET_URL, and EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY must be set before building the app.',
    );
  }

  return {
    // Start from the base config (app.json), then layer on release settings.
    ...config,
    // Android versioning for Play Store upgrade to versionCode 13.
    version: '1.0.13',
    android: {
      ...config.android,
      versionCode: 13,
      config: {
        ...(config.android?.config || {}),
        googleMaps: {
          ...(config.android?.config?.googleMaps || {}),
          apiKey: EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY,
        },
      },
    },
    // Runtime‑visible configuration, consumed via Constants.expoConfig.extra.
    extra: {
      ...(config.extra || {}),
      apiBaseUrl: EXPO_PUBLIC_API_BASE_URL,
      socketUrl: EXPO_PUBLIC_SOCKET_URL,
      googleMapsAndroidKey: EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY,
    },
  };
};
