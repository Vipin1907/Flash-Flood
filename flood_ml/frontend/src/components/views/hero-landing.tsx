"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  Globe,
  Sun,
  Bell,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  Search,
  ChevronDown,
  Info,
  TrendingUp,
  Map,
  ShieldAlert,
  Navigation,
  Building2,
  FileText,
  SlidersHorizontal,
  CloudLightning,
  SunMedium,
  CloudRain,
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
    districts: ["Cachar", "Karimganj", "Hailakandi", "Kamrup", "Dhubri"],
    catchments: ["A127 - Barak Basin", "Kushiyara Sub-basin", "Surma Valley"],
  },
  Uttarakhand: {
    districts: ["Uttarkashi", "Chamoli", "Rudraprayag", "Pithoragarh", "Tehri Garhwal"],
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
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [villageSearch, setVillageSearch] = useState("Silchar Central / Annapurna Ghat");
  const [leadTime, setLeadTime] = useState("Next 3 Hours");
  const [showAdvancedSliders, setShowAdvancedSliders] = useState(false);

  const handleStateSelect = (state: "Assam" | "Uttarakhand") => {
    const newDistrict = locations[state].districts[0];
    const newCatchment = locations[state].catchments[0];
    onLocationChange(state, newDistrict, newCatchment);
    if (state === "Assam") {
      setVillageSearch("Silchar Central / Annapurna Ghat");
      onFeaturesChange(scenarioPresets.high.features);
    } else {
      setVillageSearch("Dharali / Upper Bhagirathi Valley");
      onFeaturesChange(scenarioPresets.extreme.features);
    }
  };

  const handleSliderChange = (key: keyof FeatureInputs, value: number) => {
    onFeaturesChange({
      ...features,
      [key]: value,
    });
  };

  const handleCheckRisk = () => {
    onPredict(features, {
      state: selectedState,
      district: selectedDistrict,
      catchment: selectedCatchment,
    });
    onViewTelemetry();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#05070D] text-slate-100 selection:bg-[#FF5A1F] selection:text-white relative overflow-hidden font-sans">
      {/* ── Background Mountain / Atmospheric Glow ── */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none -z-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 25%, rgba(255, 90, 31, 0.15) 0%, transparent 60%),
            linear-gradient(to bottom, rgba(5, 7, 13, 0.75) 0%, rgba(5, 7, 13, 0.88) 50%, #05070D 100%),
            url('/mountain_hero_bg.jpg')
          `,
          backgroundPosition: "center top",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-[#05070D]/90 backdrop-blur-xl border-b border-[#141A29] px-6 lg:px-12 py-3.5 flex items-center justify-between">
        {/* Left: 3-Line Hamburger Menu Button + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            title="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-widest text-white uppercase font-sans">
              PRAVAH
            </span>
            <span className="text-xl font-black tracking-widest text-[#FF5A1F] uppercase font-sans">
              AI
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#how-it-works" className="hover:text-white transition-colors">
            {lang === "en" ? "How It Works" : "यह कैसे काम करता है"}
          </a>
          <a href="#check-risk-console" className="hover:text-white transition-colors">
            {lang === "en" ? "Prediction Console" : "पूर्वानुमान कंसोल"}
          </a>
          <a href="#agentic-ai" className="hover:text-white transition-colors">
            {lang === "en" ? "Agentic AI" : "एजेंटिक एआई"}
          </a>
          <button onClick={onOpenDashboard} className="hover:text-white transition-colors cursor-pointer">
            {lang === "en" ? "Command Dashboard" : "कमांड डैशबोर्ड"}
          </button>
        </nav>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <div className="flex items-center gap-1 bg-[#0E1322] border border-[#1C253B] rounded-full px-2.5 py-1 text-xs text-slate-300 font-medium">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => setLang("en")}
              className={cn("px-1 transition-colors cursor-pointer", lang === "en" ? "text-white font-bold" : "text-slate-500 hover:text-slate-300")}
            >
              English
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setLang("hi")}
              className={cn("px-1 transition-colors cursor-pointer", lang === "hi" ? "text-[#FF5A1F] font-bold" : "text-slate-500 hover:text-slate-300")}
            >
              हिंदी
            </button>
          </div>

          {/* Sun / Theme Button */}
          <button className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer hidden sm:flex">
            <Sun className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <div className="relative cursor-pointer hidden sm:flex">
            <div className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              <Bell className="w-4 h-4" />
            </div>
            <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#FF5A1F] text-[9px] font-bold text-white flex items-center justify-center">
              0
            </span>
          </div>

          {/* Launch Dashboard Button */}
          <button
            onClick={onOpenDashboard}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#FF5A1F] to-[#FF4500] hover:from-[#FF6A30] hover:to-[#FF5A1F] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF5A1F]/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>{lang === "en" ? "LAUNCH DASHBOARD" : "डैशबोर्ड खोलें"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── Main Hero Section ── */}
      <main className="flex-1 flex flex-col items-center justify-center pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center w-full">
        {/* Top Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#160E0A] border border-[#FF5A1F]/40 text-[#FF7A4D] text-[11px] font-mono font-bold tracking-wider uppercase mb-6 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] animate-pulse" />
          <span>• FLASH FLOOD INTELLIGENCE & EARLY WARNING SYSTEM •</span>
        </motion.div>

        {/* Big Brand Title: PRAVAH AI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-3 sm:gap-6 mb-4 select-none"
        >
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tight drop-shadow-2xl">
            PRAVAH
          </h1>
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-[#FF5A1F] tracking-tight drop-shadow-[0_0_35px_rgba(255,90,31,0.5)]">
            AI
          </h1>
        </motion.div>

        {/* 3-Part Slogan: PREDICT EARLY. EXPLAIN CLEARLY. ACT SAFELY. */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-lg sm:text-2xl md:text-3xl font-black tracking-wide mb-3 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-[#FF5A1F]">{lang === "en" ? "PREDICT EARLY." : "समय से पहले पूर्वानुमान."}</span>
          <span className="text-white">{lang === "en" ? "EXPLAIN CLEARLY." : "स्पष्ट व्याख्या."}</span>
          <span className="text-[#10B981]">{lang === "en" ? "ACT SAFELY." : "सुरक्षित कदम."}</span>
        </motion.div>

        {/* Description Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          {lang === "en"
            ? "AI-powered flash flood prediction, real-time risk mapping, intelligent alerts, and safe route guidance — all in one platform."
            : "एआई-संचालित फ़्लैश बाढ़ भविष्यवाणी, रीयल-टाइम जोखिम मानचित्रण, स्मार्ट अलर्ट और सुरक्षित निकासी मार्ग — सब एक मंच पर।"}
        </motion.p>

        {/* ── CARD: CHECK FLOOD RISK FOR YOUR AREA ── */}
        <motion.div
          id="check-risk-console"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-3xl rounded-3xl bg-[#090D18]/85 border border-[#FF5A1F]/35 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative text-left"
        >
          {/* Card Header */}
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-4 h-4 text-[#FF5A1F]" />
            <span className="text-xs sm:text-sm font-black text-[#FF5A1F] uppercase tracking-wider font-sans">
              {lang === "en" ? "CHECK FLOOD RISK FOR YOUR AREA" : "अपने क्षेत्र के लिए बाढ़ जोखिम की जाँच करें"}
            </span>
          </div>

          {/* Form Row 1: State, District, Village/Area */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* State */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                State
              </label>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => handleStateSelect(e.target.value as "Assam" | "Uttarakhand")}
                  className="w-full bg-[#05070E] border border-[#1A2338] hover:border-slate-500 focus:border-[#FF5A1F] rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none cursor-pointer focus:outline-none transition-colors"
                >
                  <option value="Assam">Assam</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* District */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                District
              </label>
              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => onLocationChange(selectedState, e.target.value, selectedCatchment)}
                  className="w-full bg-[#05070E] border border-[#1A2338] hover:border-slate-500 focus:border-[#FF5A1F] rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none cursor-pointer focus:outline-none transition-colors"
                >
                  {locations[selectedState].districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Village / Area */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                Village / Area
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={villageSearch}
                  onChange={(e) => setVillageSearch(e.target.value)}
                  placeholder="Search village or area"
                  className="w-full bg-[#05070E] border border-[#1A2338] hover:border-slate-500 focus:border-[#FF5A1F] rounded-xl pl-3.5 pr-8 py-2.5 text-xs text-white focus:outline-none transition-colors"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Form Row 2: Select Date, Lead Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Select Date */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                Select Date
              </label>
              <div className="relative">
                <div className="flex items-center gap-2 bg-[#05070E] border border-[#1A2338] rounded-xl px-3.5 py-2.5 text-xs text-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={dateTime}
                    onChange={(e) => onDateTimeChange(e.target.value)}
                    className="bg-transparent text-xs text-white focus:outline-none w-full font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Lead Time (Forecast Horizon) */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 mb-1.5">
                <span>Lead Time (Forecast Horizon)</span>
                <Info className="w-3 h-3 text-slate-400" />
              </label>
              <div className="relative">
                <select
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  className="w-full bg-[#05070E] border border-[#1A2338] hover:border-slate-500 focus:border-[#FF5A1F] rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none cursor-pointer focus:outline-none transition-colors"
                >
                  <option value="Next 3 Hours">Next 3 Hours</option>
                  <option value="Next 6 Hours">Next 6 Hours</option>
                  <option value="Next 12 Hours">Next 12 Hours</option>
                  <option value="Next 24 Hours">Next 24 Hours</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Quick Scenario Buttons Toggle (Optional Advanced) */}
          <div className="flex items-center justify-between pt-2 pb-4 border-t border-white/5 text-[11px]">
            <button
              onClick={() => setShowAdvancedSliders(!showAdvancedSliders)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#FF5A1F]" />
              <span>{showAdvancedSliders ? "Hide Telemetry Sliders" : "Customize Advanced Sliders"}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Presets:</span>
              <button
                onClick={() => onFeaturesChange(scenarioPresets.extreme.features)}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 cursor-pointer"
              >
                Cloudburst
              </button>
              <button
                onClick={() => onFeaturesChange(scenarioPresets.high.features)}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 cursor-pointer"
              >
                Monsoon
              </button>
            </div>
          </div>

          {/* Advanced Sliders Dropdown if toggled */}
          {showAdvancedSliders && (
            <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Current Rain (1h)</span>
                  <span className="font-bold text-white">{features.rainfall_mm} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={features.rainfall_mm}
                  onChange={(e) => handleSliderChange("rainfall_mm", parseFloat(e.target.value))}
                  className="w-full accent-[#FF5A1F]"
                />
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Antecedent (7d)</span>
                  <span className="font-bold text-white">{features.rainfall_7d} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="400"
                  value={features.rainfall_7d}
                  onChange={(e) => handleSliderChange("rainfall_7d", parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Soil Moisture Proxy</span>
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
          )}

          {/* Center Main Action Button: CHECK FLOOD RISK -> */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleCheckRisk}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-gradient-to-r from-[#FF5A1F] via-[#FF4500] to-[#E03A00] hover:from-[#FF6D38] hover:to-[#FF5A1F] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl shadow-[#FF5A1F]/35 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>{lang === "en" ? "CHECK FLOOD RISK" : "बाढ़ जोखिम की जाँच करें"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* ── SECTION: WHAT YOU WILL GET ── */}
        <div className="w-full mt-16 mb-6">
          {/* Centered Divider with Title */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1" />
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-300">
              <span className="text-[#FF5A1F]">◆</span>
              <span>{lang === "en" ? "WHAT YOU WILL GET" : "आपको क्या मिलेगा"}</span>
              <span className="text-[#FF5A1F]">◆</span>
            </div>
            <div className="h-px bg-gradient-to-r from-slate-700 via-slate-700 to-transparent flex-1" />
          </div>

          {/* 6 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 text-left">
            {/* 1. Flood Risk Prediction */}
            <div className="p-4 rounded-2xl bg-[#090D18]/80 border border-[#1C253B] hover:border-[#FF5A1F]/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 flex items-center justify-center mb-3">
                  <TrendingUp className="w-4 h-4 text-[#FF5A1F]" />
                </div>
                <h3 className="text-xs font-bold text-[#FF5A1F] mb-1.5">
                  Flood Risk Prediction
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Get risk score, confidence and lead time for your selected location.
                </p>
              </div>
            </div>

            {/* 2. Risk Map */}
            <div className="p-4 rounded-2xl bg-[#090D18]/80 border border-[#1C253B] hover:border-emerald-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-3">
                  <Map className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-xs font-bold text-emerald-400 mb-1.5">
                  Risk Map
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  View predicted risk areas on interactive real map with risk zones.
                </p>
              </div>
            </div>

            {/* 3. Alerts & Notifications */}
            <div className="p-4 rounded-2xl bg-[#090D18]/80 border border-[#1C253B] hover:border-amber-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-3">
                  <Bell className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-xs font-bold text-amber-400 mb-1.5">
                  Alerts & Notifications
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Receive timely alerts with sound notifications for high risk.
                </p>
              </div>
            </div>

            {/* 4. Route & Safety */}
            <div className="p-4 rounded-2xl bg-[#090D18]/80 border border-[#1C253B] hover:border-blue-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mb-3">
                  <Navigation className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-xs font-bold text-blue-400 mb-1.5">
                  Route & Safety
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Find safer routes and nearest shelters/hospitals in your area.
                </p>
              </div>
            </div>

            {/* 5. Nearby Shelters */}
            <div className="p-4 rounded-2xl bg-[#090D18]/80 border border-[#1C253B] hover:border-purple-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mb-3">
                  <Building2 className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-xs font-bold text-purple-400 mb-1.5">
                  Nearby Shelters
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Locate nearest shelters and hospitals for emergency support.
                </p>
              </div>
            </div>

            {/* 6. Reports & History */}
            <div className="p-4 rounded-2xl bg-[#090D18]/80 border border-[#1C253B] hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mb-3">
                  <FileText className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="text-xs font-bold text-cyan-400 mb-1.5">
                  Reports & History
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  View past predictions, reports and historical replay of flood events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-6 px-6 text-center border-t border-[#141A28] bg-[#05070D] text-xs text-slate-500 font-mono">
        <p>PRAVAH AI • DEIP-192 Flash Flood Intelligence & Early Warning System • 2026</p>
      </footer>
    </div>
  );
}
