import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return next();
    }

    const token = header.split(" ")[1];

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userId = decoded && (decoded.id || decoded.sub || decoded._id);
      const role = decoded.role ? String(decoded.role).trim().toLowerCase() : undefined;

      if (!userId || !role) {
        // Invalid or legacy token without role: treat as unauthenticated
        return next();
      }

      const user = await User.findById(userId).select("-password");

      if (user) {
        if (!user.role || user.role !== role) {
          user.role = (user.role || role).toLowerCase();
        }
        req.user = user;
      }
    } catch {
      // ignore auth errors for optional auth
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default optionalAuth;
