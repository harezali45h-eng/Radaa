import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Matatu from "../models/Matatu.js";
import RidePayment from "../models/RidePayment.js";
import Trip from "../models/Trip.js";
import { ValidationError, AuthError } from "../utils/errors.js";
import { generateToken } from "../utils/helpers.js";

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError("Please provide email and password");
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw new AuthError("Invalid admin credentials", 401);
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      throw new AuthError("Invalid admin credentials", 401);
    }

    const token = generateToken(admin._id);

    res.json({
      _id: admin._id,
      email: admin.email,
      role: admin.role,
      token
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (error) {
    next(error);
  }
};

export const getMatatuStats = async (req, res, next) => {
  try {
    const totalMatatus = await Matatu.countDocuments();
    res.json({ totalMatatus });
  } catch (error) {
    next(error);
  }
};

export const getRideStats = async (req, res, next) => {
  try {
    const totalRides = await RidePayment.countDocuments();
    res.json({ totalRides });
  } catch (error) {
    next(error);
  }
};

export const getFreeRideStats = async (req, res, next) => {
  try {
    const totalFreeRides = await RidePayment.countDocuments({ status: "free" });
    res.json({ totalFreeRides });
  } catch (error) {
    next(error);
  }
};

export const getActiveTripsStats = async (req, res, next) => {
  try {
    const activeTrips = await Trip.countDocuments({ status: "ongoing" });
    res.json({ activeTrips });
  } catch (error) {
    next(error);
  }
};
