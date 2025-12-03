import Trip from "../models/Trip.js";
import Matatu from "../models/Matatu.js";
import User from "../models/User.js";
import { ValidationError, ApiError } from "../utils/errors.js";

export const startTripService = async ({ userId, matatuId, lat, lng }) => {
  if (!userId || !matatuId) {
    throw new ValidationError("Missing userId or matatuId");
  }

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

  const user = await User.findById(userId);
  const matatu = await Matatu.findById(matatuId);

  if (!user || !matatu) {
    throw new ApiError(404, "User or Matatu not found", "NOT_FOUND");
  }

  const trip = await Trip.create({
    user: userId,
    matatu: matatuId,
    startLocation: {
      type: "Point",
      coordinates: [longitude, latitude]
    }
  });

  return trip;
};

export const stopTripService = async ({ id, lat, lng, fare, currency }) => {
  const trip = await Trip.findById(id);

  if (!trip) {
    throw new ApiError(404, "Trip not found", "NOT_FOUND");
  }

  if (trip.status !== "ongoing") {
    throw new ValidationError("Trip is not ongoing");
  }

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

  if (fare == null) {
    throw new ValidationError("Fare is required to stop a trip");
  }

  trip.endTime = new Date();
  trip.endLocation = {
    type: "Point",
    coordinates: [longitude, latitude]
  };
  trip.fare = Number(fare);
  trip.currency = currency || "KES";
  trip.status = "completed";

  await trip.save();

  return trip;
};

export const getTripHistoryService = async (userId) => {
  const trips = await Trip.find({ user: userId })
    .sort({ startTime: -1 })
    .populate("matatu", "plate route");

  return trips;
};
