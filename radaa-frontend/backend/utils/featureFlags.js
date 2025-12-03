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

const hashToPercent = (input) => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  return positive % 100;
};

export const isFeatureEnabled = async (key, userId = null) => {
  if (!Object.values(FEATURE_FLAG_KEYS).includes(key)) {
    return false;
  }

  const collection = getCollection();

  let flagDoc = null;
  if (collection) {
    try {
      flagDoc = await collection.findOne({ key });
    } catch {
      flagDoc = null;
    }
  }

  const defaultConfig = featureFlagDefaults[key] || { enabled: false, rolloutPercent: 0 };

  const enabled =
    typeof flagDoc?.enabled === "boolean" ? flagDoc.enabled : Boolean(defaultConfig.enabled);

  if (!enabled) {
    return false;
  }

  const rolloutPercentFromDb =
    typeof flagDoc?.rollout_percent === "number" ? flagDoc.rollout_percent : null;

  const rolloutPercent =
    rolloutPercentFromDb != null ? rolloutPercentFromDb : Number(defaultConfig.rolloutPercent) || 0;

  if (!rolloutPercent || rolloutPercent >= 100) {
    return true;
  }

  const seed = userId ? `${key}:${userId}` : `${key}:${Math.random().toString(36).slice(2)}`;
  const bucket = hashToPercent(seed);

  return bucket < rolloutPercent;
};

export const getAllFeatureFlagStates = async () => {
  const keys = Object.values(FEATURE_FLAG_KEYS);
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

    const enabled =
      typeof doc?.enabled === "boolean" ? doc.enabled : Boolean(defaultConfig.enabled);

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

  return result;
};
