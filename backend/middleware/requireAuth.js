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

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return next(new AuthError("Not authorized, user not found", 401));
    }

    next();
  } catch (error) {
    next(new AuthError("Not authorized, token failed", 401));
  }
};

export default requireAuth;
