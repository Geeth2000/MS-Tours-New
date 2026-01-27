import { Router } from "express";
import { createReview, getReviews, deleteReview } from "../controllers/reviewController.js";
import { authenticate, requireRoles } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createReviewSchema } from "../validators/reviewValidators.js";
import { USER_ROLES } from "../config/constants.js";

const router = Router();

router.get("/", getReviews);

router.post(
  "/",
  authenticate,
  requireRoles(USER_ROLES.TOURIST),
  validateRequest(createReviewSchema),
  createReview
);

router.delete(
  "/:id",
  authenticate,
  requireRoles(USER_ROLES.TOURIST),
  deleteReview
);

export default router;
