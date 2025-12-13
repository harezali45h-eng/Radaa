import Matatu from "../models/Matatu.js";
import { AuthError, ValidationError } from "../utils/errors.js";

export const changeDriverVehicle = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user || user.role !== "driver") {
      throw new AuthError("Driver access required", 403);
    }

    const driverId = user._id;
    const phone = user.phone;

    const { plate, route, sacco, driverName } = req.body || {};

    if (!plate || !route) {
      throw new ValidationError("plate and route are required");
    }

    if (!phone || typeof phone !== "string") {
      throw new ValidationError("Driver phone is required for vehicle change");
    }

    const existingWithPlate = await Matatu.findOne({ plate });

    if (existingWithPlate) {
      throw new ValidationError("Matatu with this plate already exists");
    }

    await Matatu.updateMany(
      {
        driverPhone: phone,
        driverStatus: { $in: ["provisional", "active"] },
      },
      {
        $set: {
          driverStatus: "suspended",
          isOnline: false,
        },
      },
    );

    const conflicting = await Matatu.findOne({
      driverPhone: phone,
      driverStatus: { $in: ["provisional", "active"] },
    });

    if (conflicting) {
      throw new ValidationError(
        "Driver already has an active or provisional vehicle linked to this phone",
      );
    }

    const matatu = await Matatu.create({
      plate,
      route,
      sacco:
        sacco ||
        (user.driverProfile && user.driverProfile.saccoName) ||
        undefined,
      driverName: driverName || user.username || undefined,
      driverPhone: phone,
      approvalStatus: "pending",
      driverStatus: "provisional",
      unverifiedMedia: true,
    });

    return res.status(201).json({
      success: true,
      data: matatu,
    });
  } catch (error) {
    return next(error);
  }
};
