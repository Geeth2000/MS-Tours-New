import { Router } from "express";
import {
	register,
	login,
	getMe,
	updateProfile,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
	registerSchema,
	loginSchema,
	updateProfileSchema,
} from "../validators/authValidators.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, validateRequest(updateProfileSchema), updateProfile);

export default router;
