@echo off
title DEIP-192 Flash Flood System Launcher
echo ========================================================
echo    Starting DEIP-192 Flash Flood Early Warning System
echo ========================================================
echo.

echo [1/3] Starting Python FastAPI ML Service (Port 8001)...
start "1. Python ML Service (Port 8001)" cmd /k "cd /d E:\Prediction\flood_ml\ml_service && uvicorn main:app --reload --host 127.0.0.1 --port 8001"

echo [2/3] Starting Node.js Backend Gateway (Port 8000)...
start "2. Node.js Backend (Port 8000)" cmd /k "cd /d E:\Prediction\flood_ml && node index.js"

echo [3/3] Starting Next.js Frontend Dashboard (Port 3000)...
start "3. Frontend Dashboard (Port 3000)" cmd /k "cd /d E:\Prediction\flood_ml\frontend && npm run dev"

echo.
echo Waiting 8 seconds for services to spin up...
timeout /t 8 /nobreak >nul

echo Opening Dashboard in browser...
start http://localhost:3000

echo.
echo ========================================================
echo    All 3 services are running!
echo    - Frontend Dashboard: http://localhost:3000
echo    - Python ML Service:  http://localhost:8001
echo    - Node Backend:       http://localhost:8000
echo ========================================================
