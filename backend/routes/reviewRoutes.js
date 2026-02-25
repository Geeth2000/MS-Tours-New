import { Router } from "express";
import {
  createReview,
  getReviews,
  getLatestReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import { authenticate, requireRoles } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createReviewSchema } from "../validators/reviewValidators.js";
import { USER_ROLES } from "../config/constants.js";

const router = Router();

// Public route for latest reviews (homepage)
router.get("/latest", getLatestReviews);

router.get("/", getReviews);

router.post(
  "/",
  authenticate,
  requireRoles(USER_ROLES.TOURIST),
  validateRequest(createReviewSchema),
  createReview,
);

router.delete(
  "/:id",
  authenticate,
  requireRoles(USER_ROLES.TOURIST),
  deleteReview,
);

export default router;
