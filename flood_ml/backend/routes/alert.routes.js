import { Router } from "express";
import { triggerAlert, approveAlert } from "../controllers/alert.controllers.js";

const router = Router();

// Trigger the LangGraph Agent (Drafts the message and waits)
router.post("/trigger", triggerAlert);

// Approve/Reject the drafted message (Dispatches the alert)
router.post("/approve", approveAlert);

export default router;
