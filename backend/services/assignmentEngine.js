import Request from "../models/Request.js";
import Matatu from "../models/Matatu.js";
import AuditLog from "../models/AuditLog.js";
import { ValidationError } from "../utils/errors.js";
import { haversineMeters, isValidLatLng } from "../utils/geo.js";
import { findNearestStageOrCorridor } from "../services/stageProximityService.js";
import {
  scoreAndSortCandidatesForPickup,
  recordDriverAssignmentEvent,
} from "../services/driverScoringService.js";

const DEFAULT_MAX_ATTEMPTS = Number(process.env.REQUEST_ASSIGN_MAX_ATTEMPTS || 3);
const DEFAULT_ATTEMPT_TIMEOUT_MS = Number(process.env.REQUEST_ASSIGN_TIMEOUT_MS || 8000);
const DEFAULT_RADIUS_METERS = Number(process.env.REQUEST_ASSIGN_RADIUS_METERS || 3000);
const MAX_CANDIDATE_DRIVERS = Number(process.env.REQUEST_ASSIGN_MAX_CANDIDATES || 8);

const BACKOFF_FACTOR = Number(process.env.REQUEST_ASSIGN_BACKOFF_FACTOR || 2);
const MAX_TIMEOUT_MS = 60000;

const activeAssignments = new Map();

const toIdString = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value.toString === "function") return value.toString();
  return null;
};

const logAudit = async (type, payload) => {
  try {
    await AuditLog.create([{ ...payload, type }]);
  } catch {
    // never throw from audit logging
  }
};

export const findNearestDrivers = async (
  pickup,
  radiusMeters = DEFAULT_RADIUS_METERS,
  limit = MAX_CANDIDATE_DRIVERS,
  options = {},
) => {
  if (!isValidLatLng(pickup)) {
    throw new ValidationError("pickup with valid lat and lng is required");
  }

  const radius = Number.isFinite(Number(radiusMeters))
    ? Number(radiusMeters)
    : DEFAULT_RADIUS_METERS;
  const maxCount = Number.isFinite(Number(limit))
    ? Math.max(1, Math.min(50, Number(limit)))
    : MAX_CANDIDATE_DRIVERS;

  const query = { isOnline: true };

  if (Array.isArray(options.activeDriverIds) && options.activeDriverIds.length > 0) {
    query.driver = { $in: options.activeDriverIds.map((id) => id.toString()) };
  }

  const matatus = await Matatu.find(query)
    .select("_id driver location lastLocation sacco")
    .lean();

  if (!matatus || matatus.length === 0) {
    return [];
  }

  const lat = pickup.lat;
  const lng = pickup.lng;

  const candidates = [];

  for (const m of matatus) {
    let loc = null;

    if (
      m.location &&
      typeof m.location.lat === "number" &&
      typeof m.location.lng === "number"
    ) {
      loc = { lat: m.location.lat, lng: m.location.lng };
    } else if (
      m.lastLocation &&
      Array.isArray(m.lastLocation.coordinates) &&
      m.lastLocation.coordinates.length === 2
    ) {
      loc = {
        lng: m.lastLocation.coordinates[0],
        lat: m.lastLocation.coordinates[1],
      };
    }

    if (!loc) continue;

    const distance = haversineMeters(lat, lng, loc.lat, loc.lng);
    if (!Number.isFinite(distance) || distance > radius) continue;

    candidates.push({
      driverId: toIdString(m.driver),
      matatuId: toIdString(m._id),
      saccoId: toIdString(m.sacco),
      distanceMeters: distance,
      driverLocation: loc,
    });
  }

  candidates.sort((a, b) => a.distanceMeters - b.distanceMeters);
  return candidates.slice(0, maxCount);
};

const computeTimeoutMs = (baseMs, attemptIndex) => {
  const base = Number.isFinite(Number(baseMs)) ? Number(baseMs) : DEFAULT_ATTEMPT_TIMEOUT_MS;
  const idx = Math.max(1, attemptIndex || 1);
  const raw = base * Math.pow(BACKOFF_FACTOR, idx - 1);
  return Math.min(raw, MAX_TIMEOUT_MS);
};

const emitFailed = async ({ request, reason, io }) => {
  await Request.findByIdAndUpdate(request._id, { status: "failed" }).lean();

  await logAudit("assignment_failed", {
    requestId: toIdString(request._id),
    userId: request.userId || null,
    reason: reason || "no_drivers",
    meta: {},
  });

  if (!io) return;

  const nsp = io.of("/realtime");
  const passengerRoom = `passenger:${toIdString(request.userId)}`;

  if (passengerRoom) {
    nsp.to(passengerRoom).emit("request:failed", {
      requestId: toIdString(request._id),
      reason: reason || "no_drivers",
    });
  }
};

