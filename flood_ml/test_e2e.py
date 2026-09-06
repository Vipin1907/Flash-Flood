import json, requests, sys

try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

BASE_URL = "http://localhost:8001"

print("=========================================================")
print("   DEIP-192 END-TO-END PIPELINE AUTOMATED TEST")
print("=========================================================")

# Step 1: Trigger Prediction
print("\n[STEP 1] Running ML Flood Risk Prediction (/predict-risk)...")
pred_payload = {
    "rainfall_mm": 6.6,
    "rainfall_1d": 6.6,
    "rainfall_3d": 6.7,
    "rainfall_7d": 104.4,
    "rainfall_30d": 181.5,
    "soil_saturation_proxy": 0.317,
    "ndvi": 0.65,
    "slope_mean": 29.7,
    "flow_accumulation": 3.0
}
pred_res = requests.post(f"{BASE_URL}/predict-risk", json=pred_payload)
assert pred_res.status_code == 200, f"Predict failed: {pred_res.text}"
pred_data = pred_res.json()
print(f"  -> Risk Level  : {pred_data['risk_level']}")
print(f"  -> Probability : {pred_data['probability'] * 100:.1f}%")
print(f"  -> Confidence  : {pred_data['confidence'] * 100:.1f}%")
print(f"  -> SHAP Drivers: {pred_data['top_drivers']}")

# Step 2: Trigger Agentic AI
print("\n[STEP 2] Triggering LangGraph Emergency Agent (/agent/trigger)...")
thread_id = f"e2e-test-{int(requests.get(f'{BASE_URL}/health').elapsed.total_seconds()*1000)}"
agent_payload = {
    "thread_id": thread_id,
    "risk_level": pred_data['risk_level'],
    "rainfall_mm": pred_payload['rainfall_mm'],
    "safe_route_summary": "Evacuate via NH-94 towards Chamba (Safe route avoids 3 flood risk zones)"
}
agent_res = requests.post(f"{BASE_URL}/agent/trigger", json=agent_payload)
assert agent_res.status_code == 200, f"Agent trigger failed: {agent_res.text}"
agent_data = agent_res.json()
print(f"  -> Thread ID       : {agent_data['thread_id']}")
print(f"  -> Workflow Status : {agent_data['status']}")
print(f"  -> AI Drafted Alert:\n     \"{agent_data['drafted_message']}\"")

# Step 3: Human Approval
print("\n[STEP 3] Submitting Human Admin Approval (/agent/approve)...")
approve_payload = {
    "thread_id": thread_id,
    "decision": "approved"
}
approve_res = requests.post(f"{BASE_URL}/agent/approve", json=approve_payload)
assert approve_res.status_code == 200, f"Agent approve failed: {approve_res.text}"
approve_data = approve_res.json()
print(f"  -> Final Status    : {approve_data['status'].upper()}")

print("\n=========================================================")
print("   ALL 3 STEPS COMPLETED & VERIFIED SUCCESSFULLY!")
print("=========================================================")
