import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { AuthError } from "../utils/errors.js";

export const adminAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AuthError("Not authorized, no admin token", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin || admin.role !== "admin") {
      return next(new AuthError("Not authorized as admin", 401));
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(new AuthError("Not authorized, admin token failed", 401));
  }
};
