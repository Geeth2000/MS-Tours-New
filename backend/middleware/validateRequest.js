import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/apiError.js";

export const validateRequest = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    const details = error.details.map((detail) => ({
      message: detail.message,
      path: detail.path,
    }));
    return next(new ApiError(StatusCodes.BAD_REQUEST, "Validation error", details));
  }

  req.body = value;
  return next();
};
