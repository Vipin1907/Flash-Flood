import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { getSafeRoute } from "../services/routingClient.service.js";

const getEvacuationRoute = asyncHandler(async (req, res) => {
  const { start_lat, start_lon, end_lat, end_lon, risk_zones } = req.body;

  if ([start_lat, start_lon, end_lat, end_lon].some((v) => v === undefined || isNaN(Number(v)))) {
    throw new ApiError(400, "start_lat, start_lon, end_lat, end_lon are required and must be numbers");
  }

  const result = await getSafeRoute(
    Number(start_lat),
    Number(start_lon),
    Number(end_lat),
    Number(end_lon),
    risk_zones || []
  );

  return res.status(200).json(new ApiResponse(200, result, "Evacuation routes calculated"));
});

export { getEvacuationRoute };
