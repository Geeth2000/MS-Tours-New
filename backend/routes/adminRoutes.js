import { Router } from "express";
import {
  getAdminSummary,
  getUsers,
  deleteUser,
  deleteTour,
  adminDeleteVehicle,
  adminDeletePackage,
  getPendingOwners,
  updateOwnerStatus,
} from "../controllers/adminController.js";
import { authenticate, requireRoles } from "../middleware/authMiddleware.js";
import { USER_ROLES } from "../config/constants.js";

const router = Router();

// Protect all admin routes
router.use(authenticate, requireRoles(USER_ROLES.ADMIN));

// This matches GET /api/v1/admin/summary
router.get("/summary", getAdminSummary);

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

router.delete("/tours/:id", deleteTour);
router.delete("/vehicles/:id", adminDeleteVehicle);
router.delete("/packages/:id", adminDeletePackage);

router.get("/owners/pending", getPendingOwners);
router.patch("/owners/:id/status", updateOwnerStatus);

export default router;
