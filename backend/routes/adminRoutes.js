import { Router } from "express";
import {
  getPendingVehicleOwners,
  updateVehicleOwnerStatus,
  listUsers,
  getDashboardSummary,
} from "../controllers/adminController.js";
import { authenticate, requireRoles } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { updateOwnerStatusSchema } from "../validators/adminValidators.js";
import { USER_ROLES } from "../config/constants.js";

const router = Router();

router.use(authenticate, requireRoles(USER_ROLES.ADMIN));

router.get("/dashboard/summary", getDashboardSummary);
router.get("/owners/pending", getPendingVehicleOwners);
router.patch(
  "/owners/:id/status",
  validateRequest(updateOwnerStatusSchema),
  updateVehicleOwnerStatus
);
router.get("/users", listUsers);

export default router;
