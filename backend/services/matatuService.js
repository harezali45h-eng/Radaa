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
    driverPhone
  });

  return matatu;
};

export const getLiveMatatusService = async () => {
  const matatus = await Matatu.find({ isOnline: true });
  return matatus;
};

export const getMatatuDetailsService = async (id) => {
  const matatu = await Matatu.findById(id);

  if (!matatu) {
    throw new ApiError(404, "Matatu not found", "NOT_FOUND");
  }

  return matatu;
};
