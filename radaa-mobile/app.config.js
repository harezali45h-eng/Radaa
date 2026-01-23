/**
 * @param {import('expo/config').ConfigContext} ctx
 * @returns {import('expo/config').ExpoConfig}
 */
export default ({ config }) => ({
  // Start from the base config (app.json), then layer on release settings.
  ...config,
  // Android versioning for Play Store upgrade to versionCode 11.
  version: '1.0.11',
  android: {
    ...config.android,
    versionCode: 11,
    config: {
      ...(config.android?.config || {}),
      googleMaps: {
        ...(config.android?.config?.googleMaps || {}),
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY,
      },
    },
  },
  // Runtime‑visible configuration, consumed via Constants.expoConfig.extra.
  extra: {
    ...(config.extra || {}),
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    socketUrl: process.env.EXPO_PUBLIC_SOCKET_URL,
    googleMapsAndroidKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY,
  },
});
