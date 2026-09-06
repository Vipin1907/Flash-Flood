import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { getFloodRiskPrediction } from "../services/mlClient.service.js";

const REQUIRED_FEATURES = [
  "rainfall_mm",
  "rainfall_1d",
  "rainfall_3d",
  "rainfall_7d",
  "rainfall_30d",
  "soil_saturation_proxy",
  "ndvi",
  "slope_mean",
  "flow_accumulation",
];

/**
 * POST /api/v1/predict
 * Validates feature inputs and calls the Python ML microservice.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const predictFloodRisk = asyncHandler(async (req, res) => {
  /** @type {Record<string, unknown>} */
  const body = req.body;

  const missing = REQUIRED_FEATURES.filter((key) => body[key] === undefined);
  if (missing.length > 0) {
    throw new ApiError(400, "Missing required feature(s)", missing);
  }

  const features = Object.fromEntries(
    REQUIRED_FEATURES.map((key) => [key, Number(body[key])]),
  );

  // Guard: reject if any value is NaN after conversion
  const nanKeys = Object.entries(features)
    .filter(([, v]) => isNaN(v))
    .map(([k]) => k);
  if (nanKeys.length > 0) {
    throw new ApiError(400, "Feature values must be numeric", nanKeys);
  }

  const prediction = await getFloodRiskPrediction(features);

  return res
    .status(200)
    .json(new ApiResponse(200, prediction, "Flood risk predicted"));
});

export { predictFloodRisk };
