export type RiskLevel = "Low" | "Moderate" | "High" | "Very High";

export interface PredictionResponse {
  probability: number;
  confidence: number;
  risk_level: RiskLevel;
  lead_time_hrs: number;
  top_drivers: string[];
}

export interface RouteResponse {
  normal_route: {
    status: string;
    route_coords: number[][];
    distance_meters: number;
    estimated_time_seconds: number;
    exposure_level: string;
  };
  recommended_safe_route: {
    status: string;
    route_coords: number[][];
    distance_meters: number;
    estimated_time_seconds: number;
    exposure_level: string;
  };
}

export interface AlertResponse {
  status: string;
  thread_id: string;
  drafted_message?: string;
}

export interface RainfallDataPoint {
  time: string;
  rainfall_mm: number;
  risk_probability: number;
}
