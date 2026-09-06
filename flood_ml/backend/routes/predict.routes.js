import { Router } from "express";
import { predictFloodRisk } from "../controllers/predict.controllers.js";

const router = Router();

// POST /api/v1/predict
// Body: { rainfall_mm, rainfall_1d, ... }
router.post("/", predictFloodRisk);

export default router;
