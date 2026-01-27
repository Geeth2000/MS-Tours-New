import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { verifyToken } from "../utils/token.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Authentication required");
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("+password");

    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "User no longer exists");
    }

    if (!user.isActive) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Account is deactivated");
    }

    req.user = user;
    return next();
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "Invalid or expired token";
    return next(new ApiError(error.statusCode || StatusCodes.UNAUTHORIZED, message));
  }
};

export const requireRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(StatusCodes.FORBIDDEN, "Access denied"));
  }
  return next();
};

export const requireApproval = (req, res, next) => {
  if (req.user?.role === "vehicleOwner" && !req.user?.onboarding?.isApproved) {
    return next(new ApiError(StatusCodes.FORBIDDEN, "Awaiting admin approval"));
  }
  return next();
};
