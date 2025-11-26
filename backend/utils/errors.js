export class ApiError extends Error {
  constructor(statusCode, message, code = "API_ERROR", details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends ApiError {
  constructor(message, details = null) {
    super(400, message, "VALIDATION_ERROR", details);
  }
}

export class AuthError extends ApiError {
  constructor(message = "Not authorized", statusCode = 401, code = "AUTH_ERROR") {
    super(statusCode, message, code);
  }
}
