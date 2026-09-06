# Deploying Flash Flood Early Warning System to Render

This guide walks you through deploying the complete full-stack application (Python FastAPI ML Service, Node.js Gateway, and Next.js Frontend) to **[Render](https://render.com/)**.

---

## Architecture Overview

1. **`flood-ml-service` (Python Web Service)**: Runs FastAPI with the XGBoost flood model, SHAP explainability, OSMnx evacuation routing engine, and Gemini LangGraph agent.
2. **`flood-backend-gateway` (Node.js Web Service)**: Express API gateway for health checks and proxy routing.
3. **`flood-frontend` (Node.js / Next.js Web Service)**: Interactive Next.js dashboard with Leaflet GIS maps, radar telemetry, and simulated flood alerts.

---

## Method 1: Instant Deployment with Render Blueprint (Recommended)

The repository includes a [`render.yaml`](file:///e:/Prediction/render.yaml) file configured to deploy all 3 services together.

### Step 1: Push Your Code to GitHub

Make sure all changes (including the model binary and configurations) are pushed:

```bash
git add .
git commit -m "Configure project for Render cloud deployment"
git push origin main
```

### Step 2: Create Blueprint on Render

1. Log in to your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** in the top-right corner and select **Blueprint**.
3. Connect your GitHub repository (`Vipin1907/Flash-Flood` or your fork).
4. Render will automatically read `render.yaml` and show:
   - `flood-ml-service`
   - `flood-backend-gateway`
   - `flood-frontend`
5. *(Optional)* Add your `GEMINI_API_KEY` under Environment Variables for `flood-ml-service` if you want AI-generated alerts.
6. Click **Apply**. Render will build and deploy all services automatically!

---

## Method 2: Manual Web Service Deployment (Step-by-Step)

If you prefer to configure each service manually in the Render UI:

### Service 1: Python ML Microservice (`flood-ml-service`)

1. In Render Dashboard, click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Fill in the settings:
   - **Name**: `flood-ml-service`
   - **Root Directory**: `flood_ml`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install --upgrade pip && pip install -r ml_service/requirements.txt`
   - **Start Command**: `cd ml_service && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`
4. **Environment Variables**:
   | Key | Value |
   |---|---|
   | `PYTHON_VERSION` | `3.11.9` |
   | `CORS_ORIGIN` | `*` |
   | `GEMINI_API_KEY` | *(Your Gemini API key)* |
5. Click **Create Web Service**. Note down its URL (e.g. `https://flood-ml-service.onrender.com`).

---

### Service 2: Node.js API Gateway (`flood-backend-gateway`) *(Optional)*

1. Click **New +** → **Web Service**.
2. Settings:
   - **Name**: `flood-backend-gateway`
   - **Root Directory**: `flood_ml/backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
3. **Environment Variables**:
   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `CORS_ORIGIN` | `*` |
   | `ML_SERVICE_URL` | `https://flood-ml-service.onrender.com` |
4. Click **Create Web Service**.

---

### Service 3: Next.js Frontend Dashboard (`flood-frontend`)

1. Click **New +** → **Web Service**.
2. Settings:
   - **Name**: `flood-frontend`
   - **Root Directory**: `flood_ml/frontend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
3. **Environment Variables**:
   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `NEXT_PUBLIC_API_URL` | `https://flood-ml-service.onrender.com` |
4. Click **Create Web Service**.

---

## Verifying Deployment

Once deployed:
1. **Health Check**: Open `https://<your-ml-service>.onrender.com/health` in your browser. You should see:
   ```json
   {
     "status": "ok",
     "model_loaded": true,
     "shap_ready": true,
     "features": [...]
   }
   ```
2. **Interactive Docs**: Visit `https://<your-ml-service>.onrender.com/docs` to test Swagger API endpoints.
3. **Dashboard UI**: Visit `https://<your-frontend>.onrender.com` to see the live disaster management dashboard with interactive GIS map, telemetry, and flood risk analysis.
