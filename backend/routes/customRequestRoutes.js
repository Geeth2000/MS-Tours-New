import { Router } from "express";
import {
  createCustomRequest,
  getCustomRequests,
  getMyCustomRequests,
  updateCustomRequestStatus,
  deleteCustomRequest,
  deleteMyCustomRequest,
  updateMyCustomRequest,
} from "../controllers/customRequestController.js";
import { authenticate, requireRoles } from "../middleware/authMiddleware.js";
import { USER_ROLES } from "../config/constants.js";

const router = Router();

// 1. Create Request (For Tourists - Logged In users)
router.post("/", authenticate, createCustomRequest);

// 2. Get My Requests (For logged-in users to see their own requests)
router.get("/my-requests", authenticate, getMyCustomRequests);

// 3. Update My Request (For logged-in users to edit their own requests)
router.patch("/my-requests/:id", authenticate, updateMyCustomRequest);

// 4. Delete My Request (For logged-in users to delete their own requests)
router.delete("/my-requests/:id", authenticate, deleteMyCustomRequest);

// 5. Get All Requests (For Admin only)
router.get(
  "/",
  authenticate,
  requireRoles(USER_ROLES.ADMIN),
  getCustomRequests,
);

// 6. Update Request Status (For Admin only)
router.patch(
  "/:id",
  authenticate,
  requireRoles(USER_ROLES.ADMIN),
  updateCustomRequestStatus,
);

// 7. Delete Request (For Admin only)
router.delete(
  "/:id",
  authenticate,
  requireRoles(USER_ROLES.ADMIN),
  deleteCustomRequest,
);

export default router;
