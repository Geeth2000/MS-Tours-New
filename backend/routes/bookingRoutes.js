import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} from "../controllers/bookingController.js";
import { authenticate, requireRoles, requireApproval } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from "../validators/bookingValidators.js";
import { USER_ROLES } from "../config/constants.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requireRoles(USER_ROLES.TOURIST, USER_ROLES.ADMIN),
  validateRequest(createBookingSchema),
  createBooking
);

router.get("/me", authenticate, requireRoles(USER_ROLES.TOURIST), getMyBookings);

router.get(
  "/owner",
  authenticate,
  requireRoles(USER_ROLES.VEHICLE_OWNER),
  requireApproval,
  getOwnerBookings
);

router.get(
  "/",
  authenticate,
  requireRoles(USER_ROLES.ADMIN),
  getAllBookings
);

router.get("/:id", authenticate, getBookingById);

router.patch(
  "/:id/status",
  authenticate,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.VEHICLE_OWNER),
  validateRequest(updateBookingStatusSchema),
  updateBookingStatus
);

router.post(
  "/:id/cancel",
  authenticate,
  requireRoles(USER_ROLES.TOURIST),
  cancelBooking
);

export default router;
