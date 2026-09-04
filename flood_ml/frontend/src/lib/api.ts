import type { PredictionResponse, AlertResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";

/**
 * POST /predict-risk — Get flood probability from ML model
 */
export async function predictRisk(features: {
  rainfall_mm: number;
  rainfall_1d: number;
  rainfall_3d: number;
  rainfall_7d: number;
  rainfall_30d: number;
  soil_saturation_proxy: number;
  ndvi: number;
  slope_mean: number;
  flow_accumulation: number;
}): Promise<PredictionResponse> {
  const res = await fetch(`${API_URL}/predict-risk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(features),
  });
  if (!res.ok) throw new Error(`Prediction failed: ${res.status}`);
  return res.json();
}

/**
 * GET /health — Check ML service status
 */
export async function getHealth(): Promise<{
  status: string;
  model_loaded: boolean;
  shap_ready: boolean;
  features: string[];
}> {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

/**
 * POST /agent/trigger — Start LangGraph alert workflow
 */
export async function triggerAlert(data: {
  thread_id: string;
  risk_level: string;
  rainfall_mm: number;
  safe_route_summary: string;
}): Promise<AlertResponse> {
  const res = await fetch(`${API_URL}/agent/trigger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Agent trigger failed: ${res.status}`);
  return res.json();
}

/**
 * POST /agent/approve — Approve or reject drafted alert
 */
export async function approveAlert(
  threadId: string,
  decision: "approved" | "rejected"
): Promise<{ status: string; thread_id: string }> {
  const res = await fetch(`${API_URL}/agent/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ thread_id: threadId, decision }),
  });
  if (!res.ok) throw new Error(`Agent approval failed: ${res.status}`);
  return res.json();
}

/**
 * POST /safe-route — Get evacuation routes
 */
export async function getSafeRoute(data: {
  start_lat: number;
  start_lon: number;
  end_lat: number;
  end_lon: number;
  risk_zones?: number[][];
}) {
  const res = await fetch(`${API_URL}/safe-route`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Route fetch failed: ${res.status}`);
  return res.json();
}
