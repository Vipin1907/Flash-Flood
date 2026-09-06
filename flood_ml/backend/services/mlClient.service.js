import { config } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

/**
 * Calls the Python FastAPI ML microservice's /predict-risk endpoint.
 * Node backend never loads the XGBoost model itself — Python owns that.
 */
const getFloodRiskPrediction = async (features) => {
  let response;
  try {
    response = await fetch(`${config.mlServiceUrl}/predict-risk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(features),
    });
  } catch (err) {
    throw new ApiError(502, "ML service unreachable", [err.message]);
  }

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, "ML service returned an error", [errBody]);
  }

  return response.json(); // { probability, confidence, risk_level, lead_time_hrs }
};

const triggerAgentAlert = async (data) => {
  let response;
  try {
    response = await fetch(`${config.mlServiceUrl}/agent/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (err) {
    throw new ApiError(502, "ML service unreachable", [err.message]);
  }

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, "Agent trigger failed", [errBody]);
  }

  return response.json();
};

const approveAgentAlert = async (threadId, decision) => {
  let response;
  try {
    response = await fetch(`${config.mlServiceUrl}/agent/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ thread_id: threadId, decision }),
    });
  } catch (err) {
    throw new ApiError(502, "ML service unreachable", [err.message]);
  }

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, "Agent approval failed", [errBody]);
  }

  return response.json();
};

export { getFloodRiskPrediction, triggerAgentAlert, approveAgentAlert };
