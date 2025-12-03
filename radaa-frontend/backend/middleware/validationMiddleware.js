import { ZodError } from "zod";
import { ValidationError } from "../utils/errors.js";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });

      if (result.body) {
        req.body = result.body;
      }

      if (result.params) {
        req.params = result.params;
      }

      if (result.query) {
        req.query = result.query;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => e.message).join(", ");
        return next(new ValidationError(messages, error.errors));
      }

      next(error);
    }
  };
};
