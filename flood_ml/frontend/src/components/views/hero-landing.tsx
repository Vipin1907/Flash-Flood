"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Play,
  Cpu,
  Layers,
  MapPin,
  Clock,
  Compass,
  SlidersHorizontal,
  CloudLightning,
  SunMedium,
  CloudRain,
  ChevronDown,
  Activity,
  CheckCircle2,
  Menu,
} from "lucide-react";
import { FeatureInputs } from "../layout/top-filter-bar";
import { cn } from "@/lib/utils";

interface HeroLandingProps {
  onToggleSidebar?: () => void;
  onStartPrediction: () => void;
  onOpenDashboard: () => void;
  onViewTelemetry: () => void;
  selectedState: "Assam" | "Uttarakhand";
  selectedDistrict: string;
  selectedCatchment: string;
  onLocationChange: (state: "Assam" | "Uttarakhand", district: string, catchment: string) => void;
  features: FeatureInputs;
  onFeaturesChange: (features: FeatureInputs) => void;
  onPredict: (features: FeatureInputs, loc?: { state: string; district: string; catchment: string }) => void;
  isAnalyzing: boolean;
  dateTime: string;
  onDateTimeChange: (dt: string) => void;
  mode: "live" | "historical";
  onModeChange: (m: "live" | "historical") => void;
}

const locations = {
  Assam: {
    districts: ["Cachar", "Karimganj", "Hailakandi", "Kamrup"],
    catchments: ["A127 - Barak Basin", "Kushiyara Sub-basin", "Surma Valley"],
  },
  Uttarakhand: {
    districts: ["Uttarkashi", "Chamoli", "Rudraprayag", "Pithoragarh"],
    catchments: ["Upper Bhagirathi", "Alaknanda Basin", "Mandakini Valley"],
  },
};

const scenarioPresets = {
  extreme: {
    name: "Severe Cloudburst (Uttarkashi)",
    icon: CloudLightning,
    color: "text-red-400 border-red-500/30 bg-red-500/10",
    features: {
      rainfall_mm: 6.6,
      rainfall_1d: 6.6,
      rainfall_3d: 6.7,
      rainfall_7d: 104.4,
      rainfall_30d: 181.5,
      soil_saturation_proxy: 0.317,
      ndvi: 0.65,
      slope_mean: 29.7,
      flow_accumulation: 3.0,
    },
  },
  high: {
    name: "Barak Basin Monsoon Flood (Assam)",
    icon: CloudRain,
    color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    features: {
      rainfall_mm: 15.0,
      rainfall_1d: 15.0,
      rainfall_3d: 45.0,
      rainfall_7d: 85.0,
      rainfall_30d: 140.0,
      soil_saturation_proxy: 0.35,
      ndvi: 0.65,
      slope_mean: 28.0,
      flow_accumulation: 3.0,
    },
  },
  normal: {
    name: "Moderate / Normal Season",
    icon: SunMedium,
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    features: {
      rainfall_mm: 1.0,
      rainfall_1d: 1.0,
      rainfall_3d: 2.0,
      rainfall_7d: 5.0,
      rainfall_30d: 15.0,
      soil_saturation_proxy: 0.05,
      ndvi: 0.65,
      slope_mean: 15.0,
      flow_accumulation: 3.0,
    },
  },
};

