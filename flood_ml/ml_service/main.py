"""
DEIP-192 Flash Flood - ML Prediction Microservice (FastAPI)
Location: flood_ml/ml_service/main.py
Run with: uvicorn main:app --port 8001 --reload

Exposes:
  POST /predict-risk  -> Flood probability + SHAP top drivers + risk level
  POST /safe-route    -> OSM-based safe evacuation route (Ayush's engine)
  GET  /health        -> Health check
"""
import json
import os
import sys
import joblib

import shap
import xgboost as xgb
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

# routing_engine is in the same folder (ml_service/)
sys.path.insert(0, os.path.dirname(__file__))
import routing_engine
from shapely.geometry import Point

app = FastAPI(title="DEIP-192 ML Prediction Service", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Paths (relative to this file) ───────────────────────
_HERE = os.path.dirname(__file__)
# Using original model — calibrated version collapsed probabilities to 0 due to
# extreme class imbalance (50 positives in 1.2M rows). Original XGBClassifier
# with scale_pos_weight correctly predicts 0.97+ for actual flood events.
MODEL_PATH    = os.path.join(_HERE, "training", "data", "raw_grid", "raw", "model_real_v2.pkl")
FEATURES_PATH = os.path.join(_HERE, "model_v2_features.json")

# ─── Load model + features at startup ────────────────────
try:
    calibrated_model = joblib.load(MODEL_PATH)
    print(f"[OK] Model loaded: {MODEL_PATH}")
except Exception as e:
    print(f"[ERROR] Could not load model: {e}")
    calibrated_model = None

with open(FEATURES_PATH) as f:
    FEATURE_COLS: List[str] = json.load(f)

# ─── SHAP explainer / TreeSHAP ───────────────────────────
shap_ready = False
try:
    if calibrated_model is not None:
        _test_df = pd.DataFrame([{f: 0.0 for f in FEATURE_COLS}])[FEATURE_COLS]
        _test_dmat = xgb.DMatrix(_test_df)
        _test_contribs = calibrated_model.get_booster().predict(_test_dmat, pred_contribs=True)
        shap_ready = True
        print("[OK] Native TreeSHAP explainability initialized successfully")
except Exception as e:
    print(f"[WARN] TreeSHAP could not be initialized: {e}")


# ─────────────────── Schemas ─────────────────────────────

class PredictionInput(BaseModel):
    rainfall_mm: float
    rainfall_1d: float
    rainfall_3d: float
    rainfall_7d: float
    rainfall_30d: float
    soil_saturation_proxy: float = Field(ge=0, le=1)
    ndvi: float
    slope_mean: float
    flow_accumulation: float


class PredictionOutput(BaseModel):
    probability: float
    confidence: float
    risk_level: str
    lead_time_hrs: int
    top_drivers: List[str] = []


class RouteInput(BaseModel):
    start_lat: float
    start_lon: float
    end_lat: float
    end_lon: float
    # Each zone: [lat, lon, radius_meters]
    risk_zones: Optional[List[List[float]]] = []


# ─────────────────── Helpers ─────────────────────────────

def classify_risk_level(proba: float) -> str:
    if proba >= 0.75:
        return "Very High"
    if proba >= 0.50:
        return "High"
    if proba >= 0.25:
        return "Moderate"
    return "Low"


def get_top_shap_drivers(X_row_df: pd.DataFrame, n: int = 3) -> List[str]:
    if not shap_ready or calibrated_model is None:
        return []
    try:
        dmat = xgb.DMatrix(X_row_df[FEATURE_COLS])
        contribs = calibrated_model.get_booster().predict(dmat, pred_contribs=True)
        feat_contribs = contribs[0][:-1]
        top = sorted(zip(FEATURE_COLS, feat_contribs), key=lambda x: -abs(x[1]))[:n]
        return [f[0] for f in top]
    except Exception as e:
        print(f"[WARN] Error calculating SHAP drivers: {e}")
        return []


# ─────────────────── Endpoints ───────────────────────────

@app.get("/")
def read_root():
    return {
        "message": "Welcome to DEIP-192 ML Prediction Service",
        "docs": "Visit /docs for API documentation",
        "health": "Visit /health for service status"
    }

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": calibrated_model is not None,
        "shap_ready": shap_ready,
        "features": FEATURE_COLS,
    }


