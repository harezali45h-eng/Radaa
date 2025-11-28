import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ============================
// REGISTER
// ============================
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      handle: "@" + username.toLowerCase().replace(/\s+/g, ""),
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
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
      expiresIn: process.env.JWT_EXPIRES_IN,
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
