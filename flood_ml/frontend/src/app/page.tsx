"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Navigation, Share2, Sparkles, Check, Download } from "lucide-react";

import dynamic from "next/dynamic";

import { Sidebar, NavTab } from "@/components/layout/sidebar";
import { TopFilterBar, FeatureInputs } from "@/components/layout/top-filter-bar";
import { AnalysisProgressModal } from "@/components/analysis-progress-modal";

import { RiskSummaryCard } from "@/components/cards/risk-summary";
import { WeatherSummaryCard } from "@/components/cards/weather-summary-card";
import { ShapFactorsCard } from "@/components/cards/shap-factors-card";
import { ExposureImpactCard } from "@/components/cards/exposure-impact-card";
import { HydrologyCard } from "@/components/cards/hydrology-card";
import { RainfallChart } from "@/components/cards/rainfall-chart";
import { AlertPanel } from "@/components/cards/alert-panel";

import { HeroLanding } from "@/components/views/hero-landing";
import { WeatherTelemetryView } from "@/components/views/weather-telemetry-view";
import { CatchmentView } from "@/components/views/catchment-view";
import { HydrologyView } from "@/components/views/hydrology-view";
import { AlertsView } from "@/components/views/alerts-view";
import { ImpactView } from "@/components/views/impact-view";
import { ReportsView } from "@/components/views/reports-view";
import { DataQualityView } from "@/components/views/data-quality-view";
import { SettingsView } from "@/components/views/settings-view";

const RiskMapCard = dynamic(
  () => import("@/components/cards/risk-map").then((mod) => mod.RiskMapCard),
  { ssr: false }
);

const RiskMapView = dynamic(
  () => import("@/components/views/risk-map-view").then((mod) => mod.RiskMapView),
  { ssr: false }
);

const RoutesSafetyView = dynamic(
  () => import("@/components/views/routes-safety-view").then((mod) => mod.RoutesSafetyView),
  { ssr: false }
);

import { predictRisk, getHealth, triggerAlert } from "@/lib/api";
import { mockRainfallTimeline, mockHydrology, mockPrediction } from "@/lib/mock-data";
import type { PredictionResponse } from "@/lib/types";

