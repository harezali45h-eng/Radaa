import Route from "../models/Route.js";
import Matatu from "../models/Matatu.js";
import { isFeatureEnabled } from "../utils/featureFlags.js";
import { FEATURE_FLAG_KEYS } from "../config/featureFlags.js";

const boltFeatureKey = FEATURE_FLAG_KEYS.BOLT_LIVE_MAP_V1;

const ensureBoltEnabled = async () => {
  const enabled = await isFeatureEnabled(boltFeatureKey, "bolt_live_map");
  return Boolean(enabled);
};

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

const computeBearing = (from, to) => {
  const lat1 = degToRad(from.lat);
  const lat2 = degToRad(to.lat);
  const dLng = degToRad(to.lng - from.lng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const bearingRad = Math.atan2(y, x);
  const bearingDeg = (bearingRad * 180) / Math.PI;
  return (bearingDeg + 360) % 360;
};

export const getBoltSuggestions = async (req, res, next) => {
  try {
    const enabled = await ensureBoltEnabled();
    if (!enabled) {
      return res
        .status(404)
        .json({ success: false, message: "Bolt live map feature disabled" });
    }

    const qRaw = (req.query.q || "").toString().trim();
    const limit = Math.min(Math.max(toNumberOrNull(req.query.limit) || 8, 1), 20);

    if (!qRaw) {
      return res.json({
        success: true,
        data: { query: qRaw, suggestions: [], recent: [] },
      });
    }

    const escaped = qRaw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    const routes = await Route.find({
      $or: [{ name: regex }, { aliases: regex }],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const suggestions = routes.map((route) => ({
      id: route._id.toString(),
      primaryText: route.name,
      secondaryText:
        Array.isArray(route.aliases) && route.aliases.length > 0
          ? route.aliases[0]
          : undefined,
      type: "route",
      routeId: route._id.toString(),
      location: null,
    }));

    const recent = await Route.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentItems = recent.map((route) => ({
      id: route._id.toString(),
      primaryText: route.name,
      secondaryText:
        Array.isArray(route.aliases) && route.aliases.length > 0
          ? route.aliases[0]
          : undefined,
      type: "recent",
      routeId: route._id.toString(),
      location: null,
    }));

    return res.json({
      success: true,
      data: {
        query: qRaw,
        suggestions,
        recent: recentItems,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const mapMatatuToProfile = (matatu, routeName) => {
  const lat = matatu.location?.lat ?? null;
  const lng = matatu.location?.lng ?? null;

  let location =
    lat != null && lng != null
      ? { lat, lng }
      : null;

  if (
    !location &&
    matatu.lastLocation &&
    Array.isArray(matatu.lastLocation.coordinates) &&
    matatu.lastLocation.coordinates.length === 2
  ) {
    const [lng0, lat0] = matatu.lastLocation.coordinates;
    location = { lat: lat0, lng: lng0 };
  }

  const approvedPhotos = Array.isArray(matatu.photos)
    ? matatu.photos.filter((p) => p && p.status === "approved")
    : [];

  const photos = approvedPhotos
    .map((p) => p.url)
    .filter((url) => typeof url === "string" && url.length > 0);

  const speedKph =
    typeof matatu.speed === "number" && Number.isFinite(matatu.speed)
      ? matatu.speed
      : null;

  const lastUpdatedRaw = matatu.lastUpdated || matatu.updatedAt || null;
  const lastUpdated =
    lastUpdatedRaw && typeof lastUpdatedRaw.toISOString === "function"
      ? lastUpdatedRaw.toISOString()
      : null;

  return {
    id: matatu._id.toString(),
    plate: matatu.plate,
    numberPlate: matatu.numberPlate || undefined,
    sacco: matatu.sacco || null,
    route: routeName || matatu.route || null,
    speedKph,
    bearing: null,
    location,
    lastUpdated,
    photos: photos.length > 0 ? photos : null,
  };
};

export const getBoltRouteMatatus = async (req, res, next) => {
  try {
    const enabled = await ensureBoltEnabled();
    if (!enabled) {
      return res
        .status(404)
        .json({ success: false, message: "Bolt live map feature disabled" });
    }

    const { routeId } = req.params;

    const route = await Route.findById(routeId).lean();

    if (!route) {
      return res
        .status(404)
        .json({ success: false, message: "Route not found" });
    }

    const routeNames = [route.name];
    if (Array.isArray(route.aliases)) {
      route.aliases.forEach((alias) => {
        if (typeof alias === "string" && alias.trim().length > 0) {
          routeNames.push(alias.trim());
        }
      });
    }

    const matatus = await Matatu.find({ route: { $in: routeNames } })
      .lean();

    const profiles = matatus.map((m) => mapMatatuToProfile(m, route.name));

    return res.json({ success: true, data: profiles });
  } catch (error) {
    return next(error);
  }
};

export const getBoltLive = async (req, res, next) => {
  try {
    const enabled = await ensureBoltEnabled();
    if (!enabled) {
      return res
        .status(404)
        .json({ success: false, message: "Bolt live map feature disabled" });
    }

    const rawLimit = toNumberOrNull(req.query.limit);
    const limit = Math.min(Math.max(rawLimit || 400, 1), 1000);

    const rawBbox = (req.query.bbox || "").toString().trim();
    let bounds = null;

    if (rawBbox) {
      const parts = rawBbox.split(",").map((part) => Number(part.trim()));
      if (parts.length === 4 && parts.every((value) => Number.isFinite(value))) {
        const [minLng, minLat, maxLng, maxLat] = parts;
        bounds = { minLat, maxLat, minLng, maxLng };
      }
    }

    const query = { isOnline: true };

    const matatus = await Matatu.find(query)
      .select(
        "plate numberPlate sacco route location lastLocation speed lastUpdated updatedAt",
      )
      .lean();

    const items = [];

    for (const m of matatus) {
      const profile = mapMatatuToProfile(m, null);

      if (bounds && profile.location) {
        const { lat, lng } = profile.location;
        if (
          lat < bounds.minLat ||
          lat > bounds.maxLat ||
          lng < bounds.minLng ||
          lng > bounds.maxLng
        ) {
          continue;
        }
      }

      if (profile.location && m.lastLocation && Array.isArray(m.lastLocation.coordinates)) {
        const coords = m.lastLocation.coordinates;
        if (coords.length === 2) {
          const from = { lat: coords[1], lng: coords[0] };
          const to = profile.location;
          if (from.lat !== to.lat || from.lng !== to.lng) {
            profile.bearing = computeBearing(from, to);
          }
        }
      }

      items.push(profile);
      if (items.length >= limit) break;
    }

    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
};
