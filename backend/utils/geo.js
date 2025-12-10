export const EARTH_RADIUS_METERS = 6371000;

const toRad = (deg) => (deg * Math.PI) / 180;

export const haversineMeters = (lat1, lng1, lat2, lng2) => {
  if (
    typeof lat1 !== "number" ||
    typeof lng1 !== "number" ||
    typeof lat2 !== "number" ||
    typeof lng2 !== "number"
  ) {
    return Number.NaN;
  }

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
};

export const isValidLatLng = (value) => {
  if (!value || typeof value !== "object") return false;
  const { lat, lng } = value;
  if (typeof lat !== "number" || typeof lng !== "number") return false;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export const normalizeLatLng = (value) => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const latNum = Number(value.lat);
  const lngNum = Number(value.lng);

  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
    return null;
  }

  if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
    return null;
  }

  return { lat: latNum, lng: lngNum };
};

export const encodeTileId = (value, precision = 3) => {
  const normalized = normalizeLatLng(value);
  if (!normalized) return null;

  const factor = 10 ** precision;
  const latKey = Math.round(normalized.lat * factor);
  const lngKey = Math.round(normalized.lng * factor);

  return `${latKey}:${lngKey}`;
};
