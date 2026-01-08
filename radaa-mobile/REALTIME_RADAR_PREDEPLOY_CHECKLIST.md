# Radaa Realtime Radar  Mobile Pre-Deploy Checklist

This checklist is **documentation only** for the realtime radar feature. It does not change runtime behavior.

---

## 1. Environment variables (Expo / mobile)

- **EXPO_PUBLIC_API_BASE_URL**
  - [ ] Points to the correct backend API environment (staging / production).
  - [ ] Uses `https` in production.
  - [ ] Has no trailing slash beyond the base path (e.g. `https://api.example.com` not `https://api.example.com/`).

- **EXPO_PUBLIC_SOCKET_URL**
  - [ ] Points to the same backend origin that serves Socket.IO (no `/realtime` suffix).
  - [ ] Uses `https` and `wss`-compatible endpoints in production.
  - [ ] Matches the environment used by `EXPO_PUBLIC_API_BASE_URL`.

- Mobile build sanity
  - [ ] `expo-location` installed via `expo install expo-location`.
  - [ ] `socket.io-client` installed with a version compatible with the current Expo SDK.

---

## 2. Backend presence storage (reference only)

These checks are **backend-facing** but listed here so mobile deploys are not cut without a healthy presence pipeline.

- Upstash Redis / presence store
  - [ ] `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` configured in the backend environment.
  - [ ] Presence service can **write** and **read** passenger presence entries.
  - [ ] A sample passenger going online results in entries visible in the presence store.

- Presence lifecycle
  - [ ] `pax:online`, `pax:location:update`, and `pax:offline` events are flowing in logs.
  - [ ] Driver receives a `pax:presence:snapshot` on connect with at least one known passenger.
  - [ ] Driver keeps seeing passengers through request failures (presence is decoupled from rides).

---

## 3. Cloudinary / matatu photos (reference only)

- Cloudinary configuration (backend)
  - [ ] Cloudinary credentials are configured in the backend for the target environment.
  - [ ] `Matatu` photos can be uploaded and retrieved via existing admin / tools.

- Mobile matatu gallery
  - [ ] Tapping a matatu marker opens the gallery modal.
  - [ ] At least one matatu in the environment has approved photos.
  - [ ] Empty or error states show safe fallback UI and do **not** crash the app.

---

## 4. Expo / device sanity checks

- Permissions
  - [ ] Foreground location permission prompt appears the first time the passenger map is opened.
  - [ ] Denying permission still leaves the map screen usable (no crashes).

- Realtime radar behavior
  - [ ] On a **passenger device**, opening the map emits presence and the backend shows the passenger as online.
  - [ ] On a **driver device**, opening the map shows the passenger marker without requiring a ride request.
  - [ ] Killing and reopening the passenger app re-establishes presence correctly.

- Performance
  - [ ] Passenger location updates appear smooth on the driver map without flooding the backend.
  - [ ] Moving a passenger slowly does **not** spam `pax:location:update` thanks to time+distance throttling.

---

## 5. Safety / rollback

- [ ] A feature flag or safe rollout mechanism exists on the backend (if needed) to disable realtime radar without redeploying the mobile app.
- [ ] Monitoring / logs are in place for Socket.IO connection rates and presence event volume.
- [ ] A simple rollback path is documented (e.g., which backend commit or configuration disables the feature).