const scheduleNextAttempt = async (ctx, io) => {
  const latest = activeAssignments.get(ctx.requestId);
  if (!latest || latest.status === "accepted" || latest.status === "failed") {
    return;
  }

  if (
    ctx.currentIndex >= ctx.candidates.length ||
    ctx.attempts >= ctx.maxAttempts
  ) {
    activeAssignments.delete(ctx.requestId);
    await emitFailed({ request: ctx.requestDoc, reason: "no_drivers", io });
    return;
  }

  const target = ctx.candidates[ctx.currentIndex];
  ctx.currentIndex += 1;
  ctx.attempts += 1;
  ctx.currentDriverId = target.driverId;
  ctx.status = "assigned";

  const updated = await Request.findByIdAndUpdate(
    ctx.requestId,
    {
      status: "assigned",
      driverId: target.driverId,
      $inc: { attempts: 1 },
    },
    { new: true }
  ).lean();

  ctx.requestDoc = updated || ctx.requestDoc;

  await logAudit("assignment_attempt", {
    requestId: ctx.requestId,
    userId: ctx.requestDoc ? ctx.requestDoc.userId : null,
    reason: "driver_notified",
    meta: {
      driverId: target.driverId,
      distanceMeters: target.distanceMeters,
      attempt: ctx.attempts,
    },
  });

  if (io && ctx.requestDoc && target.driverId) {
    const nsp = io.of("/realtime");
    const driverRoom = `driver:${target.driverId}`;
    const passengerRoom = `passenger:${toIdString(ctx.requestDoc.userId)}`;

    const avgSpeedKmh = 25;
    const etaMinutes =
      Number.isFinite(target.distanceMeters)
        ? (target.distanceMeters / 1000 / avgSpeedKmh) * 60
        : null;

    const timeoutMs = computeTimeoutMs(ctx.attemptTimeoutMs, ctx.attempts);

    const payload = {
      requestId: ctx.requestId,
      driverId: target.driverId,
      matatuId: target.matatuId || null,
      saccoId: target.saccoId || null,
      distanceMeters: target.distanceMeters,
      etaSeconds: etaMinutes != null ? Math.round(etaMinutes * 60) : null,
      acceptTimeoutSeconds: Number.isFinite(timeoutMs)
        ? Math.max(1, Math.round(timeoutMs / 1000))
        : null,
      pickup: ctx.requestDoc && ctx.requestDoc.pickup ? ctx.requestDoc.pickup : null,
      destination:
        ctx.requestDoc && ctx.requestDoc.destination ? ctx.requestDoc.destination : null,
      pickupLikelihood: target.pickupLikelihood || null,
    };

    nsp.to(driverRoom).emit("request:assigned", payload);
    if (passengerRoom) {
      nsp.to(passengerRoom).emit("request:assigned", payload);
    }
  }

  if (ctx.timeoutId) {
    clearTimeout(ctx.timeoutId);
  }

  ctx.timeoutId = setTimeout(async () => {
    const current = activeAssignments.get(ctx.requestId);
    if (!current || current.status !== "assigned") {
      return;
    }

    await logAudit("assignment_timeout", {
      requestId: ctx.requestId,
      userId: ctx.requestDoc ? ctx.requestDoc.userId : null,
      reason: "driver_timeout",
      meta: {
        driverId: current.currentDriverId,
        attempt: current.attempts,
      },
    });

    if (current.currentDriverId) {
      recordDriverAssignmentEvent({
        driverId: current.currentDriverId,
        eventType: "timeout",
      });
    }

    await scheduleNextAttempt(current, io);
  }, timeoutMs);

  activeAssignments.set(ctx.requestId, ctx);
};

