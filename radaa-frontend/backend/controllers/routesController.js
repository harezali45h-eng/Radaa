import Route from "../models/Route.js";
import Matatu from "../models/Matatu.js";
import { ApiError, ValidationError } from "../utils/errors.js";

const toNumberOrNull = (value) => {
  if (value == null) return null;
  const num = typeof value === "string" ? Number(value) : value;
  return Number.isNaN(num) ? null : num;
};

const degToRad = (deg) => (deg * Math.PI) / 180;

const haversineDistanceMeters = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const dLat = degToRad(lat2 - lat1);
  const dLng = degToRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const buildSamplePoints = (coordinates, spacingMeters = 100) => {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return [];
  }

  const samples = [];

  const pushIfNew = (lng, lat) => {
    const key = `${lng.toFixed(6)},${lat.toFixed(6)}`;
    if (!samples.some((p) => p.key === key)) {
      samples.push({ key, lng, lat });
    }
  };

  const [firstLng, firstLat] = coordinates[0];
  pushIfNew(firstLng, firstLat);

  for (let i = 0; i < coordinates.length - 1; i += 1) {
    const [lng1, lat1] = coordinates[i];
    const [lng2, lat2] = coordinates[i + 1];

    const segmentLength = haversineDistanceMeters(lat1, lng1, lat2, lng2);

    const steps = Math.floor(segmentLength / spacingMeters);

    for (let step = 1; step <= steps; step += 1) {
      const t = step / (steps + 1);
      const lat = lat1 + (lat2 - lat1) * t;
      const lng = lng1 + (lng2 - lng1) * t;
      pushIfNew(lng, lat);
    }

    pushIfNew(lng2, lat2);
  }

  return samples.map((p) => [p.lng, p.lat]);
};

export const getRouteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const route = await Route.findById(id).lean();

    if (!route) {
      throw new ApiError(404, "Route not found", "ROUTE_NOT_FOUND");
    }

    res.json({ success: true, data: route });
  } catch (error) {
    next(error);
  }
};

export const searchRoutes = async (req, res, next) => {
  try {
    const qRaw = (req.query.q || "").toString().trim();

    if (!qRaw) {
      return res.json({ success: true, data: [] });
    }

    const escaped = qRaw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    const routes = await Route.find({
      $or: [{ name: regex }, { aliases: regex }]
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({ success: true, data: routes });
  } catch (error) {
    next(error);
  }
};

export const getMatatusOnRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const radius = toNumberOrNull(req.query.radius) ?? 100;

    if (radius <= 0) {
      throw new ValidationError("radius must be a positive number in meters");
    }

    const route = await Route.findById(id).lean();

    if (!route) {
      throw new ApiError(404, "Route not found", "ROUTE_NOT_FOUND");
    }

    const coordinates = route.polyline?.coordinates || [];

    if (!Array.isArray(coordinates) || coordinates.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const samplePoints = buildSamplePoints(coordinates, 100);

    // NOTE: This implementation samples along the polyline and performs a $near query
    // for each sample point against the matatu lastLocation 2dsphere index. For light
    // to moderate traffic this is acceptable, but for very dense networks a dedicated
    // spatial library or precomputed corridor geometry would be recommended to reduce
    // query fan-out and improve performance.

    const matatusById = new Map();

    // Sequential queries keep things simple and avoid overloading the DB in dev setups.
    // If traffic increases, this can be batched or parallelised with an external queue.
    // eslint-disable-next-line no-restricted-syntax
    for (const [lng, lat] of samplePoints) {
      // eslint-disable-next-line no-await-in-loop
      const nearby = await Matatu.find({
        lastLocation: {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: radius
          }
        }
      })
        .select("plate lastLocation location status isOnline")
        .lean();

      // eslint-disable-next-line no-restricted-syntax
      for (const m of nearby) {
        matatusById.set(m._id.toString(), m);
      }
    }

    res.json({ success: true, data: Array.from(matatusById.values()) });
  } catch (error) {
    next(error);
  }
};

export const seedSampleRoute = async (req, res, next) => {
  try {
    const existing = await Route.findOne({ name: "Sample Pilot Corridor" }).lean();

    if (existing) {
      return res.json({ success: true, id: existing._id.toString(), created: false });
    }

    const coordinates = [
      [36.8219, -1.2921],
      [36.825, -1.295],
      [36.828, -1.3]
    ];

    const route = await Route.create({
      name: "Sample Pilot Corridor",
      aliases: ["Sample Corridor", "Pilot Route"],
      polyline: {
        type: "LineString",
        coordinates
      },
      tags: ["sample", "pilot"]
    });

    res.status(201).json({ success: true, id: route._id.toString(), created: true });
  } catch (error) {
    next(error);
  }
};
