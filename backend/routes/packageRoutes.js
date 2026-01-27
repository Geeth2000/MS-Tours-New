import { Router } from "express";
import {
  createPackage,
  getPackages,
  getPackageById,
  getMyPackages,
  updatePackage,
  changePackageStatus,
  deletePackage,
} from "../controllers/packageController.js";
import { authenticate, requireRoles, requireApproval } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createPackageSchema,
  updatePackageSchema,
  packageStatusSchema,
} from "../validators/packageValidators.js";
import { USER_ROLES } from "../config/constants.js";

const router = Router();

router.get("/", getPackages);

router.get(
  "/me",
  authenticate,
  requireRoles(USER_ROLES.VEHICLE_OWNER),
  requireApproval,
  getMyPackages
);

router.get("/:id", getPackageById);

router.post(
  "/",
  authenticate,
  requireRoles(USER_ROLES.VEHICLE_OWNER),
  requireApproval,
  validateRequest(createPackageSchema),
  createPackage
);

router.put(
  "/:id",
  authenticate,
  requireRoles(USER_ROLES.VEHICLE_OWNER, USER_ROLES.ADMIN),
  requireApproval,
  validateRequest(updatePackageSchema),
  updatePackage
);

router.patch(
  "/:id/status",
  authenticate,
  requireRoles(USER_ROLES.ADMIN),
  validateRequest(packageStatusSchema),
  changePackageStatus
);

router.delete(
  "/:id",
  authenticate,
  requireRoles(USER_ROLES.VEHICLE_OWNER, USER_ROLES.ADMIN),
  requireApproval,
  deletePackage
);

export default router;
