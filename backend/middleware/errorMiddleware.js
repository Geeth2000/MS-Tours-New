import { ApiError } from "../utils/apiError.js";

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
};
