import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AuthError } from "../utils/errors.js";

export const requireAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AuthError("Not authorized, no token", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded && (decoded.id || decoded.sub || decoded._id);

    if (!userId) {
      return next(new AuthError("Not authorized, invalid token payload", 401));
    }

    const role = decoded.role ? String(decoded.role).trim().toLowerCase() : undefined;

    if (!role) {
      return next(new AuthError("Not authorized, token missing role", 401));
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new AuthError("Not authorized, user not found", 401));
    }

    if (!user.role || user.role !== role) {
      user.role = (user.role || role).toLowerCase();
    }

    req.user = user;

    next();
  } catch (error) {
    next(new AuthError("Not authorized, token failed", 401));
  }
};

export default requireAuth;
