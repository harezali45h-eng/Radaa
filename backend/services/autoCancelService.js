import BookingWaiting from "../models/BookingWaiting.js";
import { cancelRequest, getRequestById } from "./requestsService.js";
import { logAutoCancel } from "./auditService.js";

const toMeters = (degLat1, degLng1, degLat2, degLng2) => {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(degLat2 - degLat1);
  const dLng = toRad(degLng2 - degLng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(degLat1)) * Math.cos(toRad(degLat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

let CONFIG = {
  distanceMeters: Number(process.env.AUTO_CANCEL_DISTANCE_METERS || 300),
  warningMs: Number(process.env.AUTO_CANCEL_WARNING_MS || 45000),
  graceMs: Number(process.env.AUTO_CANCEL_GRACE_MS || 30000)
};

export const __setAutoCancelConfigForTests = (overrides = {}) => {
  CONFIG = {
    ...CONFIG,
    ...overrides
  };
};

const stateByRequestId = new Map();

const getOrCreateState = (requestId) => {
  let state = stateByRequestId.get(requestId);
  if (!state) {
    state = {
      outOfZoneStart: null,
      warningSent: false,
      cancelled: false,
      locked: false
    };
    stateByRequestId.set(requestId, state);
  }
  return state;
};

export const registerWaitingBooking = async ({ requestId, userId, pickupPoint }) => {
  if (!requestId || !userId || !pickupPoint) {
    return null;
  }

  const pickupLocation = {
    type: "Point",
    coordinates: [pickupPoint.lng, pickupPoint.lat]
  };

  const now = new Date();

  await BookingWaiting.updateOne(
    { requestId },
    {
      $set: {
        requestId,
        userId,
        pickupLocation,
        locked: false
      },
      $setOnInsert: {
        createdAt: now
      }
    },
    { upsert: true }
  );

  const state = getOrCreateState(requestId);
  state.locked = false;
  state.outOfZoneStart = null;
  state.warningSent = false;
  state.cancelled = false;

  return true;
};

export const lockBooking = async ({ requestId, userId, locked }) => {
  if (!requestId || !userId) {
    return null;
  }

  const doc = await BookingWaiting.findOneAndUpdate(
    { requestId, userId },
    { $set: { locked: Boolean(locked) } },
    { new: true }
  );

  if (!doc) {
    return null;
  }

  const state = getOrCreateState(requestId);
  state.locked = Boolean(doc.locked);

  return doc;
};

export const handlePassengerPing = async ({ requestId, userId, location, app }) => {
  if (!requestId || !location || typeof location.lat !== "number" || typeof location.lng !== "number") {
    return;
  }

  const request = await getRequestById(requestId);

  if (!request || request.status !== "pending") {
    return;
  }

  const booking = await BookingWaiting.findOne({ requestId }).lean();

  if (!booking || !booking.pickupLocation || !Array.isArray(booking.pickupLocation.coordinates)) {
    return;
  }

  const [pickupLng, pickupLat] = booking.pickupLocation.coordinates;

  const distance = toMeters(location.lat, location.lng, pickupLat, pickupLng);

  if (!Number.isFinite(distance)) {
    return;
  }

  const state = getOrCreateState(requestId);
  const now = Date.now();

  state.locked = Boolean(booking.locked);

  if (state.cancelled) {
    return;
  }

  if (state.locked) {
    state.outOfZoneStart = null;
    state.warningSent = false;
    return;
  }

  if (distance <= CONFIG.distanceMeters) {
    state.outOfZoneStart = null;
    state.warningSent = false;
    return;
  }

  if (!state.outOfZoneStart) {
    state.outOfZoneStart = now;
  }

  const elapsed = now - state.outOfZoneStart;

  const io = app && typeof app.get === "function" ? app.get("io") : null;
  const realtime = io ? io.of("/realtime") : null;

  if (elapsed >= CONFIG.warningMs && !state.warningSent) {
    if (realtime) {
      realtime.emit("ride:auto_cancel_warning", {
        requestId,
        userId: booking.userId ? booking.userId.toString() : userId || null
      });
    }

    const autoCancelAt = new Date(now + CONFIG.graceMs);
    await BookingWaiting.updateOne({ _id: booking._id }, { $set: { autoCancelAt } });

    state.warningSent = true;
  }

  if (elapsed >= CONFIG.warningMs + CONFIG.graceMs && !state.cancelled) {
    state.cancelled = true;

    const reason = "auto_cancelled_drift";

    await cancelRequest(requestId, reason);

    const autoCancelAt = new Date();

    await BookingWaiting.updateOne(
      { _id: booking._id },
      { $set: { autoCancelReason: reason, autoCancelAt } }
    );

    await logAutoCancel({
      requestId,
      userId: booking.userId,
      reason,
      autoCancelAt,
      meta: {
        distance
      }
    });

    if (realtime) {
      realtime.emit("ride:auto_cancelled", {
        requestId,
        userId: booking.userId ? booking.userId.toString() : userId || null,
        reason
      });
    }

    stateByRequestId.delete(requestId);
  }
};
