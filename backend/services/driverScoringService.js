import { haversineMeters } from "../utils/geo.js";

const telemetryByDriver = new Map();

const DISTANCE_WEIGHT = 0.3;
const SPEED_TREND_WEIGHT = 0.3;
const RECENCY_WEIGHT = 0.25;
const ACCEPTANCE_WEIGHT = 0.15;

const DEFAULT_RADIUS_METERS = 3000;
const DEFAULT_CORRIDOR_RADIUS_METERS = Number(
  process.env.REQUEST_ASSIGN_CORRIDOR_RADIUS_METERS || 400,
);

const getOrCreateTelemetry = (driverId) => {
  if (!driverId) return null;
  const key = driverId.toString();
  let entry = telemetryByDriver.get(key);

  if (!entry) {
    entry = {
      lastLocation: null,
      prevLocation: null,
      lastSpeedKmh: null,
      prevSpeedKmh: null,
      lastUpdateAt: null,
      lastAcceptAt: null,
      lastRejectAt: null,
      lastTimeoutAt: null,
      totalAccepted: 0,
      totalRejected: 0,
      totalTimeouts: 0,
    };
    telemetryByDriver.set(key, entry);
  }

  return entry;
};

export const recordDriverLocationUpdate = ({ driverId, lat, lng, timestamp }) => {
  if (!driverId || typeof lat !== "number" || typeof lng !== "number") {
    return;
  }

  const entry = getOrCreateTelemetry(driverId);
  if (!entry) return;

  const now = timestamp ? new Date(timestamp) : new Date();
  if (Number.isNaN(now.getTime())) {
    return;
  }

  const previous = entry.lastLocation;

  if (
    previous &&
    typeof previous.lat === "number" &&
    typeof previous.lng === "number" &&
    previous.at instanceof Date
  ) {
    const dtMs = now.getTime() - previous.at.getTime();

    if (dtMs > 2000) {
      const distance = haversineMeters(previous.lat, previous.lng, lat, lng);

      if (Number.isFinite(distance) && distance >= 0) {
        const hours = dtMs / (1000 * 60 * 60);
        const speedKmh = hours > 0 ? (distance / 1000) / hours : null;

        if (speedKmh != null && Number.isFinite(speedKmh) && speedKmh >= 0) {
          entry.prevSpeedKmh = entry.lastSpeedKmh;
          entry.lastSpeedKmh = speedKmh;
        }
      }
    }

    entry.prevLocation = previous;
  }

  entry.lastLocation = { lat, lng, at: now };
  entry.lastUpdateAt = now;
};

export const recordDriverAssignmentEvent = ({ driverId, eventType, timestamp }) => {
  if (!driverId || !eventType) {
    return;
  }

  const entry = getOrCreateTelemetry(driverId);
  if (!entry) return;

  const now = timestamp ? new Date(timestamp) : new Date();
  if (Number.isNaN(now.getTime())) {
    return;
  }

  switch (eventType) {
    case "accepted":
      entry.totalAccepted += 1;
      entry.lastAcceptAt = now;
      break;
    case "rejected":
      entry.totalRejected += 1;
      entry.lastRejectAt = now;
      break;
    case "timeout":
      entry.totalTimeouts += 1;
      entry.lastTimeoutAt = now;
      break;
    default:
      break;
  }
};

const computeDistanceScore = (distanceMeters, radiusMeters) => {
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
    return 0;
  }

  const baseRadius = Number.isFinite(Number(radiusMeters))
    ? Number(radiusMeters)
    : DEFAULT_RADIUS_METERS;

  const maxEffective = baseRadius * 1.5;
  const clamped = Math.min(distanceMeters, maxEffective);

  const score = 1 - clamped / maxEffective;
  return score < 0 ? 0 : score;
};

