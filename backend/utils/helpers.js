import jwt from "jsonwebtoken";

export const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  if (!userId) {
    throw new Error("generateToken requires a userId");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "30d";

  const normalizedRole = role
    ? String(role).trim().toLowerCase()
    : undefined;

  const payload = {
    id: userId,
    sub: userId,
  };

  if (normalizedRole) {
    payload.role = normalizedRole;
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
};
