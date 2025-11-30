import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ============================
// REGISTER
// ============================
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone, handle: rawHandle } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

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
      return res.status(400).json({ message: "Handle already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
      phone,
      handle,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      handle: user.handle,
      token,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    // Duplicate key (e.g. race condition on email/handle uniqueness)
    if (err && err.code === 11000) {
      const key = Object.keys(err.keyPattern || {})[0] || "field";
      return res
        .status(400)
        .json({ message: `${key.charAt(0).toUpperCase()}${key.slice(1)} already exists` });
    }

    res.status(500).json({ message: "Register server error" });
  }
};

// ============================
// LOGIN
// ============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      _id: user._id,
      email: user.email,
      username: user.username,
      phone: user.phone,
      handle: user.handle,
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
    const user = await User.findById(req.user.id).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      handle: user.handle,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Profile server error" });
  }
};
