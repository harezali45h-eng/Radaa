import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { attachRealtimeHandlers } from "../controllers/realtimeController.js";
import { recordDriverLocationUpdate } from "../services/driverScoringService.js";
import {
  upsertPassengerPresence,
  deletePassengerPresence,
  listPassengerPresence,
} from "../services/paxPresenceService.js";

const isAllowedSocketOrigin = (origin) => {
  if (!origin) return true;

  try {
    const url = new URL(origin);
    const hostname = url.hostname || "";
    const port = url.port || "";

    if (hostname === "localhost" && (port === "3000" || port === "")) {
      return true;
    }

    if (hostname.endsWith(".vercel.app")) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

const socketCors = {
  origin: (origin, cb) => {
    if (isAllowedSocketOrigin(origin)) {
      return cb(null, true);
    }
    return cb(new Error("CORS blocked: " + origin));
  },
  credentials: true,
};

// In-memory maps for realtime state. These are intentionally process-local
// and non-persistent to keep behaviour additive and avoid schema changes.
//
// NOTE: Presence is explicitly separated from request / matching logic.
// These collections ONLY track who is online and their last known location,
// regardless of whether a ride request has been created or succeeded.
const driverStates = new Map(); // driverId -> "offline" | "available" | "en_route" | "busy"
const passengerPresence = new Map(); // passengerId -> { lat, lng, updatedAt }
const passengerLocations = new Map(); // passengerId -> { lat, lng }
const driverLocations = new Map(); // driverId -> { lat, lng, saccoId?, matatuId? }
const driverHitScores = new Map(); // driverId -> number
const passengerHitScores = new Map(); // passengerId -> number

const STAGES = [
  {
    id: "stage-sample-1",
    name: "Sample Stage",
    location: { lat: -1.2921, lng: 36.8219 }
  }
];

const toRad = (deg) => (deg * Math.PI) / 180;

const haversineMeters = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const setDriverState = (driverId, state) => {
  if (!driverId || typeof state !== "string") return;
  const allowed = ["offline", "available", "en_route", "busy"];
  if (!allowed.includes(state)) return;
  driverStates.set(driverId.toString(), state);
};

export const getDriverState = (driverId) => {
  if (!driverId) return "offline";
  return driverStates.get(driverId.toString()) || "offline";
};

export const incrementDriverHit = (driverId) => {
  if (!driverId) return 0;
  const key = driverId.toString();
  const next = (driverHitScores.get(key) || 0) + 1;
  driverHitScores.set(key, next);
  return next;
};

export const incrementPassengerHit = (passengerId) => {
  if (!passengerId) return 0;
  const key = passengerId.toString();
  const next = (passengerHitScores.get(key) || 0) + 1;
  passengerHitScores.set(key, next);
  return next;
};

export const emitDriverScoreUpdate = (io, driverId) => {
  if (!io || !driverId) return;
  const key = driverId.toString();
  const score = incrementDriverHit(key);
  const realtime = io.of("/realtime");
  realtime.to(`driver:${key}`).emit("score:update", {
    driverId: key,
    driverScore: score
  });
};

export const emitPassengerScoreUpdate = (io, passengerId) => {
  if (!io || !passengerId) return;
  const key = passengerId.toString();
  const score = incrementPassengerHit(key);
  const realtime = io.of("/realtime");
  realtime.to(`passenger:${key}`).emit("score:update", {
    passengerId: key,
    passengerScore: score
  });
};

export const getAvailableDrivers = () => {
  const ids = [];
  for (const [id, state] of driverStates.entries()) {
    if (state === "available") {
      ids.push(id);
    }
  }
  return ids;
};

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: socketCors,
    path: "/socket.io"
  });

  const realtime = io.of("/realtime");

  realtime.use((socket, next) => {
    try {
      const authToken = socket.handshake?.auth?.token;
      const header = socket.handshake?.headers?.authorization;
      let headerToken;

      if (header && typeof header === "string" && header.startsWith("Bearer ")) {
        headerToken = header.split(" ")[1];
      }

      const token = authToken || headerToken;

      if (!token) {
        return next(new Error("missing token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userId = decoded && (decoded.id || decoded.sub || decoded._id);
      const role = decoded.role ? String(decoded.role).trim().toLowerCase() : undefined;

      if (!userId || !role) {
        return next(new Error("invalid token payload"));
      }

      socket.user = {
        ...decoded,
        id: userId,
        sub: userId,
        role,
      };

      return next();
    } catch (err) {
      return next(new Error("invalid token"));
    }
  });

  realtime.on("connection", (socket) => {
    const userId = socket.user?.id || socket.user?._id || socket.user?.sub || "unknown";
    const role = socket.user?.role || "user";
    console.log(`Socket connected: ${userId}`);

    // Simple room conventions reused across events
    if (userId && role === "driver") {
      setDriverState(userId, "available");
      socket.join("drivers:nearby");
      socket.join(`driver:${userId}`);

      // eslint-disable-next-line no-console
      console.log(`[driver-live] driver online: ${userId}`);

      socket.on("driver:online", async () => {
        setDriverState(userId, "available");
        socket.join("drivers:nearby");
        // eslint-disable-next-line no-console
        console.log(`[driver-live] driver online: ${userId}`);
      });

      socket.on("driver:offline", async () => {
        setDriverState(userId, "offline");
        socket.leave("drivers:nearby");
        // eslint-disable-next-line no-console
        console.log(`[driver-live] driver offline: ${userId}`);
      });

      // When a driver connects, send a full snapshot of current pax
      // presence so the client can hydrate its local map state. This
      // is sourced from Redis when available, otherwise from the
      // in-memory fallback inside paxPresenceService.
      (async () => {
        try {
          const snapshot = await listPassengerPresence();
          socket.emit("pax:presence:snapshot", {
            entries: Array.isArray(snapshot) ? snapshot : [],
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("[presence] failed to send pax presence snapshot", error);
        }
      })();
    }
    if (userId && (role === "user" || role === "passenger")) {
      socket.join(`user:${userId}`);
      socket.join(`passenger:${userId}`);

      // Presence lifecycle for passengers (pax). This is deliberately
      // independent from request creation / matching.
      //
      // pax:online            – fired when the passenger opens the
      //                          dashboard/map. Marks them online and
      //                          broadcasts to drivers.
      // pax:location:update   – fired whenever their location changes.
      // pax:offline           – fired when they explicitly go offline
      //                          or close their map.

      socket.on("pax:online", async (payload = {}) => {
        try {
          const id = payload.passengerId || userId;
          const { lat, lng } = payload.location || payload;

          if (!id) return;

          const now = new Date().toISOString();

          if (
            typeof lat === "number" &&
            typeof lng === "number"
          ) {
            passengerPresence.set(id.toString(), { lat, lng, updatedAt: now });
            await upsertPassengerPresence(id, { lat, lng, updatedAt: now });
          } else {
            passengerPresence.set(id.toString(), { lat: null, lng: null, updatedAt: now });
            await upsertPassengerPresence(id, { lat: null, lng: null, updatedAt: now });
          }

          // This event is presence-only and must not depend on any
          // request / matching outcome.
          // eslint-disable-next-line no-console
          console.log("[presence] pax:online", {
            passengerId: id,
            hasLocation: typeof lat === "number" && typeof lng === "number",
          });

          realtime.emit("pax:online", {
            passengerId: id,
            location:
              typeof lat === "number" && typeof lng === "number"
                ? { lat, lng }
                : null,
            updatedAt: now,
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("[presence] pax:online error", error);
        }
      });

      socket.on("pax:location:update", async (payload = {}) => {
        try {
          const id = payload.passengerId || userId;
          const { lat, lng } = payload.location || payload;

          if (!id || typeof lat !== "number" || typeof lng !== "number") {
            return;
          }

          const now = new Date().toISOString();
          passengerPresence.set(id.toString(), { lat, lng, updatedAt: now });

          // Broadcast to drivers as a presence-only update. This should
          // never be gated on request lifecycle or matching success.
          realtime.emit("pax:location:update", {
            passengerId: id,
            location: { lat, lng },
            updatedAt: now,
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("[presence] pax:location:update error", error);
        }
      });

      socket.on("pax:offline", async (payload = {}) => {
        try {
          const id = payload.passengerId || userId;
          if (!id) return;

          const now = new Date().toISOString();
          passengerPresence.delete(id.toString());
          await deletePassengerPresence(id);

          // eslint-disable-next-line no-console
          console.log("[presence] pax:offline", { passengerId: id });

          realtime.emit("pax:offline", {
            passengerId: id,
            updatedAt: now,
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("[presence] pax:offline error", error);
        }
      });
    }

    attachRealtimeHandlers(socket, io, {
      setDriverState,
      getAvailableDrivers
    });

    // Legacy live passenger position stream (request-aware). This is
    // intentionally **separate** from pax presence events above.
    // Request failures MUST NOT affect presence visibility.
    socket.on("passenger:update_location", (payload = {}) => {
      try {
        const id = payload.passengerId || userId;
        const { lat, lng, requestId } = payload;

        if (typeof lat !== "number" || typeof lng !== "number" || !id) {
          return;
        }

        passengerLocations.set(id.toString(), { lat, lng, requestId: requestId || null });

        realtime.to(`passenger:${id}`).emit("passenger:live_update", {
          passengerId: id,
          lat,
          lng,
          requestId: requestId || null
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("[socket] passenger:update_location error", error);
      }
    });

    socket.on("score:driver_hit", (payload = {}) => {
      try {
        const id = payload.driverId || userId;
        if (!id) return;
        const score = incrementDriverHit(id.toString());
        realtime.to(`driver:${id}`).emit("score:update", {
          driverId: id,
          driverScore: score
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("[socket] score:driver_hit error", error);
      }
    });

    socket.on("score:passenger_hit", (payload = {}) => {
      try {
        const id = payload.passengerId || userId;
        if (!id) return;
        const score = incrementPassengerHit(id.toString());
        realtime.to(`passenger:${id}`).emit("score:update", {
          passengerId: id,
          passengerScore: score
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("[socket] score:passenger_hit error", error);
      }
    });

    // Live matatu / driver tracking stream
    socket.on("driver:update_location", (payload = {}) => {
      try {
        const id = payload.driverId || userId;
        const { lat, lng, saccoId, matatuId } = payload;

        if (typeof lat !== "number" || typeof lng !== "number" || !id) {
          return;
        }

        driverLocations.set(id.toString(), {
          lat,
          lng,
          saccoId: saccoId || null,
          matatuId: matatuId || null
        });

        const matatuRoom = matatuId ? `matatu:${matatuId}` : undefined;

        const entityId = matatuId || id;

        const updatedAt = payload.updatedAt || new Date().toISOString();

        recordDriverLocationUpdate({
          driverId: id,
          lat,
          lng,
          timestamp: updatedAt,
        });

        const updatePayload = {
          id: entityId ? entityId.toString() : undefined,
          location: { lat, lng },
          driverId: id,
          lat,
          lng,
          saccoId: saccoId || null,
          matatuId: matatuId || null,
          updatedAt
        };

        // Broadcast in a generic shape that frontend map/realtime contexts can merge by id
        realtime.emit("matatu:live_update", updatePayload);
        realtime.emit("matatus:live_update", updatePayload);

        // Dedicated stream for live drivers. This is additive and mirrors the
        // matatu payload so passenger maps can subscribe explicitly.
        realtime.emit("drivers_live", updatePayload);

        // eslint-disable-next-line no-console
        console.log("[driver-live] location update sent", updatePayload);
        if (matatuRoom) {
          realtime.to(matatuRoom).emit("matatu:live_update", updatePayload);
        }
        if (saccoId) {
          realtime.to(`sacco:${saccoId}`).emit("matatu:live_update", updatePayload);
        }

        for (const stage of STAGES) {
          const distance = haversineMeters(lat, lng, stage.location.lat, stage.location.lng);
          if (Number.isFinite(distance) && distance <= 600) {
            realtime.emit("matatu:approaching_stage", {
              driverId: id,
              matatuId: matatuId || null,
              saccoId: saccoId || null,
              stageId: stage.id,
              stageName: stage.name,
              stageLocation: stage.location,
              distanceMeters: distance
            });
            break;
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("[socket] driver:update_location error", error);
      }
    });

    socket.on("disconnect", async () => {
      const disconnectedUserId =
        socket.user?.id || socket.user?._id || socket.user?.sub || "unknown";
      console.log(`Socket disconnected: ${disconnectedUserId}`);
      if (disconnectedUserId && role === "driver") {
        setDriverState(disconnectedUserId, "offline");
        // eslint-disable-next-line no-console
        console.log(`[driver-live] driver offline: ${disconnectedUserId}`);
      }

      if (disconnectedUserId && (role === "user" || role === "passenger")) {
        try {
          passengerPresence.delete(disconnectedUserId.toString());
          await deletePassengerPresence(disconnectedUserId);

          realtime.emit("pax:offline", {
            passengerId: disconnectedUserId,
            updatedAt: new Date().toISOString(),
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("[presence] disconnect pax:offline error", error);
        }
      }
    });
  });

  return io;
};
