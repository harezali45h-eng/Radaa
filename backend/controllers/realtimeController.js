import { enqueueRequest } from "../services/requestQueueService.js";
import { assignRequest, onDriverAccept, onDriverReject } from "../services/assignmentEngine.js";
import { ValidationError } from "../utils/errors.js";
import { isValidLatLng, normalizeLatLng } from "../utils/geo.js";
import { isFeatureEnabled } from "../utils/featureFlags.js";
import { FEATURE_FLAG_KEYS } from "../config/featureFlags.js";

const toIdString = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value.toString === "function") return value.toString();
  return null;
};

const getSocketUserMeta = (socket) => {
  const raw = socket.user || {};
  const userId = raw.id || raw._id || raw.sub || null;
  const role = raw.role || "user";
  return {
    userId: userId ? userId.toString() : null,
    role,
  };
};

const buildPickupFromPayload = (payload) => {
  const pickup = payload && (payload.pickup || payload.location || null);

  const normalized = normalizeLatLng(pickup);
  if (!normalized || !isValidLatLng(normalized)) {
    throw new ValidationError("pickup with valid lat and lng is required");
  }

  return normalized;
};

export const attachRealtimeHandlers = (socket, io, helpers = {}) => {
  const { userId, role } = getSocketUserMeta(socket);
  const userKey = toIdString(userId);

  socket.on("driver:availability", (payload = {}) => {
    try {
      if (!userKey || role !== "driver") return;

      const available =
        payload.available !== false && payload.state !== "offline";
      const nextState = payload.state || (available ? "available" : "offline");

      if (typeof helpers.setDriverState === "function") {
        helpers.setDriverState(userKey, nextState);
      }

      if (available) {
        socket.join("drivers:nearby");
      } else {
        socket.leave("drivers:nearby");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[realtimeController] driver:availability error", error);
    }
  });

  socket.on("passenger:request:create", async (payload = {}, callback) => {
    try {
      if (!userKey) {
        throw new ValidationError("authentication required for requests");
      }

      const enabled = await isFeatureEnabled(
        FEATURE_FLAG_KEYS.DRIVER_REQUESTS_V1,
        userKey,
      );

      if (!enabled) {
        throw new ValidationError("Requests feature is disabled");
      }

      const pickup = buildPickupFromPayload(payload);
      const destination = normalizeLatLng(payload.destination || null) || undefined;

      const fare =
        payload.fare != null && Number.isFinite(Number(payload.fare))
          ? Number(payload.fare)
          : 0;

      const paymentMethod =
        typeof payload.paymentMethod === "string" && payload.paymentMethod.length > 0
          ? payload.paymentMethod
          : "cash";

      const meta =
        payload.meta && typeof payload.meta === "object" ? payload.meta : {};

      const requestDoc = await enqueueRequest({
        userId: userKey,
        pickup,
        destination,
        fare,
        paymentMethod,
        policy: payload.policy,
        meta,
      });

      const ioInstance = io;
      const availableDrivers =
        typeof helpers.getAvailableDrivers === "function"
          ? helpers.getAvailableDrivers()
          : [];

      const assignmentCtx = await assignRequest({
        requestId: requestDoc._id.toString(),
        io: ioInstance,
        activeDriverIds: availableDrivers,
      });

      let pickupCandidates;

      if (assignmentCtx && Array.isArray(assignmentCtx.candidates)) {
        pickupCandidates = assignmentCtx.candidates.map((candidate) => ({
          driverId: candidate.driverId,
          matatuId: candidate.matatuId,
          saccoId: candidate.saccoId,
          distanceMeters: candidate.distanceMeters,
          pickupLikelihood: candidate.pickupLikelihood || null,
        }));
      }

      const realtime = ioInstance.of("/realtime");
      realtime.to("drivers:nearby").emit("ride:created", {
        id: requestDoc._id.toString(),
        pickup: requestDoc.pickup,
        destination: requestDoc.destination || null,
        meta: requestDoc.meta || {},
      });

      const response = {
        success: true,
        requestId: requestDoc._id.toString(),
        status: requestDoc.status,
      };

      if (pickupCandidates && pickupCandidates.length > 0) {
        response.pickupCandidates = pickupCandidates;
      }

      if (typeof callback === "function") {
        callback(response);
      } else {
        socket.emit("passenger:request:created", response);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[realtimeController] passenger:request:create error", error);

      const message = error?.message || "Failed to create request";

      if (typeof callback === "function") {
        callback({ success: false, error: message });
      } else {
        socket.emit("passenger:request:error", { message });
      }
    }
  });

  socket.on("request:accept", async (payload = {}, callback) => {
    try {
      if (!userKey || role !== "driver") {
        throw new ValidationError("Driver authentication required to accept");
      }

      const requestId = toIdString(payload.requestId);
      if (!requestId) {
        throw new ValidationError("requestId is required");
      }

      const updated = await onDriverAccept({
        requestId,
        driverId: userKey,
        io,
      });

      const response = {
        success: true,
        requestId,
        status: updated ? updated.status : "accepted",
      };

      if (typeof callback === "function") {
        callback(response);
      } else {
        socket.emit("request:accept:result", response);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[realtimeController] request:accept error", error);

      const message = error?.message || "Failed to accept request";

      if (typeof callback === "function") {
        callback({ success: false, error: message });
      } else {
        socket.emit("request:accept:result", {
          success: false,
          error: message,
        });
      }
    }
  });

  socket.on("request:reject", async (payload = {}, callback) => {
    try {
      if (!userKey || role !== "driver") {
        throw new ValidationError("Driver authentication required to reject");
      }

      const requestId = toIdString(payload.requestId);
      if (!requestId) {
        throw new ValidationError("requestId is required");
      }

      await onDriverReject({
        requestId,
        driverId: userKey,
        io,
      });

      const response = {
        success: true,
        requestId,
      };

      if (typeof callback === "function") {
        callback(response);
      } else {
        socket.emit("request:reject:result", response);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[realtimeController] request:reject error", error);

      const message = error?.message || "Failed to reject request";

      if (typeof callback === "function") {
        callback({ success: false, error: message });
      } else {
        socket.emit("request:reject:result", {
          success: false,
          error: message,
        });
      }
    }
  });
};
