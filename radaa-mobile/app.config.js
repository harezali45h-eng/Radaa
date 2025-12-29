import 'dotenv/config';

/**
 * Expo config with secure Google Maps Android API key wiring.
 * The actual key is loaded from process.env.GOOGLE_MAPS_ANDROID_KEY at build time
 * and is never hardcoded in this file or in the repository.
 */
export default ({ config }) => ({
  ...config,
  android: {
    ...(config.android || {}),
    config: {
      ...(config.android?.config || {}),
      googleMaps: {
        ...(config.android?.config?.googleMaps || {}),
        apiKey: process.env.GOOGLE_MAPS_ANDROID_KEY,
      },
    },
  },
});
