import mongoose from "mongoose";
import { FEATURE_FLAG_KEYS, featureFlagDefaults } from "../config/featureFlags.js";

const COLLECTION_NAME = "feature_flags";

const getCollection = () => {
  const connection = mongoose.connection;
  if (!connection || !connection.db) {
    return null;
  }
  return connection.db.collection(COLLECTION_NAME);
};

const REDIS_URL = process.env.UPSTASH_REDIS_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN;
const HAS_REDIS = Boolean(REDIS_URL && REDIS_TOKEN);
const REDIS_ALL_FLAGS_KEY = "radaa:feature_flags:all";

const redisFetch = async (command) => {
  if (!HAS_REDIS || typeof fetch !== "function") {
    return null;
  }

  try {
    const response = await fetch(REDIS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(command)
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data?.result ?? null;
  } catch {
    return null;
  }
};

const readAllFlagsFromRedis = async () => {
  const raw = await redisFetch(["GET", REDIS_ALL_FLAGS_KEY]);
  if (!raw || typeof raw !== "string") {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
};

const writeAllFlagsToRedis = async (value) => {
  if (!HAS_REDIS || typeof fetch !== "function") {
    return;
  }

  try {
    await redisFetch(["SET", REDIS_ALL_FLAGS_KEY, JSON.stringify(value)]);
  } catch {
    // ignore caching errors
  }
};

const hashToPercent = (input) => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  return positive % 100;
};

export const getAllFeatureFlagStates = async () => {
  const keys = Object.values(FEATURE_FLAG_KEYS);

  const cached = await readAllFlagsFromRedis();
  if (cached && typeof cached === "object") {
    return cached;
  }

  const collection = getCollection();

  const docByKey = new Map();

  if (collection) {
    try {
      const docs = await collection.find({ key: { $in: keys } }).toArray();
      docs.forEach((doc) => {
        if (doc && doc.key) {
          docByKey.set(doc.key, doc);
        }
      });
    } catch {
      // If we cannot read from the collection, fall back entirely to defaults
    }
  }

  const result = {};

  keys.forEach((key) => {
    const defaultConfig = featureFlagDefaults[key] || { enabled: false, rolloutPercent: 0 };
    const doc = docByKey.get(key) || null;

    const envEnabled = Boolean(defaultConfig.enabled);
    const dbEnabled =
      typeof doc?.enabled === "boolean" ? doc.enabled : null;

    // Env fallbacks act as a systemwide minimum: if env says ON, do not
    // allow a stored document to disable the flag. DB can still turn flags
    // ON even when env fallback is false.
    const enabled = envEnabled || dbEnabled === true;

    const rolloutPercentFromDb =
      typeof doc?.rollout_percent === "number" ? doc.rollout_percent : null;

    const rolloutPercent =
      rolloutPercentFromDb != null
        ? rolloutPercentFromDb
        : Number(defaultConfig.rolloutPercent) || 0;

    result[key] = {
      enabled,
      rolloutPercent
    };
  });

  await writeAllFlagsToRedis(result);

  return result;
};

export const isFeatureEnabled = async (key, userId = null) => {
  if (!Object.values(FEATURE_FLAG_KEYS).includes(key)) {
    return false;
  }

  const states = await getAllFeatureFlagStates();
  const state = states[key];

  if (!state || !state.enabled) {
    return false;
  }

  const rolloutPercent = Number(state.rolloutPercent) || 0;

  if (!rolloutPercent || rolloutPercent >= 100 || !userId) {
    return true;
  }

  const seed = `${key}:${userId}`;
  const bucket = hashToPercent(seed);

  return bucket < rolloutPercent;
};
