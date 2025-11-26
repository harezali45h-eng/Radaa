import expressSanitizer from "express-sanitizer";

const sanitizeObject = (obj, sanitizeFn) => {
  if (!obj || typeof obj !== "object") {
    return;
  }

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (typeof value === "string") {
      // express-sanitizer returns a sanitized string
      obj[key] = sanitizeFn(value);
    } else if (typeof value === "object") {
      sanitizeObject(value, sanitizeFn);
    }
  });
};

export const sanitizeInput = [
  expressSanitizer(),
  (req, res, next) => {
    if (typeof req.sanitize === "function") {
      sanitizeObject(req.body, req.sanitize);
      sanitizeObject(req.params, req.sanitize);
      sanitizeObject(req.query, req.sanitize);
    }

    next();
  }
];
