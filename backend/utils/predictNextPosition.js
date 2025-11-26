const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

const EARTH_RADIUS_METERS = 6371000;

export const predictNextPosition = ({ origin, bearingDegrees, distanceMeters }) => {
  if (
    !origin ||
    typeof origin.lat !== "number" ||
    typeof origin.lng !== "number" ||
    !Number.isFinite(bearingDegrees) ||
    !Number.isFinite(distanceMeters) ||
    distanceMeters <= 0
  ) {
    return origin || null;
  }

  const lat1 = toRad(origin.lat);
  const lng1 = toRad(origin.lng);
  const bearing = toRad(bearingDegrees);
  const dByR = distanceMeters / EARTH_RADIUS_METERS;

  const sinLat1 = Math.sin(lat1);
  const cosLat1 = Math.cos(lat1);
  const sinD = Math.sin(dByR);
  const cosD = Math.cos(dByR);

  const sinLat2 = sinLat1 * cosD + cosLat1 * sinD * Math.cos(bearing);
  const lat2 = Math.asin(Math.min(1, Math.max(-1, sinLat2)));

  const y = Math.sin(bearing) * sinD * cosLat1;
  const x = cosD - sinLat1 * sinLat2;
  const lng2 = lng1 + Math.atan2(y, x);

  const normalizedLng = ((toDeg(lng2) + 540) % 360) - 180;

  return {
    lat: toDeg(lat2),
    lng: normalizedLng
  };
};
