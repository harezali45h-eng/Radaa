import { ApiError } from "../utils/errors.js";

export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`, "NOT_FOUND");
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  const code = err.code || (statusCode >= 500 ? "INTERNAL_ERROR" : "ERROR");

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server error",
    code,
    details: err.details || null,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};
