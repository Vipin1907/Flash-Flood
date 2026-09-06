import { Router } from "express";
import { ApiResponse } from "../utils/api-response.js";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json(new ApiResponse(200, { status: "ok", service: "DEIP-192 Backend" }, "Healthy"));
});

export default router;