const computeDistanceToPolylineLatLng = (point, coordinates) => {
  if (
    !point ||
    typeof point.lat !== "number" ||
    typeof point.lng !== "number" ||
    !Array.isArray(coordinates) ||
    coordinates.length === 0
  ) {
    return Number.POSITIVE_INFINITY;
  }

  let best = Number.POSITIVE_INFINITY;

  coordinates.forEach((coord) => {
    if (!coord || typeof coord.lat !== "number" || typeof coord.lng !== "number") {
      return;
    }

    const d = haversineMeters(point.lat, point.lng, coord.lat, coord.lng);
    if (Number.isFinite(d) && d < best) {
      best = d;
    }
  });

  return best;
};

const computeRecencyScore = (lastUpdateAt, now) => {
  if (!(lastUpdateAt instanceof Date)) {
    return 0.3;
  }

  const ageSeconds = Math.max(0, (now.getTime() - lastUpdateAt.getTime()) / 1000);

  if (ageSeconds <= 30) return 1;
  if (ageSeconds >= 900) return 0;

  const halfLifeSeconds = 120;
  const lambda = Math.log(2) / halfLifeSeconds;
  const score = Math.exp(-lambda * ageSeconds);

  return Math.max(0, Math.min(1, score));
};

const computeSpeedTrendScore = (entry) => {
  const { lastSpeedKmh, prevSpeedKmh } = entry;

  if (typeof lastSpeedKmh === "number" && typeof prevSpeedKmh === "number") {
    if (prevSpeedKmh <= 0) {
      return 0.5;
    }

    const delta = prevSpeedKmh - lastSpeedKmh;
    const ratio = delta / Math.max(prevSpeedKmh, 5);
    const clamped = Math.max(-1, Math.min(1, ratio));

    const score = 0.5 + 0.5 * clamped;
    return Math.max(0, Math.min(1, score));
  }

  if (typeof lastSpeedKmh === "number") {
    if (lastSpeedKmh <= 5) return 1;
    if (lastSpeedKmh <= 15) return 0.7;
    if (lastSpeedKmh <= 35) return 0.5;
    return 0.3;
  }

  return 0.5;
};

const computeAcceptanceScore = (entry, now) => {
  const accepted = entry.totalAccepted || 0;
  const rejected = entry.totalRejected || 0;
  const timeouts = entry.totalTimeouts || 0;

  let base = 0.4;

  const totalWeighted = accepted + rejected + 0.5 * timeouts;
  if (totalWeighted > 0) {
    base = (accepted + 0.5) / (totalWeighted + 1);
  }

  let recencyBoost = 0;

  if (entry.lastAcceptAt instanceof Date) {
    const ageMinutes = Math.max(
      0,
      (now.getTime() - entry.lastAcceptAt.getTime()) / (1000 * 60),
    );

    if (ageMinutes <= 15) {
      recencyBoost = 0.3;
    } else if (ageMinutes <= 60) {
      recencyBoost = 0.15;
    }
  }

  const score = Math.min(1, base + recencyBoost);
  return Math.max(0, score);
};

