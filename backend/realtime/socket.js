import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const DEV_FRONTEND_URL = process.env.DEV_FRONTEND_URL || "http://localhost:3000";
const PROD_FRONTEND_URL =
  process.env.PROD_FRONTEND_URL ||
  "https://radaa.vercel.app";
const RAW_CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "";

const baseOrigins = [
  PROD_FRONTEND_URL,
  ...RAW_CLIENT_ORIGIN.split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
];

const devOrigins =
  process.env.NODE_ENV !== "production"
    ? [DEV_FRONTEND_URL]
    : [];

const allowedOrigins = Array.from(new Set([...baseOrigins, ...devOrigins]));

const socketCors = {
  origin: allowedOrigins,
  credentials: true
};

// In-memory maps for realtime state. These are intentionally process-local
// and non-persistent to keep behaviour additive and avoid schema changes.
const driverStates = new Map(); // driverId -> "offline" | "available" | "en_route" | "busy"
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
      const token = socket.handshake?.auth?.token;

      if (!token) {
        return next(new Error("Authentication error: missing token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      return next();
    } catch (err) {
      return next(new Error("Authentication error: invalid token"));
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
      socket.on("driver:online", () => {
        setDriverState(userId, "available");
        socket.join("drivers:nearby");
      });

      socket.on("driver:offline", () => {
        setDriverState(userId, "offline");
        socket.leave("drivers:nearby");
      });
    }
    if (userId && (role === "user" || role === "passenger")) {
      socket.join(`user:${userId}`);
      socket.join(`passenger:${userId}`);
    }

    // Live passenger position stream
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

        const updatePayload = {
          id: entityId ? entityId.toString() : undefined,
          location: { lat, lng },
          driverId: id,
          lat,
          lng,
          saccoId: saccoId || null,
          matatuId: matatuId || null
        };

        // Broadcast in a generic shape that frontend map/realtime contexts can merge by id
        realtime.emit("matatu:live_update", updatePayload);
        realtime.emit("matatus:live_update", updatePayload);
        // eslint-disable-next-line no-console
        console.log("[socket] driver:update_location broadcast", updatePayload);
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

    socket.on("disconnect", () => {
      const disconnectedUserId =
        socket.user?.id || socket.user?._id || socket.user?.sub || "unknown";
      console.log(`Socket disconnected: ${disconnectedUserId}`);
      if (disconnectedUserId && role === "driver") {
        setDriverState(disconnectedUserId, "offline");
      }
    });
  });

  return io;
};
