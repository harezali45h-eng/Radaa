import Request from "../models/Request.js";
import { ValidationError } from "../utils/errors.js";
import { isValidLatLng, normalizeLatLng } from "../utils/geo.js";

const DEFAULT_POLICY = "FIRST_AVAILABLE";

export const enqueueRequest = async ({
  userId,
  pickup,
  destination,
  fare,
  paymentMethod,
  policy,
  meta,
}) => {
  if (!userId) {
    throw new ValidationError("userId is required for request enqueue");
  }

  const pickupPoint = normalizeLatLng(pickup);
  if (!pickupPoint || !isValidLatLng(pickupPoint)) {
    throw new ValidationError("pickup with valid lat and lng is required");
  }

  const destinationPoint = normalizeLatLng(destination) || undefined;

  const doc = await Request.create({
    userId,
    pickup: pickupPoint,
    destination: destinationPoint,
    fare: fare != null && Number.isFinite(Number(fare)) ? Number(fare) : 0,
    paymentMethod: paymentMethod || "cash",
    policy: policy || DEFAULT_POLICY,
    status: "pending",
    meta: meta && typeof meta === "object" ? meta : {},
  });

  return doc;
};

export const getRequestById = async (requestId) => {
  if (!requestId) return null;
  return Request.findById(requestId).lean();
};

export const updateRequest = async (requestId, updates) => {
  if (!requestId) {
    throw new ValidationError("requestId is required for update");
  }

  return Request.findByIdAndUpdate(requestId, updates, { new: true }).lean();
};

export const listPendingRequests = async ({ limit = 50 } = {}) => {
  const safeLimit = Number.isFinite(Number(limit)) ? Math.max(1, Math.min(500, Number(limit))) : 50;

  return Request.find({ status: "pending" })
    .sort({ createdAt: 1 })
    .limit(safeLimit)
    .lean();
};

export const getQueueMetrics = async () => {
  const [pending, assigned, accepted, inProgress] = await Promise.all([
    Request.countDocuments({ status: "pending" }),
    Request.countDocuments({ status: "assigned" }),
    Request.countDocuments({ status: "accepted" }),
    Request.countDocuments({ status: "in_progress" }),
  ]);

  const byPolicy = await Request.aggregate([
    {
      $group: {
        _id: "$policy",
        total: { $sum: 1 },
        pending: {
          $sum: {
            $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
          },
        },
      },
    },
  ]).catch(() => []);

  return {
    counts: {
      pending,
      assigned,
      accepted,
      inProgress,
    },
    byPolicy,
  };
};
