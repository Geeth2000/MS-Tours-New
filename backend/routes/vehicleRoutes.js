import { Router } from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  getMyVehicles,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";
import { authenticate, requireRoles, requireApproval } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createVehicleSchema,
  updateVehicleSchema,
} from "../validators/vehicleValidators.js";
import { USER_ROLES } from "../config/constants.js";

const router = Router();

router.get("/", getVehicles);

router.get(
  "/me",
  authenticate,
  requireRoles(USER_ROLES.VEHICLE_OWNER),
  requireApproval,
  getMyVehicles
);

router.get("/:id", getVehicleById);

router.post(
  "/",
  authenticate,
  requireRoles(USER_ROLES.VEHICLE_OWNER),
  requireApproval,
  validateRequest(createVehicleSchema),
  createVehicle
);

router.put(
  "/:id",
  authenticate,
  requireRoles(USER_ROLES.VEHICLE_OWNER, USER_ROLES.ADMIN),
  requireApproval,
  validateRequest(updateVehicleSchema),
  updateVehicle
);

router.delete(
  "/:id",
  authenticate,
  requireRoles(USER_ROLES.VEHICLE_OWNER, USER_ROLES.ADMIN),
  requireApproval,
  deleteVehicle
);

export default router;
