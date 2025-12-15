import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/helpers.js";

// ============================
// REGISTER
// ============================
export const registerUser = async (req, res) => {
  try {
    console.log("[AUTH] /auth/register body:", JSON.stringify(req.body));

    const {
      username,
      email,
      password,
      phone,
      handle: rawHandle,
      role: rawRole,
      saccoName,
      vehicleRegistration,
      licenseNumber,
    } = req.body || {};

    if (!username || typeof username !== "string") {
      return res
        .status(400)
        .json({ message: "Username is required" });
    }

    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ message: "Email is required" });
    }

    if (!password || typeof password !== "string") {
      return res
        .status(400)
        .json({ message: "Password is required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const role = (rawRole ? String(rawRole) : "user").trim().toLowerCase();

    if (!["user", "driver"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Must be 'user' or 'driver'" });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const msg = "Email already exists";
      return res.status(400).json({ error: msg, message: msg });
    }

    let handle = rawHandle;

    if (typeof handle === "string" && handle.trim().length > 0) {
      const trimmed = handle.trim().toLowerCase();
      const withoutAt = trimmed.replace(/^@+/, "");
      handle = "@" + withoutAt.replace(/\s+/g, "");
    } else {
      handle =
        "@" +
        username
          .toString()
          .toLowerCase()
          .replace(/\s+/g, "");
    }

    const existingHandle = await User.findOne({ handle });
    if (existingHandle) {
      const msg = "Handle already exists";
      return res.status(400).json({ error: msg, message: msg });
    }

    const userData = {
      username,
      email: normalizedEmail,
      password,
      phone,
      handle,
      role,
    };

    if (role === "driver") {
      userData.driverProfile = {
        saccoName: saccoName || undefined,
        vehicleRegistration: vehicleRegistration || undefined,
        licenseNumber: licenseNumber || undefined,
      };
    }

    const user = await User.create(userData);

    const normalizedRole = (user.role || role || "user").toLowerCase();

    const token = generateToken(user._id, normalizedRole);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      handle: user.handle,
      role: normalizedRole,
      enabled: user.enabled,
      driverProfile: user.driverProfile,
      driverVerificationStatus: user.driverVerificationStatus,
      driverStatus: user.driverStatus,
      saccoProfile: user.saccoProfile,
      token,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    // Duplicate key (e.g. race condition on email/handle uniqueness)
    if (err && err.code === 11000) {
      const key = Object.keys(err.keyPattern || {})[0] || "field";
      const base = `${key.charAt(0).toUpperCase()}${key.slice(1)} already exists`;
      const msg = key === "email" ? "Email already exists" : base;
      return res.status(400).json({ error: msg, message: msg });
    }

    res.status(500).json({ message: "Register server error" });
  }
};

// ============================
// LOGIN
// ============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    console.log("[AUTH] /auth/login body:", JSON.stringify({ email }));

    if (!email || typeof email !== "string" || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const normalizedRole = (user.role || "user").toLowerCase();

    if (normalizedRole === "driver") {
      let shouldSave = false;

      if (!user.driverProfile || typeof user.driverProfile !== "object") {
        user.driverProfile = {};
        shouldSave = true;
      }

      if (!user.driverVerificationStatus) {
        user.driverVerificationStatus = "pending";
        shouldSave = true;
      }

      if (!user.driverStatus) {
        user.driverStatus = "provisional";
        shouldSave = true;
      }

      if (shouldSave) {
        await user.save();
      }
    }

    const token = generateToken(user._id, normalizedRole);

    res.json({
      _id: user._id,
      email: user.email,
      username: user.username,
      phone: user.phone,
      handle: user.handle,
      role: normalizedRole,
      enabled: user.enabled,
      driverProfile: user.driverProfile,
      driverVerificationStatus: user.driverVerificationStatus,
      driverStatus: user.driverStatus,
      saccoProfile: user.saccoProfile,
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login server error" });
  }
};

// ============================
// PROFILE
// ============================
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const user = await User.findById(userId).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const normalizedRole = (user.role || "user").toLowerCase();

    if (normalizedRole === "driver") {
      let shouldSave = false;

      if (!user.driverProfile || typeof user.driverProfile !== "object") {
        user.driverProfile = {};
        shouldSave = true;
      }

      if (!user.driverVerificationStatus) {
        user.driverVerificationStatus = "pending";
        shouldSave = true;
      }

      if (!user.driverStatus) {
        user.driverStatus = "provisional";
        shouldSave = true;
      }

      if (shouldSave) {
        await user.save();
      }
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      handle: user.handle,
      role: normalizedRole,
      enabled: user.enabled,
      driverProfile: user.driverProfile,
      driverVerificationStatus: user.driverVerificationStatus,
      driverStatus: user.driverStatus,
      saccoProfile: user.saccoProfile,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Profile server error" });
  }
};