@app.post("/predict-risk", response_model=PredictionOutput)
def predict_risk(input_data: PredictionInput):
    if calibrated_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    try:
        X_row = pd.DataFrame([input_data.dict()])[FEATURE_COLS]
        proba = float(calibrated_model.predict_proba(X_row)[0, 1])
        confidence = round(abs(proba - 0.5) * 2, 4)
        top_drivers = get_top_shap_drivers(X_row)

        return PredictionOutput(
            probability=round(proba, 4),
            confidence=confidence,
            risk_level=classify_risk_level(proba),
            lead_time_hrs=3,
            top_drivers=top_drivers,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")


@app.post("/safe-route")
def safe_route(input_data: RouteInput):
    """Ayush's OSMnx routing engine exposed as REST API."""
    try:
        mid_lat = (input_data.start_lat + input_data.end_lat) / 2
        mid_lon = (input_data.start_lon + input_data.end_lon) / 2

        G = routing_engine.get_graph(mid_lat, mid_lon, dist=3000)
        if G is None:
            raise HTTPException(status_code=503, detail="Could not fetch road network from OSM")

        # Build Shapely polygons from risk_zones input
        risk_polygons = []
        for zone in input_data.risk_zones:
            if len(zone) >= 3:
                radius_deg = zone[2] / 111000  # meters → degrees approx
                risk_polygons.append(Point(zone[1], zone[0]).buffer(radius_deg))

        start = (input_data.start_lat, input_data.start_lon)
        end   = (input_data.end_lat,   input_data.end_lon)

        # Normal (fastest) route
        normal = routing_engine.calculate_route(G, start, end, weight="travel_time")

        # Safe route with risk weights applied
        G_risk = routing_engine.apply_risk_weights(G, risk_polygons)
        safe   = routing_engine.calculate_route(G_risk, start, end, weight="risk_weighted_time")

        return routing_engine.format_route_response(normal, safe)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Routing failed: {e}")

# ─────────────────── Agentic AI Endpoints ───────────────────

import agent
from pydantic import BaseModel

class AgentTriggerInput(BaseModel):
    thread_id: str
    risk_level: str
    rainfall_mm: float
    safe_route_summary: str

class AgentApproveInput(BaseModel):
    thread_id: str
    decision: str  # "approved" or "rejected"

@app.post("/agent/trigger")
def trigger_agent(input_data: AgentTriggerInput):
    try:
        config = {"configurable": {"thread_id": input_data.thread_id}}
        
        # Initialize state
        initial_state = {
            "thread_id": input_data.thread_id,
            "risk_level": input_data.risk_level,
            "rainfall_mm": input_data.rainfall_mm,
            "safe_route_summary": input_data.safe_route_summary,
            "human_decision": "pending"
        }
        
        # Run graph until it hits the interrupt
        agent.agent_app.invoke(initial_state, config)
        
        # Get the current state
        state = agent.agent_app.get_state(config)
        
        return {
            "status": "awaiting_approval",
            "thread_id": input_data.thread_id,
            "drafted_message": state.values.get("drafted_message", "")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent trigger failed: {str(e)}")

@app.post("/agent/approve")
def approve_agent(input_data: AgentApproveInput):
    try:
        config = {"configurable": {"thread_id": input_data.thread_id}}
        
        # Verify the thread exists and is waiting
        state = agent.agent_app.get_state(config)
        if not state.values:
            raise HTTPException(status_code=404, detail="Thread not found")
            
        # Update the state with the human decision
        agent.agent_app.update_state(
            config,
            {"human_decision": input_data.decision}
        )
        
        # Resume the graph by passing None
        agent.agent_app.invoke(None, config)
        
        # Get final state
        final_state = agent.agent_app.get_state(config)
        
        return {
            "status": final_state.values.get("status", "unknown"),
            "thread_id": input_data.thread_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent approval failed: {str(e)}")
