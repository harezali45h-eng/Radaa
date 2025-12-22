import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { haversineMeters } from "../utils/geo.js";

const STAGE_RADIUS_METERS = 200;
const CORRIDOR_RADIUS_METERS = 200;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedFeatures = null;
let cachedMtimeMs = 0;

const KAREN_CITY_STADIUM_CORRIDOR_ID = "corridor-karen-city-stadium";
const KAREN_CITY_STADIUM_CORRIDOR_NAME = "Karen  City Stadium Corridor";

const buildKarenCityStadiumCoordinates = () => {
  const start = { lat: -1.320853, lng: 36.684936 };
  const end = { lat: -1.289666, lng: 36.838664 };
  const segments = 50;
  const coords = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const lat = start.lat + (end.lat - start.lat) * t;
    const lng = start.lng + (end.lng - start.lng) * t;
    coords.push({ lat, lng });
  }

  return coords;
};

const KAREN_CITY_STADIUM_COORDS = buildKarenCityStadiumCoordinates();

const ensureLoadedFeatures = async () => {
  const rootDir = path.resolve(__dirname, "..", "..");
  const filePath = path.join(rootDir, "data", "final_stages.json");

  const stats = await fs.promises.stat(filePath);

  if (!cachedFeatures || cachedMtimeMs !== stats.mtimeMs) {
    const raw = await fs.promises.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      parsed.type !== "FeatureCollection" ||
      !Array.isArray(parsed.features)
    ) {
      throw new Error(
        "final_stages.json must be a GeoJSON FeatureCollection with a features array"
      );
    }

    cachedFeatures = parsed.features;
    cachedMtimeMs = stats.mtimeMs;
  }

  return cachedFeatures;
};

const computeDistanceToLineString = (point, coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  let best = Number.POSITIVE_INFINITY;

  coordinates.forEach((coord) => {
    if (!Array.isArray(coord) || coord.length !== 2) return;
    const lng = Number(coord[0]);
    const lat = Number(coord[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const d = haversineMeters(point.lat, point.lng, lat, lng);
    if (Number.isFinite(d) && d < best) {
      best = d;
    }
  });

  return best;
};

const computeDistanceToPolylineLatLng = (point, coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
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

export const findNearestStageOrCorridor = async (point, options = {}) => {
  const stageThresholdMeters = Number.isFinite(Number(options.stageThresholdMeters))
    ? Number(options.stageThresholdMeters)
    : STAGE_RADIUS_METERS;

  const corridorThresholdMeters = Number.isFinite(Number(options.corridorThresholdMeters))
    ? Number(options.corridorThresholdMeters)
    : CORRIDOR_RADIUS_METERS;

  if (!point || typeof point.lat !== "number" || typeof point.lng !== "number") {
    return {
      valid: false,
      nearestStage: null,
      nearestCorridor: null,
      distanceToStage: Number.POSITIVE_INFINITY,
      distanceToCorridor: Number.POSITIVE_INFINITY,
      distanceMeters: Number.POSITIVE_INFINITY
    };
  }

  const features = await ensureLoadedFeatures();

  let nearestStage = null;
  let bestStageDist = Number.POSITIVE_INFINITY;
  let nearestCorridor = null;
  let bestCorridorDist = Number.POSITIVE_INFINITY;

  features.forEach((feature, index) => {
    if (!feature || !feature.geometry) return;

    const geometry = feature.geometry;
    const props = feature.properties || {};
    const baseId =
      props.id || props._id || props["@id"] || feature.id || null;
    const baseName =
      typeof props.name === "string"
        ? props.name
        : typeof props.stage_name === "string"
        ? props.stage_name
        : typeof props.route_name === "string"
        ? props.route_name
        : typeof props.road_name === "string"
        ? props.road_name
        : null;

    if (
      geometry.type === "Point" &&
      Array.isArray(geometry.coordinates) &&
      geometry.coordinates.length === 2
    ) {
      const lng = Number(geometry.coordinates[0]);
      const lat = Number(geometry.coordinates[1]);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const d = haversineMeters(point.lat, point.lng, lat, lng);
      if (Number.isFinite(d) && d < bestStageDist) {
        bestStageDist = d;
        nearestStage = {
          id: String(baseId || `stage-${index}`),
          name: baseName,
          lat,
          lng
        };
      }
    } else if (geometry.type === "LineString" && Array.isArray(geometry.coordinates)) {
      const d = computeDistanceToLineString(point, geometry.coordinates);
      if (Number.isFinite(d) && d < bestCorridorDist) {
        bestCorridorDist = d;
        const coordsLatLng = geometry.coordinates
          .filter(
            (coord) =>
              Array.isArray(coord) &&
              coord.length === 2 &&
              Number.isFinite(Number(coord[0])) &&
              Number.isFinite(Number(coord[1]))
          )
          .map((coord) => ({ lat: Number(coord[1]), lng: Number(coord[0]) }));

        nearestCorridor = {
          id: String(baseId || `corridor-${index}`),
          name: baseName,
          coordinates: coordsLatLng
        };
      }
    }
  });

  const kcDistance = computeDistanceToPolylineLatLng(point, KAREN_CITY_STADIUM_COORDS);

  if (Number.isFinite(kcDistance) && kcDistance < bestCorridorDist) {
    bestCorridorDist = kcDistance;
    nearestCorridor = {
      id: KAREN_CITY_STADIUM_CORRIDOR_ID,
      name: KAREN_CITY_STADIUM_CORRIDOR_NAME,
      coordinates: KAREN_CITY_STADIUM_COORDS
    };
  }

  const nearStage =
    nearestStage &&
    Number.isFinite(bestStageDist) &&
    bestStageDist <= stageThresholdMeters;

  const nearCorridor =
    nearestCorridor &&
    Number.isFinite(bestCorridorDist) &&
    bestCorridorDist <= corridorThresholdMeters;

  const distanceMeters = Math.min(bestStageDist, bestCorridorDist);

  return {
    valid: Boolean(nearStage || nearCorridor),
    nearestStage: nearStage ? nearestStage : null,
    nearestCorridor: nearCorridor ? nearestCorridor : null,
    distanceToStage: Number.isFinite(bestStageDist)
      ? bestStageDist
      : Number.POSITIVE_INFINITY,
    distanceToCorridor: Number.isFinite(bestCorridorDist)
      ? bestCorridorDist
      : Number.POSITIVE_INFINITY,
    distanceMeters: Number.isFinite(distanceMeters)
      ? distanceMeters
      : Number.POSITIVE_INFINITY
  };
};

export const STAGE_DISTANCE_THRESHOLD_METERS = STAGE_RADIUS_METERS;
export const CORRIDOR_DISTANCE_THRESHOLD_METERS = CORRIDOR_RADIUS_METERS;
export const KAREN_CITY_STADIUM_CORRIDOR = {
  id: KAREN_CITY_STADIUM_CORRIDOR_ID,
  name: KAREN_CITY_STADIUM_CORRIDOR_NAME,
  coordinates: KAREN_CITY_STADIUM_COORDS
};
