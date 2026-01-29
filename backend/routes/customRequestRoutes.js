import { Router } from "express";
import {
  createCustomRequest,
  getCustomRequests,
} from "../controllers/customRequestController.js";
import { authenticate, requireRoles } from "../middleware/authMiddleware.js";
import { USER_ROLES } from "../config/constants.js";

const router = Router();

// 1. Create Request (For Tourists - Logged In users)
router.post("/", authenticate, createCustomRequest);

// 2. Get All Requests (For Admin only)
router.get(
  "/",
  authenticate,
  requireRoles(USER_ROLES.ADMIN),
  getCustomRequests,
);

export default router;