export const computePickupLikelihoodForCandidate = ({
  driverId,
  distanceMeters,
  radiusMeters,
  driverLocation,
  pickupLocation,
  corridorContext,
  now = new Date(),
}) => {
  const entry = driverId ? telemetryByDriver.get(driverId.toString()) : null;

  const distanceScore = computeDistanceScore(distanceMeters, radiusMeters);
  const recencyScore = entry ? computeRecencyScore(entry.lastUpdateAt, now) : 0.3;
  const speedTrendScore = entry ? computeSpeedTrendScore(entry) : 0.5;
  const acceptanceScore = entry ? computeAcceptanceScore(entry, now) : 0.4;

  const baseScore =
    DISTANCE_WEIGHT * distanceScore +
    SPEED_TREND_WEIGHT * speedTrendScore +
    RECENCY_WEIGHT * recencyScore +
    ACCEPTANCE_WEIGHT * acceptanceScore;

  const factors = [];

  const baseRadius = Number.isFinite(Number(radiusMeters))
    ? Number(radiusMeters)
    : DEFAULT_RADIUS_METERS;

  if (Number.isFinite(distanceMeters) && distanceMeters <= baseRadius / 3) {
    factors.push("nearby");
  }

  if (speedTrendScore >= 0.7) {
    factors.push("slowing");
  }

  if (recencyScore >= 0.7 || acceptanceScore >= 0.7) {
    factors.push("recently_active");
  }

  let corridorMeta = {
    applied: false,
    corridorId: null,
    corridorName: null,
    pickupDistanceMeters: null,
    driverDistanceMeters: null,
    radiusMeters: null,
  };

  let corridorBoost = 0;

  if (
    corridorContext &&
    corridorContext.corridor &&
    Array.isArray(corridorContext.corridor.coordinates) &&
    pickupLocation &&
    typeof pickupLocation.lat === "number" &&
    typeof pickupLocation.lng === "number" &&
    driverLocation &&
    typeof driverLocation.lat === "number" &&
    typeof driverLocation.lng === "number"
  ) {
    const radius = Number.isFinite(Number(corridorContext.radiusMeters))
      ? Number(corridorContext.radiusMeters)
      : DEFAULT_CORRIDOR_RADIUS_METERS;

    const pickupDist = Number.isFinite(Number(corridorContext.pickupDistanceToCorridor))
      ? Number(corridorContext.pickupDistanceToCorridor)
      : computeDistanceToPolylineLatLng(pickupLocation, corridorContext.corridor.coordinates);

    const driverDist = computeDistanceToPolylineLatLng(
      driverLocation,
      corridorContext.corridor.coordinates,
    );

    if (Number.isFinite(pickupDist) && Number.isFinite(driverDist)) {
      const clampRadius = radius > 0 ? radius : DEFAULT_CORRIDOR_RADIUS_METERS;

      const pickupScore = Math.max(0, Math.min(1, 1 - pickupDist / clampRadius));
      const driverScore = Math.max(0, Math.min(1, 1 - driverDist / clampRadius));

      const combined = Math.min(pickupScore, driverScore);

      if (combined > 0) {
        const CORRIDOR_MAX_BOOST = 0.15;
        corridorBoost = CORRIDOR_MAX_BOOST * combined;

        corridorMeta = {
          applied: true,
          corridorId: corridorContext.corridor.id || null,
          corridorName: corridorContext.corridor.name || null,
          pickupDistanceMeters: pickupDist,
          driverDistanceMeters: driverDist,
          radiusMeters: clampRadius,
        };

        if (combined >= 0.6) {
          factors.push("corridor_aligned");
        } else if (driverScore > pickupScore) {
          factors.push("driver_corridor");
        } else {
          factors.push("pickup_corridor");
        }
      }
    }
  }

  const score = Math.min(1, baseScore + corridorBoost);

  return {
    score,
    factors,
    corridor: corridorMeta,
  };
};

export const scoreAndSortCandidatesForPickup = ({
  candidates,
  radiusMeters,
  pickupLocation,
  corridorContext,
  now = new Date(),
}) => {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return [];
  }

  const scored = candidates.map((candidate) => {
    const pickupLikelihood = computePickupLikelihoodForCandidate({
      driverId: candidate.driverId,
      distanceMeters: candidate.distanceMeters,
      radiusMeters,
      driverLocation: candidate.driverLocation,
      pickupLocation,
      corridorContext,
      now,
    });

    return {
      ...candidate,
      pickupLikelihood,
    };
  });

  scored.sort((a, b) => {
    const aScore = a.pickupLikelihood && typeof a.pickupLikelihood.score === "number"
      ? a.pickupLikelihood.score
      : 0;
    const bScore = b.pickupLikelihood && typeof b.pickupLikelihood.score === "number"
      ? b.pickupLikelihood.score
      : 0;

    if (bScore !== aScore) {
      return bScore - aScore;
    }

    const aDist = Number.isFinite(a.distanceMeters) ? a.distanceMeters : Number.POSITIVE_INFINITY;
    const bDist = Number.isFinite(b.distanceMeters) ? b.distanceMeters : Number.POSITIVE_INFINITY;

    return aDist - bDist;
  });

  return scored;
};
