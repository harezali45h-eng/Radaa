import Matatu from "../models/Matatu.js";

const toRad = (deg) => (deg * Math.PI) / 180;

const haversineDistanceMeters = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const assignNearestMatatu = async ({
  passengerLocation,
  activeDrivers
}) => {
  if (
    !passengerLocation ||
    typeof passengerLocation.lat !== "number" ||
    typeof passengerLocation.lng !== "number"
  ) {
    return null;
  }

  const lat = passengerLocation.lat;
  const lng = passengerLocation.lng;

  const driverIds = Array.isArray(activeDrivers) ? activeDrivers : [];

  if (driverIds.length === 0) {
    return null;
  }

  const matatus = await Matatu.find({
    driver: { $in: driverIds.map((id) => id.toString()) },
    isOnline: true
  })
    .select("_id driver location lastLocation sacco")
    .lean();

  if (!matatus || matatus.length === 0) {
    return null;
  }

  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const m of matatus) {
    const loc =
      (m.location &&
        typeof m.location.lat === "number" &&
        typeof m.location.lng === "number" && {
          lat: m.location.lat,
          lng: m.location.lng
        }) ||
      (Array.isArray(m.lastLocation?.coordinates) &&
        m.lastLocation.coordinates.length === 2 && {
          lng: m.lastLocation.coordinates[0],
          lat: m.lastLocation.coordinates[1]
        });

    if (!loc) continue;

    const distance = haversineDistanceMeters(lat, lng, loc.lat, loc.lng);

    if (Number.isFinite(distance) && distance < bestDistance) {
      bestDistance = distance;
      best = {
        driverId: m.driver || null,
        matatuId: m._id.toString(),
        distanceMeters: distance,
        saccoId: m.sacco || null
      };
    }
  }

  return best;
};
