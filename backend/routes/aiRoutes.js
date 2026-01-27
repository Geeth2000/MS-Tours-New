import { Router } from "express";
import { recommendPlaces, recommendPackages, travelAssistant } from "../controllers/aiController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/places", recommendPlaces);
router.post("/packages", authenticate, recommendPackages);
router.post("/chat", travelAssistant);

export default router;
