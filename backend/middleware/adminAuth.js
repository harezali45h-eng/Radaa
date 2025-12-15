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

    const adminId = decoded && (decoded.id || decoded.sub || decoded._id);

    if (!adminId) {
      return next(
        new AuthError("Not authorized, invalid admin token payload", 401),
      );
    }

    const role = decoded.role ? String(decoded.role).trim().toLowerCase() : undefined;

    if (role !== "admin") {
      return next(new AuthError("Not authorized as admin", 401));
    }

    const admin = await Admin.findById(adminId).select("-password");

    if (!admin || admin.role !== "admin") {
      return next(new AuthError("Not authorized as admin", 401));
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(new AuthError("Not authorized, admin token failed", 401));
  }
};
