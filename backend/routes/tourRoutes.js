import { Router } from "express";
import {
  createTour,
  getTours,
  getTourBySlug,
  updateTour,
  deleteTour,
} from "../controllers/tourController.js";
import { authenticate, requireRoles } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createTourSchema, updateTourSchema } from "../validators/tourValidators.js";
import { USER_ROLES } from "../config/constants.js";

const router = Router();

router.get("/", getTours);
router.get("/:slug", getTourBySlug);

router.post(
  "/",
  authenticate,
  requireRoles(USER_ROLES.ADMIN),
  validateRequest(createTourSchema),
  createTour
);

router.put(
  "/:id",
  authenticate,
  requireRoles(USER_ROLES.ADMIN),
  validateRequest(updateTourSchema),
  updateTour
);

router.delete(
  "/:id",
  authenticate,
  requireRoles(USER_ROLES.ADMIN),
  deleteTour
);

export default router;
