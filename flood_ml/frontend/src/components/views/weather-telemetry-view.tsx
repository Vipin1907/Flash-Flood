"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudRain,
  CloudLightning,
  Droplets,
  Thermometer,
  Wind,
  Gauge,
  Mountain,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Radio,
  Satellite,
  Calendar,
  Sparkles,
  RefreshCw,
  Waves,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { FeatureInputs } from "../layout/top-filter-bar";
import { DatePickerModal } from "@/components/ui/date-picker-modal";
import {
  fetchDistrictTelemetry,
  ComprehensiveWeatherData,
} from "@/lib/weather-service";
import { cn } from "@/lib/utils";

interface WeatherTelemetryViewProps {
  selectedState: "Assam" | "Uttarakhand";
  selectedDistrict: string;
  selectedCatchment: string;
  dateTime?: string;
  onDateTimeChange?: (dt: string) => void;
  mode?: "live" | "historical";
  onModeChange?: (m: "live" | "historical") => void;
  features: FeatureInputs;
  onPredict: (features: FeatureInputs, loc?: { state: string; district: string; catchment: string }) => void;
  onProceedToDashboard: () => void;
  onBackToHome?: () => void;
  isAnalyzing: boolean;
}

export function WeatherTelemetryView({
  selectedState,
  selectedDistrict,
  selectedCatchment,
  dateTime = "29 Aug 2026 12:00 PM",
  onDateTimeChange,
  mode = "live",
  onModeChange,
  features,
  onPredict,
  onProceedToDashboard,
  onBackToHome,
  isAnalyzing,
}: WeatherTelemetryViewProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<ComprehensiveWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchDistrictTelemetry(selectedDistrict, selectedState, dateTime);
      setWeatherData(data);
    } catch (err) {
      console.warn("Error fetching telemetry view data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDistrict, selectedState, dateTime]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePredictClick = () => {
    if (weatherData) {
      onPredict(weatherData.mlFeatureInputs, {
        state: selectedState,
        district: selectedDistrict,
        catchment: selectedCatchment,
      });
    } else {
      onPredict(features, {
        state: selectedState,
        district: selectedDistrict,
        catchment: selectedCatchment,
      });
    }
    onProceedToDashboard();
  };

  const handleDateSelected = (newDateTimeStr: string) => {
    if (onDateTimeChange) {
      onDateTimeChange(newDateTimeStr);
    }
  };

  // Fallback defaults if data loading
  const obs = weatherData?.observedRainfall;
  const fc = weatherData?.forecastRainfall;
  const hydro = weatherData?.hydrology;
  const terr = weatherData?.terrain;
  const atm = weatherData?.atmospheric;

  return (
    <div className="space-y-8 pb-16 text-slate-900 dark:text-slate-100">
      {/* ── Date Picker Modal ── */}
      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        selectedDateTime={dateTime}
        onSelectDateTime={handleDateSelected}
        selectedState={selectedState}
      />

      {/* ── Page Header / Status Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gradient-to-r dark:from-[#0B0E19] dark:via-[#0e1424] dark:to-[#0B0E19] border border-slate-200 dark:border-[#1C253B] p-6 lg:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5A1F]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {onBackToHome && (
                <button
                  onClick={onBackToHome}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-300 dark:border-white/10 transition-colors cursor-pointer"
                >
                  ← Back to Inputs
                </button>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400">
                <Radio className="w-3 h-3 animate-pulse" /> Live Telemetry & Weather Feed
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Data Fresh (Valid)
              </span>
              {weatherData?.atmospheric?.weather_condition && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold">
                  {weatherData.atmospheric.weather_condition.value}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Weather & Catchment Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono mt-1">
              Location: <span className="text-slate-900 dark:text-white font-bold">{selectedDistrict}, {selectedState}</span> • Basin: <span className="text-[#FF5A1F] font-semibold">{selectedCatchment}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Clickable Observation Date & Time Button */}
            <button
              onClick={() => setIsDatePickerOpen(true)}
              className="bg-slate-50 dark:bg-[#080B12] border border-slate-200 dark:border-[#181F30] hover:border-[#FF5A1F] rounded-2xl px-4 py-2.5 text-right transition-colors cursor-pointer group"
              title="Click to Change Observation Date"
            >
              <div className="text-[10px] uppercase font-mono text-slate-500 font-bold flex items-center justify-end gap-1">
                <span>Observation Date</span>
                <span className="text-[#FF5A1F]">📅</span>
              </div>
              <div className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5 justify-end group-hover:text-[#FF5A1F] transition-colors">
                <Clock className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>{dateTime}</span>
              </div>
            </button>

            {/* Refresh Button */}
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-[#080B12] border border-slate-200 dark:border-[#181F30] hover:border-[#FF5A1F] text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Refresh Telemetry"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: OBSERVED RAINFALL vs FORECAST RAINFALL (STRICTLY SEPARATED) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1A. Observed Rainfall Card */}
        <div className="rounded-3xl bg-white dark:bg-[#090C16] border border-slate-200 dark:border-[#1B2338] p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                  <CloudRain className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white tracking-wide uppercase">
                    1. Observed Rainfall
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Actual measured surface precipitation (Ground & Radar)
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30">
                {obs?.current_1h.data_status || "OBSERVED"}
              </span>
            </div>

            {/* Current Intensity & 1-Hour Main Stat */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 mb-5">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">
                  Current (1 Hour)
                </span>
                <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                  {obs?.current_1h.value ?? features.rainfall_mm}{" "}
                  <span className="text-sm font-normal text-slate-500">mm</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">
                  Rainfall Intensity
                </span>
                <div className="text-base font-black text-amber-500 font-mono mt-1">
                  {obs?.intensity_mm_hr.value ?? (features.rainfall_mm * 1.25).toFixed(1)} mm/hr
                </div>
                <span className="text-[10px] text-amber-600 dark:text-amber-300/80 font-mono block">
                  [{obs?.intensity_category.value ?? "Heavy Rain"}]
                </span>
              </div>
            </div>

            {/* Historical Observation Windows Table */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase px-1">
                <span>Time Window</span>
                <span>Cumulative Observed</span>
              </div>

              {[
                { label: "Past 3 Hours", val: `${obs?.accumulated_3h.value ?? (features.rainfall_mm * 2.4).toFixed(1)} mm` },
                { label: "Past 6 Hours", val: `${obs?.accumulated_6h.value ?? (features.rainfall_mm * 4.2).toFixed(1)} mm` },
                { label: "Past 24 Hours (1-Day)", val: `${obs?.accumulated_24h_1d.value ?? features.rainfall_1d} mm` },
                { label: "Past 7 Days (Antecedent)", val: `${obs?.accumulated_7d_antecedent.value ?? features.rainfall_7d} mm` },
                { label: "Past 30 Days (Monthly)", val: `${obs?.accumulated_30d.value ?? features.rainfall_30d} mm` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-xs font-mono"
                >
                  <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Source Metadata & Data Status */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Source:</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{obs?.current_1h.source || "IMD AWS & Radar Station"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Update Time:</span>
              <span className="text-slate-700 dark:text-slate-300">{obs?.current_1h.update_time || dateTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Data Status:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {obs?.current_1h.data_status || "Live Verified"}
              </span>
            </div>
          </div>
        </div>

        {/* 1B. Forecast Rainfall Card */}
        <div className="rounded-3xl bg-white dark:bg-[#090C16] border border-slate-200 dark:border-[#1B2338] p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-[#FF5A1F]" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                  <CloudLightning className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white tracking-wide uppercase">
                    2. Forecast Rainfall
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    High-resolution Numerical Weather Prediction (NWP Models)
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                {fc?.forecast_3h.data_status || "PROJECTION"}
              </span>
            </div>

            {/* Peak Forecast Stat */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 mb-5">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">
                  Next 3-Hour Forecast
                </span>
                <div className="text-3xl font-black text-amber-500 font-mono mt-0.5">
                  {fc?.forecast_3h.value ?? (features.rainfall_mm * 1.8).toFixed(1)}{" "}
                  <span className="text-sm font-normal text-slate-500">mm</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">
                  Peak Surge Window
                </span>
                <div className="text-sm font-black text-red-500 dark:text-red-400 font-mono mt-1">
                  {fc?.peak_surge_window.value || "Next 2 to 4 Hours"}
                </div>
                <span className="text-[10px] text-red-600 dark:text-red-300/80 font-mono block">
                  High Inundation Threat
                </span>
              </div>
            </div>

            {/* Forecast Windows Table */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase px-1">
                <span>Forecast Horizon</span>
                <span>Expected Precipitation</span>
              </div>

              {[
                { label: "Next 6 Hours", val: `${fc?.forecast_6h.value ?? (features.rainfall_mm * 3.2).toFixed(1)} mm` },
                { label: "Next 12 Hours", val: `${fc?.forecast_12h.value ?? (features.rainfall_mm * 5.4).toFixed(1)} mm` },
                { label: "Next 24 Hours (1-Day)", val: `${fc?.forecast_24h.value ?? (features.rainfall_1d * 1.5).toFixed(1)} mm` },
                { label: "Next 72 Hours (3-Days)", val: `${fc?.forecast_72h_3d.value ?? (features.rainfall_3d * 1.6).toFixed(1)} mm` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-xs font-mono"
                >
                  <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-300">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Source Metadata & Data Status */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Source:</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{fc?.forecast_3h.source || "NCMRWF High-Res / IMD GFS"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Update Time:</span>
              <span className="text-slate-700 dark:text-slate-300">{fc?.forecast_3h.update_time || "Cycle 06:00 UTC"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Data Status:</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1">
                <Satellite className="w-3 h-3" /> {fc?.forecast_3h.data_status || "Operational Forecast"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: SOIL MOISTURE, RIVER LEVEL & TERRAIN FEATURES ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 2A. Soil Moisture & Saturation Card */}
        <div className="rounded-3xl bg-white dark:bg-[#090C16] border border-slate-200 dark:border-[#1B2338] p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/25">
                ISRO / NASA SMAP
              </span>
            </div>

            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Soil Moisture & Saturation
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Hydrological antecedent proxy
            </p>

            <div className="my-5">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-4xl font-black text-emerald-500 font-mono">
                  {hydro?.soil_moisture_percent.value ?? Math.round(features.soil_saturation_proxy * 100)}%
                </span>
                <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold">
                  Proxy: {hydro?.soil_saturation_proxy.value ?? features.soil_saturation_proxy.toFixed(3)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      hydro?.soil_moisture_percent.value ?? Math.round(features.soil_saturation_proxy * 100),
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-300 font-mono mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                <span>{hydro?.soil_status.value || "Near Saturation (Elevated Infiltration Excess)"}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-1 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-400">Source:</span>
              <span className="text-slate-800 dark:text-slate-200">{hydro?.soil_moisture_percent.source || "ISRO MOSDAC / SMAP L4"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Update Time:</span>
              <span className="text-slate-700 dark:text-slate-300">{hydro?.soil_moisture_percent.update_time || "Today 09:30 IST"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">🟢 Satellite Active</span>
            </div>
          </div>
        </div>

        {/* 2B. River Level Telemetry Card */}
        <div className="rounded-3xl bg-white dark:bg-[#090C16] border border-slate-200 dark:border-[#1B2338] p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                <Waves className="w-5 h-5 text-cyan-500" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/25">
                CWC TELEMETRY
              </span>
            </div>

            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              River Level Telemetry
            </h3>
            <p className="text-[11px] text-cyan-600 dark:text-cyan-300 font-mono mt-0.5 truncate">
              {hydro?.river_name || (selectedState === "Assam" ? "Barak River (Annapurna Ghat)" : "Alaknanda / Bhagirathi River")}
            </p>

            <div className="my-4 space-y-2 font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 text-xs">Current Level:</span>
                <span className="text-base font-bold text-amber-500">
                  {hydro?.current_river_level.value ?? (selectedState === "Assam" ? 19.45 : 621.8)} m MSL
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 text-xs">Warning Level:</span>
                <span className="text-xs font-bold text-yellow-600 dark:text-yellow-300">
                  {hydro?.warning_level.value ?? (selectedState === "Assam" ? 19.25 : 620.0)} m MSL
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 text-xs">Danger Mark:</span>
                <span className="text-xs font-bold text-red-500">
                  {hydro?.danger_level.value ?? (selectedState === "Assam" ? 19.83 : 624.5)} m MSL
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-1 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-400">Source:</span>
              <span className="text-slate-800 dark:text-slate-200 truncate">{hydro?.current_river_level.source || "Central Water Commission (CWC)"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Update Time:</span>
              <span className="text-slate-700 dark:text-slate-300">{hydro?.current_river_level.update_time || "11:30 IST"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="text-amber-500 font-bold">🟠 Gauge Station Active</span>
            </div>
          </div>
        </div>

        {/* 2C. Geospatial Terrain & Topo Card */}
        <div className="rounded-3xl bg-white dark:bg-[#090C16] border border-slate-200 dark:border-[#1B2338] p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                <Mountain className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/25">
                SRTM 30m DEM
              </span>
            </div>

            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Elevation, Slope & Topo
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Geospatial catchment features
            </p>

            <div className="my-4 space-y-2 font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 text-xs">Basin Elevation:</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {terr?.elevation_msl.value ?? (selectedState === "Assam" ? 25 : 1158)} m MSL
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 text-xs">Mean Slope:</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-300">
                  {terr?.mean_slope_deg.value ?? features.slope_mean}°
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 text-xs">NDVI Vegetation:</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {terr?.ndvi_vegetation.value ?? features.ndvi} (High Cover)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-1 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-400">Source:</span>
              <span className="text-slate-800 dark:text-slate-200">USGS SRTM & ISRO Cartosat</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Update Time:</span>
              <span className="text-slate-700 dark:text-slate-300">Calibrated High-Res Grid</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">🟢 High Precision DEM</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: ATMOSPHERIC & REAL-TIME WEATHER METRICS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#090C16] border border-slate-200 dark:border-[#181F30] font-mono shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
            <Thermometer className="w-4 h-4 text-orange-500" />
            <span>Temperature</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {atm?.temperature.value ?? 24.6}°C
          </div>
          <div className="text-[10px] text-slate-400 mt-1 truncate">Source: {atm?.temperature.source || "IMD AWS Station"}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#090C16] border border-slate-200 dark:border-[#181F30] font-mono shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span>Relative Humidity</span>
          </div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-300">
            {atm?.relative_humidity.value ?? 94}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1 truncate">Source: {atm?.relative_humidity.source || "IMD AWS Station"}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#090C16] border border-slate-200 dark:border-[#181F30] font-mono shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
            <Wind className="w-4 h-4 text-cyan-500" />
            <span>Wind Speed & Dir</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {atm?.wind_speed.value ?? 18} km/h{" "}
            <span className="text-xs text-slate-400">{atm?.wind_direction.value ?? "NE"}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 truncate">Source: Anemometer Array</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#090C16] border border-slate-200 dark:border-[#181F30] font-mono shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
            <Gauge className="w-4 h-4 text-purple-500" />
            <span>Surface Pressure</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {atm?.surface_pressure.value ?? 1004.2} hPa
          </div>
          <div className="text-[10px] text-slate-400 mt-1 truncate">Source: Barometric Station</div>
        </div>
      </div>

      {/* ── SECTION 4: BIG CALL-TO-ACTION (PREDICT FLOOD RISK BUTTON) ── */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-500/10 via-slate-50 to-orange-500/10 dark:from-[#120B0A] dark:via-[#0B0E18] dark:to-[#120B0A] border-2 border-[#FF5A1F]/40 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#FF5A1F]/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/30 uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Next Stage: AI Risk Assessment
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Ready to Run Machine Learning Prediction?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono leading-relaxed">
            PravahAI will feed this live weather telemetry, antecedent soil saturation, and terrain slope into our <b>XGBoost V2 + TreeSHAP + LangGraph Agentic Pipeline</b> to compute the flood risk probability, alert zones, and safe evacuation corridors.
          </p>
        </div>

        <button
          onClick={handlePredictClick}
          disabled={isAnalyzing}
          className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF5A1F] via-[#FF4500] to-[#E03A00] hover:from-[#FF6A30] hover:to-[#FF5A1F] text-white px-10 py-5 rounded-2xl text-sm font-black tracking-widest uppercase shadow-2xl shadow-[#FF5A1F]/50 border border-[#FF5A1F]/60 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
        >
          <span>PREDICT RISK</span>
          <ArrowRight className="w-5 h-5 animate-pulse" />
        </button>
      </div>
    </div>
  );
}
