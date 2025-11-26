import { ValidationError, AuthError } from "../utils/errors.js";
import { createRequest, getRequestsNear, acceptRequest, cancelRequest } from "../services/requestsService.js";
import { isFeatureEnabled } from "../utils/featureFlags.js";
import { FEATURE_FLAG_KEYS } from "../config/featureFlags.js";
import { registerWaitingBooking, handlePassengerPing, lockBooking } from "../services/autoCancelService.js";
import { assignNearestMatatu } from "../utils/assignNearestMatatu.js";
import { getAvailableDrivers, setDriverState } from "../realtime/socket.js";

const sanitizeMeta = (meta) => {
  if (!meta || typeof meta !== "object") return {};

  const allowed = ["note", "routeName", "tags", "estimatedFare", "vehicleType"];
  const safe = {};

  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(meta, key)) {
      safe[key] = meta[key];
    }
  }

  return safe;
};

const ensureDriver = (user) => {
  if (!user || (user.role !== "driver" && user.role !== "admin")) {
    throw new AuthError("Driver access required", 403);
  }
};

const lastRequestByUser = new Map();
const REQUEST_COOLDOWN_MS = 20000;

export const createEphemeralRequest = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthError("Not authorized", 401);
    }

    const enabled = await isFeatureEnabled(FEATURE_FLAG_KEYS.DRIVER_REQUESTS_V1, req.user._id);
    if (!enabled) {
      return res.status(404).json({ success: false, message: "Requests feature disabled" });
    }

    const now = Date.now();
    const key = req.user._id.toString();
    const last = lastRequestByUser.get(key) || 0;

    if (now - last < REQUEST_COOLDOWN_MS) {
      const remainingMs = REQUEST_COOLDOWN_MS - (now - last);
      const retryAfterSeconds = Math.max(1, Math.ceil(remainingMs / 1000));

      return res.status(429).json({
        success: false,
        message: "Too many ride requests. Please wait a few seconds before trying again.",
        code: "TOO_MANY_REQUESTS",
        reason: "too_many_requests",
        retryAfterSeconds
      });
    }

    lastRequestByUser.set(key, now);

    const { pickup, partySize, meta } = req.body || {};

    if (!pickup || typeof pickup.lat !== "number" || typeof pickup.lng !== "number") {
      throw new ValidationError("pickup with lat and lng is required");
    }

    const safeMeta = sanitizeMeta(meta);

    const summary = await createRequest({
      userId: req.user._id.toString(),
      pickupPoint: { lat: pickup.lat, lng: pickup.lng },
      partySize: partySize || 1,
      createdAt: new Date(),
      meta: safeMeta
    });

    const autoCancelEnabled = await isFeatureEnabled(
      FEATURE_FLAG_KEYS.AUTO_CANCEL_V1,
      req.user._id
    );

    if (autoCancelEnabled) {
      await registerWaitingBooking({
        requestId: summary.id,
        userId: req.user._id,
        pickupPoint: { lat: pickup.lat, lng: pickup.lng }
      });
    }

    let nearestMatatu = null;
    const activeDrivers = getAvailableDrivers();
    if (Array.isArray(activeDrivers) && activeDrivers.length > 0) {
      nearestMatatu = await assignNearestMatatu({
        passengerLocation: { lat: pickup.lat, lng: pickup.lng },
        activeDrivers
      });
    }

    const responseData = nearestMatatu ? { ...summary, nearestMatatu } : summary;

    const io = req.app.get("io");
    if (io && summary && summary.pickupPoint) {
      const payload = {
        id: summary.id,
        pickup: summary.pickupPoint,
        partySize: summary.partySize,
        meta: summary.meta,
        nearestMatatu
      };

      const realtime = io.of("/realtime");
      realtime.to("drivers:nearby").emit("ride:created", payload);
    }

    res.status(201).json({ success: true, data: responseData });
  } catch (error) {
    next(error);
  }
};

export const getNearbyEphemeralRequests = async (req, res, next) => {
  try {
    ensureDriver(req.user);

    const enabled = await isFeatureEnabled(FEATURE_FLAG_KEYS.DRIVER_REQUESTS_V1, req.user._id);
    if (!enabled) {
      return res.status(404).json({ success: false, message: "Requests feature disabled" });
    }

    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radius = Number(req.query.radius || 2000);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      throw new ValidationError("lat and lng query parameters are required and must be numbers");
    }

    const list = await getRequestsNear({ lat, lng }, radius);

    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

export const acceptEphemeralRequest = async (req, res, next) => {
  try {
    ensureDriver(req.user);

    const enabled = await isFeatureEnabled(FEATURE_FLAG_KEYS.DRIVER_REQUESTS_V1, req.user._id);
    if (!enabled) {
      return res.status(404).json({ success: false, message: "Requests feature disabled" });
    }

    const { id } = req.params;

    const { acceptToken, request } = await acceptRequest(id, req.user._id.toString());

    setDriverState(req.user._id.toString(), "en_route");

    const io = req.app.get("io");
    if (io && request && request.pickupPoint) {
      const payload = {
        id: request.id,
        pickup: request.pickupPoint,
        partySize: request.partySize,
        meta: request.meta
      };

      const realtime = io.of("/realtime");
      realtime.emit("ride:accepted", payload);
    }

    res.json({ success: true, data: { acceptToken } });
  } catch (error) {
    next(error);
  }
};

export const cancelEphemeralRequest = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthError("Not authorized", 401);
    }

    const enabled = await isFeatureEnabled(FEATURE_FLAG_KEYS.DRIVER_REQUESTS_V1, req.user._id);
    if (!enabled) {
      return res.status(404).json({ success: false, message: "Requests feature disabled" });
    }

    const { id } = req.params;
    const { reason } = req.body || {};

    const result = await cancelRequest(id, reason || "cancelled");

    if (!result) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    const io = req.app.get("io");
    if (io) {
      const payload = {
        id: result.id,
        reason: result.cancelledReason || "cancelled"
      };

      const realtime = io.of("/realtime");
      realtime.emit("ride:cancelled", payload);
    }

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const lockRequest = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthError("Not authorized", 401);
    }

    const enabled = await isFeatureEnabled(FEATURE_FLAG_KEYS.AUTO_CANCEL_V1, req.user._id);
    if (!enabled) {
      return res.status(404).json({ success: false, message: "Auto-cancel feature disabled" });
    }

    const { id } = req.params;
    const locked = req.body && Object.prototype.hasOwnProperty.call(req.body, "locked")
      ? Boolean(req.body.locked)
      : true;

    const booking = await lockBooking({
      requestId: id,
      userId: req.user._id,
      locked
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    return res.json({
      success: true,
      data: {
        locked: booking.locked
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const pingPassengerLocation = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthError("Not authorized", 401);
    }

    const enabled = await isFeatureEnabled(FEATURE_FLAG_KEYS.AUTO_CANCEL_V1, req.user._id);
    if (!enabled) {
      return res.status(404).json({ success: false, message: "Auto-cancel feature disabled" });
    }

    const { id } = req.params;

    const body = req.body || {};
    const location = body.location || body;

    const lat = Number(location.lat);
    const lng = Number(location.lng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      throw new ValidationError(
        "location.lat and location.lng are required and must be numbers"
      );
    }

    await handlePassengerPing({
      requestId: id,
      userId: req.user._id.toString(),
      location: { lat, lng },
      app: req.app
    });

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};
