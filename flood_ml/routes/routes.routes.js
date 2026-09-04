import { Router } from "express";
import { getEvacuationRoute } from "../controllers/routes.controllers.js";

const router = Router();

// POST /api/v1/routes
// Body: { start_lat, start_lon, end_lat, end_lon, risk_zones? }
router.post("/", getEvacuationRoute);

export default router;