const INITIAL_FEATURES: FeatureInputs = {
  rainfall_mm: 28.5,
  rainfall_1d: 28.5,
  rainfall_3d: 110.0,
  rainfall_7d: 185.0,
  rainfall_30d: 280.0,
  soil_saturation_proxy: 0.72,
  ndvi: 0.65,
  slope_mean: 18.0,
  flow_accumulation: 5.0,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("landing");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<"Assam" | "Uttarakhand">("Assam");
  const [selectedDistrict, setSelectedDistrict] = useState("Cachar");
  const [selectedCatchment, setSelectedCatchment] = useState("A127 - Barak Basin");
  const [mode, setMode] = useState<"live" | "historical">("live");
  const [dateTime, setDateTime] = useState("29 Aug 2026 12:00 PM");

  const [features, setFeatures] = useState<FeatureInputs>(INITIAL_FEATURES);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const [alertData, setAlertData] = useState<{
    status: string;
    thread_id: string;
    drafted_message: string;
  } | null>(null);
  const [alertLoading, setAlertLoading] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Run dynamic analysis pipeline with visual step progression
  const runPrediction = useCallback(
    async (
      currentFeatures: FeatureInputs,
      loc?: { state: string; district: string; catchment: string }
    ) => {
      setIsAnalyzing(true);
      setAnalysisStep(0);

      // Visual pipeline progression
      const stepTimer1 = setTimeout(() => setAnalysisStep(1), 350);
      const stepTimer2 = setTimeout(() => setAnalysisStep(2), 750);
      const stepTimer3 = setTimeout(() => setAnalysisStep(3), 1150);

      try {
        const health = await getHealth().catch(() => ({ status: "down" }));
        setApiOnline(health.status === "ok");

        const result = await predictRisk(currentFeatures);

        // Keep modal up just long enough for user to experience the pipeline
        setTimeout(() => {
          setPrediction(result);
          setIsAnalyzing(false);
        }, 1500);
      } catch (err) {
        console.warn("Prediction API temporarily unavailable, using fallback:", err);
        setApiOnline(false);
        setTimeout(() => {
          setPrediction(mockPrediction);
          setIsAnalyzing(false);
        }, 1500);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    runPrediction(INITIAL_FEATURES);
  }, [runPrediction]);

  const handleLocationChange = (
    state: "Assam" | "Uttarakhand",
    district: string,
    catchment: string
  ) => {
    setSelectedState(state);
    setSelectedDistrict(district);
    setSelectedCatchment(catchment);
  };

  // Trigger LangGraph Agent alert
  const handleTriggerAlert = useCallback(async () => {
    if (!prediction) return;
    setAlertLoading(true);
    try {
      const threadId = `flood-${Date.now()}`;
      const result = await triggerAlert({
        thread_id: threadId,
        risk_level: prediction.risk_level,
        rainfall_mm: features.rainfall_mm,
        safe_route_summary: `Evacuate via ${selectedState} Alternate Route A towards high ground. Avoid low lying stream crossings.`,
      });
      setAlertData({
        status: result.status,
        thread_id: result.thread_id,
        drafted_message: result.drafted_message || "Generating bilingual alert...",
      });
    } catch (err) {
      console.error("Alert error:", err);
    } finally {
      setAlertLoading(false);
    }
  }, [prediction, features.rainfall_mm, selectedState]);

  const handleShareReport = () => {
    const reportText = `🚨 DEIP-192 FLOOD RISK REPORT\nLocation: ${selectedDistrict}, ${selectedState} (${selectedCatchment})\nRisk Level: ${prediction?.risk_level || "HIGH"}\nProbability: ${prediction ? (prediction.probability * 100).toFixed(1) : 78}%\nLead Time: ${prediction?.lead_time_hrs || 3} Hours\nTop Drivers: ${prediction?.top_drivers?.join(", ") || "Rainfall, Soil Saturation"}`;
    navigator.clipboard.writeText(reportText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="flex min-h-screen bg-[#05070B] text-white selection:bg-[#FF3B1D] selection:text-white">
      {/* Visual Pipeline Analysis Modal */}
      <AnimatePresence>
        {isAnalyzing && <AnalysisProgressModal currentStep={analysisStep} />}
      </AnimatePresence>

      {/* Slide-out Navigation Drawer (Hidden by default, toggled via hamburger) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* When activeTab is 'landing', show full PravahAI Hero Landing with Input Console */}
      {activeTab === "landing" ? (
        <div className="flex-1 min-w-0">
          <HeroLanding
            onToggleSidebar={() => setIsSidebarOpen(true)}
            onStartPrediction={() => {}}
            onOpenDashboard={() => setActiveTab("dashboard")}
            onViewTelemetry={() => setActiveTab("weather-telemetry")}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            selectedCatchment={selectedCatchment}
            onLocationChange={handleLocationChange}
            features={features}
            onFeaturesChange={setFeatures}
            onPredict={runPrediction}
            isAnalyzing={isAnalyzing}
            dateTime={dateTime}
            onDateTimeChange={setDateTime}
            mode={mode}
            onModeChange={setMode}
          />
        </div>
      ) : (
        /* Main Operations Dashboard View (Panel 2 & 9 from Poster) */
        <div className="flex-1 flex flex-col min-w-0">
          {/* Step 2 & 3: Top Filter & User Controls Bar with 3-Line Menu Trigger */}
          <TopFilterBar
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onPredict={runPrediction}
            isLoading={isAnalyzing}
            features={features}
            onFeaturesChange={setFeatures}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            selectedCatchment={selectedCatchment}
            onLocationChange={handleLocationChange}
          />

          {/* Dynamic Body Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === "weather-telemetry" ? (
                <motion.div
                  key="weather-telemetry"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <WeatherTelemetryView
                    selectedState={selectedState}
                    selectedDistrict={selectedDistrict}
                    selectedCatchment={selectedCatchment}
                    dateTime={dateTime}
                    mode={mode}
                    features={features}
                    onPredict={runPrediction}
                    onProceedToDashboard={() => setActiveTab("dashboard")}
                    isAnalyzing={isAnalyzing}
                  />
                </motion.div>
              ) : activeTab === "risk-map" ? (
                <motion.div
                  key="risk-map"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <RiskMapView
                    selectedState={selectedState}
                    selectedDistrict={selectedDistrict}
                    selectedCatchment={selectedCatchment}
                    riskProbability={prediction?.probability ? Math.round(prediction.probability * 100) : 78}
                  />
                </motion.div>
              ) : activeTab === "catchment" ? (
                <motion.div
                  key="catchment"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <CatchmentView
                    selectedState={selectedState}
                    selectedDistrict={selectedDistrict}
                    selectedCatchment={selectedCatchment}
                  />
                </motion.div>
              ) : activeTab === "hydrology" ? (
                <motion.div
                  key="hydrology"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <HydrologyView selectedState={selectedState} />
                </motion.div>
              ) : activeTab === "alerts" ? (
                <motion.div
                  key="alerts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <AlertsView
                    selectedState={selectedState}
                    selectedDistrict={selectedDistrict}
                    selectedCatchment={selectedCatchment}
                    riskProbability={prediction?.probability ? Math.round(prediction.probability * 100) : 78}
                    rainfallMm={features.rainfall_mm}
                  />
                </motion.div>
              ) : activeTab === "routes" ? (
                /* Circled Panel 9: OSM-Based Routes & Safety */
                <motion.div
                  key="routes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <RoutesSafetyView />
                </motion.div>
              ) : activeTab === "impact" ? (
                <motion.div
                  key="impact"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <ImpactView
                    selectedState={selectedState}
                    selectedDistrict={selectedDistrict}
                    selectedCatchment={selectedCatchment}
                  />
                </motion.div>
              ) : activeTab === "reports" ? (
                <motion.div
                  key="reports"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <ReportsView
                    selectedState={selectedState}
                    selectedDistrict={selectedDistrict}
                    selectedCatchment={selectedCatchment}
                    features={features}
                    prediction={prediction}
                  />
                </motion.div>
              ) : activeTab === "data-quality" ? (
                <motion.div
                  key="data-quality"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <DataQualityView />
                </motion.div>
              ) : activeTab === "settings" ? (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <SettingsView />
                </motion.div>
              ) : (
                /* Main Dashboard Screen (Panel 2 from Poster) */
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                {/* Step 5: View Results Banner with Take Action Bar (Step 6) */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0B0E19]/90 border border-[#181F30] shadow-lg shadow-black/40 backdrop-blur-xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
                        Active Location Assessment:
                      </span>
                      <span className="text-xs text-[#FF5A3D] font-bold bg-[#FF3B1D]/15 px-2.5 py-0.5 rounded-lg border border-[#FF3B1D]/25 font-mono">
                        {selectedDistrict}, {selectedState} ({selectedCatchment})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono">
                      Mode: <b className="text-emerald-400">Live Telemetry</b> • AI Engine: <b className="text-slate-200">XGBoost Real V2 + TreeSHAP</b>
                    </p>
                  </div>

                  {/* Step 6: Take Action Buttons (From Poster) */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono mr-1">
                      Take Action:
                    </span>

                    {/* Alerts Button */}
                    <button
                      onClick={handleTriggerAlert}
                      disabled={alertLoading}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#FF3B1D]/20 border border-[#FF3B1D]/40 text-[#FF5A3D] hover:bg-[#FF3B1D]/30 transition-all cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5 text-[#FF3B1D]" />
                      <span>{alertLoading ? "Alerting..." : "Alerts"}</span>
                    </button>

                    {/* Routes Button */}
                    <button
                      onClick={() => setActiveTab("routes")}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#0E1322] border border-[#1C253B] text-slate-200 hover:border-slate-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-400" />
                      <span>Routes</span>
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={handleShareReport}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#0E1322] border border-[#1C253B] text-slate-200 hover:border-slate-500 hover:text-white transition-all cursor-pointer"
                    >
                      {copiedNotification ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Top Section: Flood Risk Assessment + Weather Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Big Risk Summary Card (Gauge + Drivers) */}
                  <div className="lg:col-span-8">
                    {prediction ? (
                      <RiskSummaryCard data={prediction} />
                    ) : (
                      <div className="h-64 rounded-2xl bg-white/[0.03] animate-pulse border border-white/10" />
                    )}
                  </div>

                  {/* Weather Now & Rainfall Summary Table */}
                  <div className="lg:col-span-4">
                    <WeatherSummaryCard rainfallNow={features.rainfall_mm} />
                  </div>
                </div>

                {/* Middle Section: Catchment Map + SHAP Factors + Exposure */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Central Catchment Risk Map */}
                  <div className="lg:col-span-5">
                    <RiskMapCard
                      selectedState={selectedState}
                      selectedDistrict={selectedDistrict}
                      selectedCatchment={selectedCatchment}
                      riskPercentage={prediction?.probability ? Math.round(prediction.probability * 100) : 0}
                    />
                  </div>

                  {/* SHAP Main Factors (Top Contributors) */}
                  <div className="lg:col-span-4">
                    <ShapFactorsCard topDrivers={prediction?.top_drivers || []} />
                  </div>

                  {/* Exposure & Population Impact (Est.) */}
                  <div className="lg:col-span-3">
                    <ExposureImpactCard />
                  </div>
                </div>

                {/* Bottom Section: Hydrology + Alert Panel + Rainfall Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Hydrological Status */}
                  <div className="lg:col-span-3">
                    <HydrologyCard
                      riverName={mockHydrology.river_name}
                      currentLevel={mockHydrology.current_level_m}
                      dangerLevel={mockHydrology.danger_level_m}
                      trend={mockHydrology.trend}
                      rateCmHr={mockHydrology.rate_cm_hr}
                    />
                  </div>

                  {/* Alert Panel & Action System */}
                  <div className="lg:col-span-5">
                    <AlertPanel
                      status={alertData?.status || "idle"}
                      threadId={alertData?.thread_id || "—"}
                      draftedMessage={
                        alertData?.drafted_message ||
                        'Click "PREDICT RISK" on top to evaluate real-time telemetry, or click "Alerts" to draft emergency broadcast.'
                      }
                    />
                  </div>

                  {/* Risk Forecast Timeline / Rainfall Chart */}
                  <div className="lg:col-span-4">
                    <RainfallChart data={mockRainfallTimeline} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      )}
    </div>
  );
}
