import RideRequest from "../models/RideRequest.js";
import { ValidationError, AuthError } from "../utils/errors.js";
import { emitDriverScoreUpdate, emitPassengerScoreUpdate } from "../realtime/socket.js";

const ensureDriver = (user) => {
  if (!user || (user.role !== "driver" && user.role !== "admin")) {
    throw new AuthError("Driver access required", 403);
  }
};

const ensureUserOrAdmin = (user, userId) => {
  if (!user) {
    throw new AuthError("Not authorized", 401);
  }

  if (user.role === "admin") {
    return;
  }

  if (user._id.toString() !== userId.toString()) {
    throw new AuthError("Not authorized", 403);
  }
};

export const createRideRequest = async (req, res, next) => {
  try {
    const { pickup, destination, saccoId, matatuId } = req.body || {};

    if (!pickup || typeof pickup.lat !== "number" || typeof pickup.lng !== "number") {
      throw new ValidationError("pickup with lat and lng is required");
    }

    const pickupPoint = {
      type: "Point",
      coordinates: [pickup.lng, pickup.lat]
    };

    let destinationPoint;
    if (destination && typeof destination.lat === "number" && typeof destination.lng === "number") {
      destinationPoint = {
        type: "Point",
        coordinates: [destination.lng, destination.lat]
      };
    }

    const ride = await RideRequest.create({
      requester: req.user._id,
      matatu: matatuId || null,
      pickup: pickupPoint,
      destination: destinationPoint,
      saccoId: saccoId || null
    });

    const io = req.app.get("io");
    if (io) {
      io.to("drivers:nearby").emit("ride:created", {
        id: ride._id.toString(),
        pickup: ride.pickup,
        requester: ride.requester.toString()
      });
    }

    res.status(201).json({
      success: true,
      message: "Ride request created",
      data: ride
    });
  } catch (error) {
    next(error);
  }
};

export const getNearbyRideRequests = async (req, res, next) => {
  try {
    ensureDriver(req.user);

    const { lat, lng, radius } = req.query;

    const latNum = typeof lat === "string" ? Number(lat) : NaN;
    const lngNum = typeof lng === "string" ? Number(lng) : NaN;
    const radiusNum = typeof radius === "string" ? Number(radius) : 2000;

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      throw new ValidationError("lat and lng query parameters are required and must be numbers");
    }

    const rides = await RideRequest.find({
      status: "pending",
      pickup: {
        $near: {
          $geometry: { type: "Point", coordinates: [lngNum, latNum] },
          $maxDistance: radiusNum
        }
      }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: rides
    });
  } catch (error) {
    next(error);
  }
};

export const acceptRideRequest = async (req, res, next) => {
  try {
    ensureDriver(req.user);

    const { id } = req.params;

    const ride = await RideRequest.findOneAndUpdate(
      { _id: id, status: "pending" },
      {
        $set: {
          assignedDriver: req.user._id,
          status: "assigned"
        }
      },
      { new: true }
    );

    if (!ride) {
      throw new ValidationError("Ride is no longer available");
    }

    const io = req.app.get("io");
    if (io) {
      const requesterRoom = `user:${ride.requester.toString()}`;
      const driverRoom = `driver:${req.user._id.toString()}`;

      io.to(requesterRoom).emit("ride:assigned", {
        id: ride._id.toString(),
        driverId: req.user._id.toString(),
        matatuId: ride.matatu ? ride.matatu.toString() : null
      });

      io.to(driverRoom).emit("ride:assigned", {
        id: ride._id.toString(),
        driverId: req.user._id.toString(),
        matatuId: ride.matatu ? ride.matatu.toString() : null
      });

      emitDriverScoreUpdate(io, req.user._id.toString());
      emitPassengerScoreUpdate(io, ride.requester.toString());
    }

    res.json({
      success: true,
      message: "Ride accepted",
      data: ride
    });
  } catch (error) {
    next(error);
  }
};

export const cancelRideRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ride = await RideRequest.findById(id);

    if (!ride) {
      throw new ValidationError("Ride request not found");
    }

    const isOwner = ride.requester.toString() === req.user._id.toString();
    const isDriver = ride.assignedDriver && ride.assignedDriver.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isDriver && !isAdmin) {
      throw new AuthError("Not authorized to cancel this ride", 403);
    }

    ride.status = "cancelled";
    await ride.save();

    res.json({
      success: true,
      message: "Ride cancelled",
      data: ride
    });
  } catch (error) {
    next(error);
  }
};

export const getUserRides = async (req, res, next) => {
  try {
    const { id } = req.params;

    ensureUserOrAdmin(req.user, id);

    const rides = await RideRequest.find({ requester: id })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      data: rides
    });
  } catch (error) {
    next(error);
  }
};

export const getDriverAssignedRides = async (req, res, next) => {
  try {
    ensureDriver(req.user);

    const rides = await RideRequest.find({
      assignedDriver: req.user._id,
      status: { $in: ["assigned", "ongoing"] }
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: rides
    });
  } catch (error) {
    next(error);
  }
};
