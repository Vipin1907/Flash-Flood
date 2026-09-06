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
import { DISTRICT_PROFILES } from "@/lib/weather-service";
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
    <div className="flex min-h-screen bg-slate-100 dark:bg-[#05070B] text-slate-900 dark:text-white selection:bg-[#FF3B1D] selection:text-white transition-colors duration-200">
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
            dateTime={dateTime}
            onDateTimeChange={setDateTime}
            mode={mode}
            onModeChange={setMode}
            onBackToLanding={() => setActiveTab("landing")}
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
                    onDateTimeChange={setDateTime}
                    mode={mode}
                    onModeChange={setMode}
                    features={features}
                    onPredict={runPrediction}
                    onProceedToDashboard={() => setActiveTab("dashboard")}
                    onBackToHome={() => setActiveTab("landing")}
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
                /* Main Dashboard Screen — Flood Command Center */
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >

                {/* ── Command Center Header ── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-white via-white to-slate-50 dark:from-[#0A0E1A] dark:via-[#0C1020] dark:to-[#0E1224] border border-slate-200/80 dark:border-[#1A2035] shadow-sm transition-colors duration-200">
                  {/* Subtle accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF5A1F] via-[#FF8A50] to-[#FF5A1F]" />

                  <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF5A1F]/10 border border-[#FF5A1F]/20">
                          <Sparkles className="w-3 h-3 text-[#FF5A1F]" />
                          <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-wider">Flood Command Center</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-800 dark:text-white">
                          {selectedDistrict}, {selectedState}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-500 font-mono">
                          • {selectedCatchment}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-500 font-mono">
                        <span>⏱ {dateTime}</span>
                        <span>• Model: <b className="text-[#FF5A1F]">XGBoost V2 + TreeSHAP</b></span>
                        <span>• <b className="text-emerald-600 dark:text-emerald-400">●</b> Live Sync</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTriggerAlert}
                        disabled={alertLoading}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold bg-[#FF5A1F]/10 border border-[#FF5A1F]/25 text-[#FF5A1F] hover:bg-[#FF5A1F]/20 transition-all cursor-pointer"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>{alertLoading ? "Alerting..." : "Trigger Alert"}</span>
                      </button>

                      <button
                        onClick={() => setActiveTab("routes")}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold bg-blue-500/8 dark:bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/15 transition-all cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Safe Routes</span>
                      </button>

                      <button
                        onClick={handleShareReport}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-white/20 transition-all cursor-pointer"
                      >
                        {copiedNotification ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
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
                </div>

                {/* ── Quick Navigation Strip ── */}
                <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/90 dark:bg-[#080B14]/90 border border-slate-200/60 dark:border-white/5 backdrop-blur-sm">
                  {[
                    { key: "dashboard", label: "Risk Overview", num: "1" },
                    { key: "weather-telemetry", label: "Weather & Telemetry", num: "2" },
                    { key: "risk-map", label: "Risk Map", num: "3" },
                    { key: "alerts", label: "Alerts", num: "4" },
                    { key: "routes", label: "Evacuation Routes", num: "5" },
                    { key: "reports", label: "Reports", num: "6" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key as NavTab)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        activeTab === item.key
                          ? "bg-[#FF5A1F] text-white shadow-sm shadow-[#FF5A1F]/20"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className={`text-[9px] font-black w-4 h-4 rounded flex items-center justify-center ${
                        activeTab === item.key
                          ? "bg-white/20"
                          : "bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-500"
                      }`}>{item.num}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* ── Row 1: Risk Assessment + Weather Summary ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-8">
                    {prediction ? (
                      <RiskSummaryCard data={prediction} />
                    ) : (
                      <div className="h-64 rounded-2xl bg-slate-100 dark:bg-white/[0.03] animate-pulse border border-slate-200 dark:border-white/10" />
                    )}
                  </div>

                  <div className="lg:col-span-4">
                    <WeatherSummaryCard
                      rainfallNow={features.rainfall_mm}
                      rainfall1d={features.rainfall_1d}
                      rainfall3d={features.rainfall_3d}
                      rainfall7d={features.rainfall_7d}
                      rainfall30d={features.rainfall_30d}
                      districtName={selectedDistrict}
                      onViewDetails={() => setActiveTab("weather-telemetry")}
                    />
                  </div>
                </div>

                {/* ── Row 2: Catchment Map + SHAP Factors + Exposure Impact ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-5">
                    <RiskMapCard
                      selectedState={selectedState}
                      selectedDistrict={selectedDistrict}
                      selectedCatchment={selectedCatchment}
                      riskPercentage={prediction?.probability ? Math.round(prediction.probability * 100) : 0}
                    />
                  </div>

                  <div className="lg:col-span-4">
                    <ShapFactorsCard topDrivers={prediction?.top_drivers || []} />
                  </div>

                  <div className="lg:col-span-3">
                    <ExposureImpactCard />
                  </div>
                </div>

                {/* ── Row 3: Hydrology + Alert Panel + Rainfall Timeline ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-4">
                    {(() => {
                      const districtProfile = DISTRICT_PROFILES[selectedDistrict] || DISTRICT_PROFILES["Cachar"];
                      const currentRiverLevel = parseFloat((districtProfile.baseRiverLevelMeters + (features.rainfall_mm > 10 ? 1.35 : 0.55)).toFixed(2));
                      return (
                        <HydrologyCard
                          riverName={districtProfile.riverName}
                          currentLevel={currentRiverLevel}
                          warningLevel={districtProfile.warningLevelMeters}
                          dangerLevel={districtProfile.dangerLevelMeters}
                          trend={features.rainfall_mm > 10 ? "rising" : "stable"}
                          rateCmHr={features.rainfall_mm > 10 ? 4.2 : 1.2}
                        />
                      );
                    })()}
                  </div>

                  <div className="lg:col-span-4">
                    <AlertPanel
                      status={alertData?.status || "idle"}
                      threadId={alertData?.thread_id || "—"}
                      draftedMessage={
                        alertData?.drafted_message ||
                        'System ready. Click "Trigger Alert" to broadcast emergency alerts to authorities and ground teams.'
                      }
                    />
                  </div>

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