export const assignRequest = async ({
  requestId,
  io,
  maxAttempts,
  attemptTimeoutMs,
  activeDriverIds,
}) => {
  if (!requestId) {
    throw new ValidationError("requestId is required for assignment");
  }

  const existing = activeAssignments.get(requestId);
  if (existing && existing.status === "assigned") {
    return existing;
  }

  const doc = await Request.findById(requestId).lean();
  if (!doc) {
    throw new ValidationError("Request not found");
  }

  if (doc.status !== "pending") {
    return null;
  }

  if (!isValidLatLng(doc.pickup)) {
    throw new ValidationError("Request pickup location is invalid");
  }

  const corridorRadiusMeters = Number(
    process.env.REQUEST_ASSIGN_CORRIDOR_RADIUS_METERS || 400,
  );

  let corridorContext = null;

  try {
    const proximity = await findNearestStageOrCorridor(doc.pickup, {
      corridorThresholdMeters: corridorRadiusMeters,
    });

    if (proximity && proximity.nearestCorridor) {
      corridorContext = {
        corridor: proximity.nearestCorridor,
        pickupDistanceToCorridor: proximity.distanceToCorridor,
        radiusMeters: corridorRadiusMeters,
      };
    }
  } catch {
  }

  const rawCandidates = await findNearestDrivers(
    doc.pickup,
    DEFAULT_RADIUS_METERS,
    MAX_CANDIDATE_DRIVERS,
    {
      activeDriverIds,
    },
  );

  const candidates = scoreAndSortCandidatesForPickup({
    candidates: rawCandidates,
    radiusMeters: DEFAULT_RADIUS_METERS,
    pickupLocation: doc.pickup,
    corridorContext,
  });

  if (!candidates || candidates.length === 0) {
    await emitFailed({ request: doc, reason: "no_drivers", io });
    return null;
  }

  const ctx = {
    requestId: toIdString(doc._id),
    requestDoc: doc,
    candidates,
    currentIndex: 0,
    attempts: 0,
    maxAttempts:
      maxAttempts && Number.isFinite(Number(maxAttempts))
        ? Number(maxAttempts)
        : DEFAULT_MAX_ATTEMPTS,
    attemptTimeoutMs:
      attemptTimeoutMs && Number.isFinite(Number(attemptTimeoutMs))
        ? Number(attemptTimeoutMs)
        : DEFAULT_ATTEMPT_TIMEOUT_MS,
    status: "pending",
    timeoutId: null,
    currentDriverId: null,
  };

  activeAssignments.set(ctx.requestId, ctx);
  await scheduleNextAttempt(ctx, io);

  return ctx;
};

export const onDriverAccept = async ({ requestId, driverId, io }) => {
  if (!requestId || !driverId) {
    throw new ValidationError("requestId and driverId are required for accept");
  }

  const ctx = activeAssignments.get(requestId);
  if (!ctx) return null;

  const driverStr = toIdString(driverId);

  if (ctx.currentDriverId && ctx.currentDriverId !== driverStr) {
    return null;
  }

  ctx.status = "accepted";
  if (ctx.timeoutId) {
    clearTimeout(ctx.timeoutId);
    ctx.timeoutId = null;
  }

  activeAssignments.delete(requestId);

  const updated = await Request.findByIdAndUpdate(
    requestId,
    {
      status: "accepted",
      driverId: driverStr,
    },
    { new: true }
  ).lean();

  await logAudit("assignment_accepted", {
    requestId,
    userId: updated ? updated.userId : null,
    reason: "driver_accepted",
    meta: {
      driverId: driverStr,
    },
  });

  recordDriverAssignmentEvent({
    driverId: driverStr,
    eventType: "accepted",
  });

  if (io && updated) {
    const nsp = io.of("/realtime");
    const passengerRoom = `passenger:${toIdString(updated.userId)}`;

    const payload = {
      requestId: toIdString(updated._id),
      driverId: driverStr,
    };

    if (passengerRoom) {
      nsp.to(passengerRoom).emit("request:accepted", payload);
    }
  }

  return updated;
};

export const onDriverReject = async ({ requestId, driverId, io }) => {
  if (!requestId || !driverId) {
    throw new ValidationError("requestId and driverId are required for reject");
  }

  const ctx = activeAssignments.get(requestId);
  if (!ctx) return null;

  const driverStr = toIdString(driverId);

  if (ctx.currentDriverId && ctx.currentDriverId !== driverStr) {
    return null;
  }

  await logAudit("assignment_rejected", {
    requestId,
    userId: ctx.requestDoc ? ctx.requestDoc.userId : null,
    reason: "driver_rejected",
    meta: {
      driverId: driverStr,
      attempt: ctx.attempts,
    },
  });

  recordDriverAssignmentEvent({
    driverId: driverStr,
    eventType: "rejected",
  });

  ctx.currentDriverId = null;

  await scheduleNextAttempt(ctx, io);

  return ctx;
};
