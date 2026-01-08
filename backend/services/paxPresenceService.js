import { Redis } from "@upstash/redis";

// Lightweight presence store for passengers (pax). This is designed to be
// used by the realtime socket layer and intentionally keeps **only**
// presence/location data, fully decoupled from ride request / matching
// logic.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

let redisClient = null;

if (UPSTASH_URL && UPSTASH_TOKEN) {
  try {
    redisClient = new Redis({
      url: UPSTASH_URL,
      token: UPSTASH_TOKEN,
    });
    // eslint-disable-next-line no-console
    console.log("[presence] Using Upstash Redis for pax presence");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      "[presence] Failed to initialize Upstash Redis, falling back to in-memory store",
      error,
    );
    redisClient = null;
  }
} else {
  // eslint-disable-next-line no-console
  console.log(
    "[presence] Upstash Redis env not fully configured; using in-memory presence store",
  );
}

// Fallback in-memory store used when Redis is not available or as a
// best-effort cache.
const localPresence = new Map(); // passengerId -> { passengerId, location, updatedAt }

const PRESENCE_KEY = "pax:presence";

const toPresenceEntry = (passengerId, data) => {
  if (!passengerId) return null;

  if (!data || typeof data !== "object") {
    return {
      passengerId,
      location: null,
      updatedAt: new Date().toISOString(),
    };
  }

  const { lat, lng, updatedAt } = data;

  const hasLocation = typeof lat === "number" && typeof lng === "number";

  return {
    passengerId,
    location: hasLocation ? { lat, lng } : null,
    updatedAt: updatedAt || new Date().toISOString(),
  };
};

export const upsertPassengerPresence = async (passengerId, data) => {
  if (!passengerId) return;

  const entry = toPresenceEntry(passengerId.toString(), data);
  if (!entry) return;

  localPresence.set(passengerId.toString(), entry);

  if (!redisClient) return;

  try {
    await redisClient.hset(PRESENCE_KEY, {
      [passengerId.toString()]: JSON.stringify(entry),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[presence] upsertPassengerPresence Redis error", error);
  }
};

export const deletePassengerPresence = async (passengerId) => {
  if (!passengerId) return;

  localPresence.delete(passengerId.toString());

  if (!redisClient) return;

  try {
    await redisClient.hdel(PRESENCE_KEY, passengerId.toString());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[presence] deletePassengerPresence Redis error", error);
  }
};

export const listPassengerPresence = async () => {
  // Prefer Redis if configured; otherwise fall back to in-memory map.
  if (!redisClient) {
    return Array.from(localPresence.values());
  }

  try {
    const raw = await redisClient.hgetall(PRESENCE_KEY);
    if (!raw || typeof raw !== "object") {
      return Array.from(localPresence.values());
    }

    const entries = [];
    for (const [passengerId, value] of Object.entries(raw)) {
      if (!passengerId) continue;

      let parsed;
      try {
        parsed = typeof value === "string" ? JSON.parse(value) : value;
      } catch {
        parsed = null;
      }

      const entry = toPresenceEntry(passengerId, parsed || undefined);
      if (entry) {
        entries.push(entry);
        localPresence.set(passengerId.toString(), entry);
      }
    }

    return entries;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[presence] listPassengerPresence Redis error", error);
    return Array.from(localPresence.values());
  }
};

export const clearAllPassengerPresence = async () => {
  localPresence.clear();

  if (!redisClient) return;

  try {
    await redisClient.del(PRESENCE_KEY);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[presence] clearAllPassengerPresence Redis error", error);
  }
};