export function HeroLanding({
  onToggleSidebar,
  onOpenDashboard,
  onViewTelemetry,
  selectedState,
  selectedDistrict,
  selectedCatchment,
  onLocationChange,
  features,
  onFeaturesChange,
  onPredict,
  isAnalyzing,
  dateTime,
  onDateTimeChange,
  mode,
  onModeChange,
}: HeroLandingProps) {
  const [villageArea, setVillageArea] = useState("Silchar Central / Annapurna Ghat");

  const handleStateSelect = (state: "Assam" | "Uttarakhand") => {
    const newDistrict = locations[state].districts[0];
    const newCatchment = locations[state].catchments[0];
    onLocationChange(state, newDistrict, newCatchment);
    if (state === "Assam") {
      setVillageArea("Silchar Central / Annapurna Ghat");
      onFeaturesChange(scenarioPresets.high.features);
    } else {
      setVillageArea("Dharali / Upper Bhagirathi Valley");
      onFeaturesChange(scenarioPresets.extreme.features);
    }
  };

  const handleSliderChange = (key: keyof FeatureInputs, value: number) => {
    onFeaturesChange({
      ...features,
      [key]: value,
    });
  };

  const scrollToConsole = () => {
    document.getElementById("prediction-console")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-100 selection:bg-[#FF3B1D] selection:text-white">
      {/* ── Top Navigation Bar (Contagion Style) ── */}
      <header className="sticky top-0 z-40 bg-[#05070B]/90 backdrop-blur-xl border-b border-[#141A28] px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Left: 3-Line Hamburger Menu Button + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-[#0B0E18] border border-[#181F30] text-slate-300 hover:text-white hover:border-[#FF3B1D]/40 transition-all flex items-center justify-center cursor-pointer shadow-sm group"
            title="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-slate-300 group-hover:text-[#FF3B1D] transition-colors" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#FF3B1D]/15 border border-[#FF3B1D]/30">
              <div className="w-3 h-3 rounded-full bg-[#FF3B1D] shadow-lg shadow-[#FF3B1D]/70 animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-widest text-white uppercase">
                PRAVAH
              </span>
              <span className="text-base font-black tracking-widest text-[#FF3B1D] uppercase">
                AI.
              </span>
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#prediction-console" className="hover:text-white transition-colors">Prediction Console</a>
          <a href="#agents" className="hover:text-white transition-colors">Agentic AI</a>
          <button onClick={onOpenDashboard} className="hover:text-white transition-colors">Command Dashboard</button>
        </nav>

        {/* Launch Dashboard Button */}
        <button
          onClick={onOpenDashboard}
          className="flex items-center gap-2 bg-[#FF3B1D] hover:bg-[#E02E10] text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase shadow-lg shadow-[#FF3B1D]/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span>Launch Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* ── Hero Section (Contagion Style Massive Typography) ── */}
      <section className="relative pt-16 pb-20 px-6 lg:px-12 flex flex-col items-center text-center overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#FF3B1D]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#120B0A] border border-[#FF3B1D]/30 text-[#FF5A3D] text-[11px] font-mono font-semibold tracking-widest uppercase mb-8 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1D] animate-ping" />
          <span>• FLASH FLOOD INTELLIGENCE & EARLY WARNING SYSTEM •</span>
        </motion.div>

        {/* Massive Brand Headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center justify-center font-black tracking-tighter leading-none mb-6 select-none"
        >
          <h1 className="text-6xl sm:text-8xl md:text-9xl text-white tracking-widest drop-shadow-2xl">
            PRAVAH
          </h1>
          <div className="flex items-center text-7xl sm:text-9xl md:text-[140px] text-[#FF3B1D] -mt-2 sm:-mt-4">
            <span>AI</span>
            <span className="w-4 h-4 sm:w-6 sm:h-6 bg-[#38BDF8] ml-2 sm:ml-4 rounded-sm shadow-lg shadow-[#38BDF8]/60 animate-pulse" />
          </div>
        </motion.div>

        {/* Punchline from Reference Poster */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mb-8 space-y-3"
        >
          <p className="text-xl sm:text-2xl md:text-3xl font-black tracking-wide">
            <span className="text-[#FF3B1D]">PREDICT EARLY.</span>{" "}
            <span className="text-white">EXPLAIN CLEARLY.</span>{" "}
            <span className="text-emerald-400">ACT SAFELY.</span>
          </p>
          <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
            We don't just predict flash floods — we explain the risk with native TreeSHAP,
            draft bilingual SMS alerts with LangGraph & Gemini, and compute safe evacuation corridors with OpenStreetMap.
          </p>
        </motion.div>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={scrollToConsole}
            className="flex items-center gap-2 bg-[#FF3B1D] hover:bg-[#E02E10] text-white px-7 py-3.5 rounded-xl text-sm font-black tracking-wider uppercase shadow-xl shadow-[#FF3B1D]/35 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            <span>Run AI Prediction</span>
            <Play className="w-4 h-4 fill-white" />
          </button>

          <button
            onClick={onOpenDashboard}
            className="flex items-center gap-2 bg-[#0B0E18] hover:bg-[#121726] border border-[#181F30] hover:border-slate-500 text-slate-200 px-7 py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase transition-all cursor-pointer"
          >
            <span>Open Command Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* ── 4 Big Contagion Metric Badges ── */}
        <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          {/* Stat 1 */}
          <div className="bg-[#0B0E18]/90 border border-[#181F30] rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF3B1D]/40 transition-all">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF3B1D]/40 to-transparent" />
            <div className="text-3xl sm:text-4xl font-black text-[#FF3B1D] font-mono mb-1">
              97%
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              XGBoost Accuracy
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              Trained on Assam & Uttarakhand flood records
            </p>
          </div>

          {/* Stat 2 */}
          <div className="bg-[#0B0E18]/90 border border-[#181F30] rounded-2xl p-6 relative overflow-hidden group hover:border-yellow-500/40 transition-all">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
            <div className="text-3xl sm:text-4xl font-black text-yellow-400 font-mono mb-1">
              3-HOURS
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Early Lead Time
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              Actionable evacuation window before peak surge
            </p>
          </div>

          {/* Stat 3 */}
          <div className="bg-[#0B0E18]/90 border border-[#181F30] rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
            <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono mb-1">
              TREESHAP
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Explainable AI
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              Transparent C++ feature attribution drivers
            </p>
          </div>

          {/* Stat 4 */}
          <div className="bg-[#0B0E18]/90 border border-[#181F30] rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mb-1">
              OSM-SAFE
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Safe Evacuation
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              Obstacle-weighted Dijkstra safe routes
            </p>
          </div>
        </div>
      </section>

      {/* ── 1st Page Interactive Prediction Console ── */}
      <section id="prediction-console" className="py-16 px-6 lg:px-12 bg-[#06080E] border-t border-[#141A28]">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <span className="text-[11px] font-mono font-bold text-[#FF5A3D] bg-[#FF3B1D]/10 border border-[#FF3B1D]/25 px-3 py-1 rounded-full uppercase tracking-widest">
              STEP 1: INTERACTIVE INPUT CONSOLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
              Configure Location & Catchment Telemetry
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Select your region, pick a preset scenario or customize weather sliders, then click Predict Risk.
            </p>
          </div>

          {/* Input Console Box */}
          <div className="bg-[#0B0E18] border border-[#181F30] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF3B1D]/50 to-transparent" />

            {/* Row 1: Location Dropdowns & Village/Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* State */}
              <div className="bg-[#080B12] border border-[#161D2C] rounded-2xl p-4">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
                  1. State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateSelect(e.target.value as "Assam" | "Uttarakhand")}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer"
                >
                  <option value="Assam" className="bg-[#080B12] text-white">Assam (Barak River)</option>
                  <option value="Uttarakhand" className="bg-[#080B12] text-white">Uttarakhand (Himalayan)</option>
                </select>
              </div>

              {/* District */}
              <div className="bg-[#080B12] border border-[#161D2C] rounded-2xl p-4">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
                  2. District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => onLocationChange(selectedState, e.target.value, selectedCatchment)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer"
                >
                  {locations[selectedState].districts.map((d) => (
                    <option key={d} value={d} className="bg-[#080B12] text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Catchment Basin */}
              <div className="bg-[#080B12] border border-[#161D2C] rounded-2xl p-4">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
                  3. Catchment Basin
                </label>
                <select
                  value={selectedCatchment}
                  onChange={(e) => onLocationChange(selectedState, selectedDistrict, e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer"
                >
                  {locations[selectedState].catchments.map((c) => (
                    <option key={c} value={c} className="bg-[#080B12] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Village / Area */}
              <div className="bg-[#080B12] border border-[#161D2C] rounded-2xl p-4">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
                  4. Village / Town
                </label>
                <input
                  type="text"
                  value={villageArea}
                  onChange={(e) => setVillageArea(e.target.value)}
                  placeholder="e.g. Silchar / Dharali"
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-200 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Row 2: Mode & Date/Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Mode Toggle */}
              <div className="bg-[#080B12] border border-[#161D2C] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
                    Telemetry Mode
                  </label>
                  <span className="text-xs text-slate-400 font-mono">
                    {mode === "live" ? "Real-time radar & gauge feeds" : "Historical storm replay (Dharali 2023)"}
                  </span>
                </div>
                <div className="bg-black/50 p-1 rounded-xl border border-white/10 flex gap-1">
                  <button
                    onClick={() => onModeChange("live")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      mode === "live"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    Live
                  </button>
                  <button
                    onClick={() => {
                      onModeChange("historical");
                      onDateTimeChange("29 Aug 2023 04:30 AM");
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      mode === "historical"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    Historical
                  </button>
                </div>
              </div>

              {/* Date & Time Picker */}
              <div className="bg-[#080B12] border border-[#161D2C] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
                    Forecast Date & Time
                  </label>
                  <span className="text-xs text-slate-400 font-mono">Target observation window</span>
                </div>
                <div className="flex items-center gap-2 bg-[#05070B] border border-[#1C253B] px-3 py-1.5 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-[#FF3B1D]" />
                  <input
                    type="text"
                    value={dateTime}
                    onChange={(e) => onDateTimeChange(e.target.value)}
                    className="bg-transparent text-xs font-mono font-bold text-white w-36 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: 1-Click Quick Scenario Presets */}
            <div className="mb-6">
              <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                ⚡ Quick Scenarios (Or Adjust Sliders Below):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(scenarioPresets).map(([key, item]) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => onFeaturesChange(item.features)}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all text-left hover:scale-[1.02] cursor-pointer",
                        item.color
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 4: Parameter Sliders */}
            <div className="bg-[#080B12] border border-[#161D2C] rounded-2xl p-5 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <div className="flex justify-between text-xs text-slate-400 font-mono mb-1.5">
                  <span>Current Rainfall (1h)</span>
                  <span className="font-bold text-white">{features.rainfall_mm} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="1"
                  value={features.rainfall_mm}
                  onChange={(e) => handleSliderChange("rainfall_mm", parseFloat(e.target.value))}
                  className="w-full accent-[#FF3B1D]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 font-mono mb-1.5">
                  <span>Antecedent Rain (7-Day)</span>
                  <span className="font-bold text-white">{features.rainfall_7d} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="400"
                  step="5"
                  value={features.rainfall_7d}
                  onChange={(e) => handleSliderChange("rainfall_7d", parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 font-mono mb-1.5">
                  <span>Soil Saturation Proxy</span>
                  <span className="font-bold text-emerald-400">{Math.round(features.soil_saturation_proxy * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={features.soil_saturation_proxy}
                  onChange={(e) => handleSliderChange("soil_saturation_proxy", parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>

            {/* Row 5: Action Buttons (Fetch Weather Telemetry + Run Prediction) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="text-xs text-slate-400 font-mono">
                Location: <b className="text-white">{villageArea}, {selectedDistrict}</b> • Basin: <b className="text-cyan-400">{selectedCatchment}</b>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Step 2: Fetch & View Weather Telemetry Button */}
                <button
                  onClick={onViewTelemetry}
                  className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-[#0E1526] hover:bg-[#16213D] border border-blue-500/40 text-blue-300 hover:text-white px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-blue-500/10"
                >
                  <CloudRain className="w-4 h-4 text-blue-400" />
                  <span>Fetch & View Weather Telemetry</span>
                </button>

                {/* Direct Predict Button */}
                <button
                  onClick={() => {
                    onPredict(features, { state: selectedState, district: selectedDistrict, catchment: selectedCatchment });
                    onOpenDashboard();
                  }}
                  disabled={isAnalyzing}
                  className="flex-1 md:flex-initial flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#FF3B1D] via-[#FF4E33] to-[#D9260B] hover:from-[#FF4E33] hover:to-[#E02E10] text-white px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-black tracking-widest uppercase shadow-2xl shadow-[#FF3B1D]/40 border border-[#FF3B1D]/50 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>PREDICT FLOOD RISK</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 text-center border-t border-[#141A28] bg-[#05070B] text-xs text-slate-500 font-mono">
        <p>PRAVAH AI • DEIP-192 Flash Flood Intelligence & Safe Evacuation System • 2026</p>
      </footer>
    </div>
  );
}
