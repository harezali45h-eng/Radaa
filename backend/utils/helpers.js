import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "30d";

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn
  });
};
