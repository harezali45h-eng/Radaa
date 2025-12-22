import LiveRequest from "../models/LiveRequest.js";
import { ApiError } from "../utils/errors.js";
import { haversineMeters } from "../utils/geo.js";
import {
  findNearestStageOrCorridor,
  STAGE_DISTANCE_THRESHOLD_METERS,
  CORRIDOR_DISTANCE_THRESHOLD_METERS
} from "./stageProximityService.js";

const toIdString = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value.toString === "function") return value.toString();
  return null;
};

const serializeLiveRequest = (doc) => {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : doc;

  return {
    id: toIdString(plain._id),
    userId: toIdString(plain.userId),
    stageId: plain.stageId || null,
    corridorId: plain.corridorId || null,
    location: plain.location || null,
    status: plain.status,
    createdAt: plain.createdAt || null,
    updatedAt: plain.updatedAt || null
  };
};

export const createLiveRequest = async ({ userId, location }) => {
  if (!userId) {
    throw new ApiError(400, "userId is required", "VALIDATION_ERROR");
  }

  if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
    throw new ApiError(
      400,
      "location with numeric lat and lng is required",
      "VALIDATION_ERROR"
    );
  }

  const proximity = await findNearestStageOrCorridor(location);

  if (!proximity || !proximity.valid) {
    throw new ApiError(
      400,
      "Passenger is not near any permitted stage or corridor",
      "OUT_OF_RANGE",
      {
        distanceMeters: proximity ? proximity.distanceMeters : null
      }
    );
  }

  const nearStage =
    proximity.nearestStage &&
    proximity.distanceToStage <= STAGE_DISTANCE_THRESHOLD_METERS;

  const nearCorridor =
    proximity.nearestCorridor &&
    proximity.distanceToCorridor <= CORRIDOR_DISTANCE_THRESHOLD_METERS;

  let stageId = null;
  let corridorId = null;

  if (nearStage) {
    stageId = proximity.nearestStage.id;
  } else if (nearCorridor) {
    corridorId = proximity.nearestCorridor.id;
  }

  if (!stageId && !corridorId) {
    throw new ApiError(
      400,
      "Passenger is not near any permitted stage or corridor",
      "OUT_OF_RANGE",
      {
        distanceMeters: proximity.distanceMeters
      }
    );
  }

  await LiveRequest.updateMany(
    { userId, status: "waiting" },
    { $set: { status: "cancelled" } }
  );

  const doc = await LiveRequest.create({
    userId,
    stageId,
    corridorId,
    location: {
      lat: location.lat,
      lng: location.lng
    },
    status: "waiting"
  });

  return serializeLiveRequest(doc);
};

export const getActiveLiveRequestForUser = async (userId) => {
  if (!userId) {
    throw new ApiError(400, "userId is required", "VALIDATION_ERROR");
  }

  const doc = await LiveRequest.findOne({
    userId,
    status: { $in: ["waiting", "matched"] }
  })
    .sort({ createdAt: -1 })
    .exec();

  return serializeLiveRequest(doc);
};

export const cancelLiveRequest = async ({ userId, requestId }) => {
  if (!userId || !requestId) {
    throw new ApiError(
      400,
      "userId and requestId are required",
      "VALIDATION_ERROR"
    );
  }

  const doc = await LiveRequest.findOneAndUpdate(
    {
      _id: requestId,
      userId,
      status: { $in: ["waiting", "matched"] }
    },
    {
      $set: {
        status: "cancelled"
      }
    },
    { new: true }
  ).exec();

  if (!doc) {
    throw new ApiError(404, "Live request not found", "LIVE_REQUEST_NOT_FOUND");
  }

  return serializeLiveRequest(doc);
};

export const listVisibleLiveRequestsForDriver = async ({ location }) => {
  if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
    throw new ApiError(
      400,
      "location with numeric lat and lng is required",
      "VALIDATION_ERROR"
    );
  }

  const driverProximity = await findNearestStageOrCorridor(location);

  if (!driverProximity || !driverProximity.valid) {
    return [];
  }

  const driverNearStage =
    driverProximity.nearestStage &&
    driverProximity.distanceToStage <= STAGE_DISTANCE_THRESHOLD_METERS;

  const driverNearCorridor =
    driverProximity.nearestCorridor &&
    driverProximity.distanceToCorridor <= CORRIDOR_DISTANCE_THRESHOLD_METERS;

  const stageId = driverNearStage ? driverProximity.nearestStage.id : null;
  const corridorId = driverNearCorridor ? driverProximity.nearestCorridor.id : null;

  const filter = {
    status: "waiting"
  };

  const or = [];
  if (stageId) {
    or.push({ stageId });
  }
  if (corridorId) {
    or.push({ corridorId });
  }

  if (or.length === 0) {
    return [];
  }

  filter.$or = or;

  const docs = await LiveRequest.find(filter).lean().exec();

  const results = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const doc of docs) {
    const reqLoc = doc.location;
    if (!reqLoc || typeof reqLoc.lat !== "number" || typeof reqLoc.lng !== "number") {
      // eslint-disable-next-line no-continue
      continue;
    }

    // eslint-disable-next-line no-await-in-loop
    const prox = await findNearestStageOrCorridor(reqLoc);

    const reqNearStage =
      prox.nearestStage && prox.distanceToStage <= STAGE_DISTANCE_THRESHOLD_METERS;
    const reqNearCorridor =
      prox.nearestCorridor &&
      prox.distanceToCorridor <= CORRIDOR_DISTANCE_THRESHOLD_METERS;

    const matchesStage =
      stageId && reqNearStage && prox.nearestStage.id === stageId;
    const matchesCorridor =
      corridorId && reqNearCorridor && prox.nearestCorridor.id === corridorId;

    if (!matchesStage && !matchesCorridor) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const distanceFromDriver = haversineMeters(
      location.lat,
      location.lng,
      reqLoc.lat,
      reqLoc.lng
    );

    results.push({
      id: toIdString(doc._id),
      userId: toIdString(doc.userId),
      stageId: doc.stageId || null,
      corridorId: doc.corridorId || null,
      location: reqLoc,
      status: doc.status,
      distanceFromDriverMeters: Number.isFinite(distanceFromDriver)
        ? distanceFromDriver
        : null
    });
  }

  return results;
};
