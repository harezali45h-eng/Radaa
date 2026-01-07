import Matatu from "../models/Matatu.js";
import { ValidationError, ApiError } from "../utils/errors.js";

export const updateMatatuLocationService = async ({ id, lat, lng, io }) => {
  const latitude = Number(lat);
  const longitude = Number(lng);

  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new ValidationError("Invalid latitude or longitude");
  }

  const matatu = await Matatu.findByIdAndUpdate(
    id,
    {
      lastLocation: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      updatedAt: new Date(),
      isOnline: true,
      location: {
        lat: latitude,
        lng: longitude
      },
      lastUpdated: new Date()
    },
    { new: true }
  );

  if (!matatu) {
    throw new ApiError(404, "Matatu not found", "NOT_FOUND");
  }

  if (io) {
    const payload = {
      id: matatu._id,
      plate: matatu.plate,
      coordinates: {
        lat: latitude,
        lng: longitude
      }
    };

    io.to("matatu:all").emit("matatu:update", payload);
    io.to(`matatu:${matatu._id}`).emit("matatu:update", payload);
  }
  return { ok: true };
};

export const registerMatatuService = async ({
  plate,
  route,
  sacco,
  driverName,
  driverPhone
}) => {
  if (!plate || !route) {
    throw new ValidationError("plate and route are required");
  }

  const existing = await Matatu.findOne({ plate });

  if (existing) {
    throw new ValidationError("Matatu with this plate already exists");
  }

  const matatu = await Matatu.create({
    plate,
    route,
    sacco,
    driverName,
    driverPhone,
    isVisible: true
  });

  return matatu;
};

export const getLiveMatatusService = async () => {
  const matatus = await Matatu.find({ isOnline: true, isVisible: true });
  return matatus;
};

export const getMatatuDetailsService = async (id) => {
  const matatu = await Matatu.findById(id);

  if (!matatu) {
    throw new ApiError(404, "Matatu not found", "NOT_FOUND");
  }

  return matatu;
};

export const getMatatuIdentityService = async (id) => {
  const matatu = await Matatu.findById(id).select(
    "plate numberPlate route sacco lastUpdated updatedAt isOnline location photos unverifiedMedia"
  );

  if (!matatu) {
    throw new ApiError(404, "Matatu not found", "NOT_FOUND");
  }

  const now = new Date();

  const sections = {
    exterior: [],
    interior: [],
    cleanliness: [],
    style: [],
    crowd: []
  };

  const photos = Array.isArray(matatu.photos) ? matatu.photos : [];

  let latestPhotoTime = null;

  photos.forEach((photo) => {
    if (!photo || !photo.url) {
      return;
    }

    const rawCategory = photo.category || "exterior";
    const category = sections[rawCategory] ? rawCategory : "exterior";

    const baseObservedAt = photo.observedAt || photo.uploadedAt || matatu.lastUpdated || matatu.updatedAt;
    const observed = baseObservedAt instanceof Date ? baseObservedAt : now;

    const ageMs = now.getTime() - observed.getTime();
    const ageHours = ageMs > 0 ? ageMs / (1000 * 60 * 60) : 0;

    const halfLifeHours = 6;
    const lambda = Math.log(2) / halfLifeHours;
    const freshnessScore = ageHours <= 0 ? 1 : Math.exp(-lambda * ageHours);

    const serialized = {
      id: photo._id ? photo._id.toString() : null,
      url: photo.url,
      category,
      caption: photo.caption || null,
      uploadedAt: photo.uploadedAt || null,
      observedAt: observed,
      freshnessScore
    };

    sections[category].push(serialized);

    if (!latestPhotoTime || observed.getTime() > latestPhotoTime.getTime()) {
      latestPhotoTime = observed;
    }
  });

  Object.keys(sections).forEach((key) => {
    sections[key].sort((a, b) => {
      const aTime = a.observedAt instanceof Date ? a.observedAt.getTime() : 0;
      const bTime = b.observedAt instanceof Date ? b.observedAt.getTime() : 0;
      return bTime - aTime;
    });
  });

  let lastSeenAt = matatu.lastUpdated || matatu.updatedAt || null;

  if (latestPhotoTime && (!lastSeenAt || latestPhotoTime.getTime() > lastSeenAt.getTime())) {
    lastSeenAt = latestPhotoTime;
  }

  return {
    id: matatu._id.toString(),
    plate: matatu.plate || null,
    numberPlate: matatu.numberPlate || null,
    route: matatu.route || null,
    sacco: matatu.sacco || null,
    isOnline: Boolean(matatu.isOnline),
    lastLocation: matatu.location || null,
    lastSeenAt,
    unverifiedMedia: Boolean(matatu.unverifiedMedia),
    gallery: sections
  };
};
