import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { triggerAgentAlert, approveAgentAlert } from "../services/mlClient.service.js";

/**
 * POST /api/v1/alerts/trigger
 * Triggers the Agentic AI (LangGraph) workflow to draft an alert.
 */
const triggerAlert = asyncHandler(async (req, res) => {
  const { thread_id, risk_level, rainfall_mm, safe_route_summary } = req.body;

  if (!thread_id || !risk_level || rainfall_mm === undefined) {
    throw new ApiError(400, "Missing required fields for alert trigger");
  }

  const result = await triggerAgentAlert({
    thread_id,
    risk_level,
    rainfall_mm,
    safe_route_summary: safe_route_summary || "Evacuate to higher ground immediately."
  });

  return res.status(200).json(new ApiResponse(200, result, "Agent triggered and drafted message"));
});

/**
 * POST /api/v1/alerts/approve
 * Submits the human decision (approve/reject) to the Agentic AI workflow.
 */
const approveAlert = asyncHandler(async (req, res) => {
  const { thread_id, decision } = req.body;

  if (!thread_id || !decision) {
    throw new ApiError(400, "Missing thread_id or decision (approved/rejected)");
  }

  const result = await approveAgentAlert(thread_id, decision);

  return res.status(200).json(new ApiResponse(200, result, `Agent flow completed with decision: ${decision}`));
});

export { triggerAlert, approveAlert };
