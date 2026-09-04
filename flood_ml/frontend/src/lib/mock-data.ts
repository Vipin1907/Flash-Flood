import { PredictionResponse, RainfallDataPoint } from "./types";

export const mockPrediction: PredictionResponse = {
  probability: 0.9753,
  confidence: 0.9505,
  risk_level: "Very High",
  lead_time_hrs: 3,
  top_drivers: ["rainfall_3d", "soil_saturation_proxy", "slope_mean"],
};

export const mockRainfallTimeline: RainfallDataPoint[] = [
  { time: "00:00", rainfall_mm: 12, risk_probability: 0.15 },
  { time: "03:00", rainfall_mm: 28, risk_probability: 0.32 },
  { time: "06:00", rainfall_mm: 45, risk_probability: 0.51 },
  { time: "09:00", rainfall_mm: 72, risk_probability: 0.73 },
  { time: "12:00", rainfall_mm: 95, risk_probability: 0.88 },
  { time: "15:00", rainfall_mm: 120, risk_probability: 0.95 },
  { time: "18:00", rainfall_mm: 80, risk_probability: 0.82 },
  { time: "21:00", rainfall_mm: 45, risk_probability: 0.58 },
];

export const mockAlertDraft = {
  status: "awaiting_approval",
  thread_id: "flood-alert-2026-09-03-001",
  drafted_message:
    "⚠️ FLASH FLOOD WARNING: Very High risk in Uttarkashi. 120mm rainfall expected. Evacuate to higher ground via NH-94. | बाढ़ चेतावनी: उत्तरकाशी में अत्यधिक खतरा। NH-94 से ऊंचे स्थान पर जाएं।",
};

export const mockRouteInfo = {
  normal_route: {
    distance_meters: 12400,
    estimated_time_seconds: 1860,
    exposure_level: "High",
  },
  recommended_safe_route: {
    distance_meters: 18200,
    estimated_time_seconds: 2730,
    exposure_level: "Low",
  },
};

export const mockHydrology = {
  river_name: "Bhagirathi",
  current_level_m: 4.2,
  danger_level_m: 5.0,
  trend: "rising" as const,
  rate_cm_hr: 12,
};
