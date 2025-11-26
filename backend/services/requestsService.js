import { randomUUID } from "crypto";

const DEFAULT_TTL_MS = Number(process.env.REQUEST_TTL_MS || 120000);

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

class InMemoryRequestStore {
  constructor(ttlMs = DEFAULT_TTL_MS) {
    this.ttlMs = ttlMs;
    this.requests = new Map();
  }

  createRequest({ requestId, userId, pickupPoint, partySize, createdAt, meta }) {
    const id = requestId || randomUUID();
    const now = createdAt instanceof Date ? createdAt : new Date(createdAt || Date.now());
    const expiresAt = new Date(now.getTime() + this.ttlMs);

    const record = {
      id,
      userId,
      pickupPoint,
      partySize: partySize || 1,
      createdAt: now,
      expiresAt,
      meta: meta || {},
      status: "pending",
      acceptedBy: null,
      acceptToken: null,
      cancelledReason: null
    };

    const existing = this.requests.get(id);
    if (existing && existing.status === "pending") {
      return this.toPublic(existing);
    }

    const timeout = setTimeout(() => {
      this.expire(id, "ttl_expired");
    }, this.ttlMs);

    this.requests.set(id, { ...record, _timeout: timeout });

    return this.toPublic(record);
  }

  getRequestsNear(point, radiusMeters) {
    if (!point || typeof point.lat !== "number" || typeof point.lng !== "number") {
      return [];
    }

    const now = Date.now();

    const results = [];

    for (const req of this.requests.values()) {
      if (req.status !== "pending") continue;
      if (req.expiresAt.getTime() <= now) continue;

      const pickup = req.pickupPoint;
      if (!pickup || typeof pickup.lat !== "number" || typeof pickup.lng !== "number") continue;

      const distance = toMeters(point.lat, point.lng, pickup.lat, pickup.lng);
      if (distance <= radiusMeters) {
        results.push(this.toPublic(req));
      }
    }

    return results;
  }

  acceptRequest(requestId, driverId) {
    const record = this.requests.get(requestId);

    if (!record) {
      throw new Error("Request not found or expired");
    }

    const now = Date.now();
    if (record.expiresAt.getTime() <= now || record.status !== "pending") {
      throw new Error("Request is no longer available");
    }

    const acceptToken = randomUUID();
    record.status = "accepted";
    record.acceptedBy = driverId;
    record.acceptToken = acceptToken;

    if (record._timeout) {
      clearTimeout(record._timeout);
      record._timeout = null;
    }

    this.requests.set(requestId, record);

    return { acceptToken, request: this.toPublic(record) };
  }

  cancelRequest(requestId, reason = "cancelled") {
    const record = this.requests.get(requestId);

    if (!record) {
      return null;
    }

    record.status = "cancelled";
    record.cancelledReason = reason;

    if (record._timeout) {
      clearTimeout(record._timeout);
      record._timeout = null;
    }

    this.requests.delete(requestId);

    return this.toPublic(record);
  }

  expire(requestId, reason = "ttl_expired") {
    const record = this.requests.get(requestId);
    if (!record) return null;

    record.status = "expired";
    record.cancelledReason = reason;

    if (record._timeout) {
      clearTimeout(record._timeout);
      record._timeout = null;
    }

    this.requests.delete(requestId);

    return this.toPublic(record);
  }

  toPublic(record) {
    return {
      id: record.id,
      userId: record.userId,
      pickupPoint: record.pickupPoint,
      partySize: record.partySize,
      createdAt: record.createdAt,
      expiresAt: record.expiresAt,
      meta: record.meta,
      status: record.status
    };
  }

  getRequestById(requestId) {
    if (!requestId) return null;
    const record = this.requests.get(requestId);
    if (!record) return null;
    return this.toPublic(record);
  }
}

let storeInstance = new InMemoryRequestStore();

export const __setInMemoryStoreForTests = (ttlMs) => {
  storeInstance = new InMemoryRequestStore(ttlMs || DEFAULT_TTL_MS);
  return storeInstance;
};

export const createRequest = async (payload) => {
  return storeInstance.createRequest(payload);
};

export const getRequestsNear = async (point, radiusMeters) => {
  return storeInstance.getRequestsNear(point, radiusMeters);
};

export const acceptRequest = async (requestId, driverId) => {
  return storeInstance.acceptRequest(requestId, driverId);
};

export const cancelRequest = async (requestId, reason) => {
  return storeInstance.cancelRequest(requestId, reason);
};

export const getRequestById = async (requestId) => {
  return storeInstance.getRequestById(requestId);
};
