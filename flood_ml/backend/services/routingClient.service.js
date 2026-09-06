import { config } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

/**
 * Calls the Python FastAPI ML microservice's /safe-route endpoint.
 * Returns normal + risk-aware routes for frontend map display.
 */
const getSafeRoute = async (start_lat, start_lon, end_lat, end_lon, risk_zones = []) => {
  let response;
  try {
    response = await fetch(`${config.mlServiceUrl}/safe-route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start_lat, start_lon, end_lat, end_lon, risk_zones }),
    });
  } catch (err) {
    throw new ApiError(502, "Routing service unreachable", [err.message]);
  }

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, "Routing service error", [errBody]);
  }

  return response.json();
  // Returns: { normal_route: {...}, recommended_safe_route: {...} }
};

export { getSafeRoute };
