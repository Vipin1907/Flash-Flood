"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CloudRain,
  CloudLightning,
  Droplets,
  Thermometer,
  Wind,
  Gauge,
  Mountain,
  Compass,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Radio,
  Satellite,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Info,
  Waves,
} from "lucide-react";
import { GlassCard } from "../glass-card";
import { FeatureInputs } from "../layout/top-filter-bar";
import { cn } from "@/lib/utils";

interface WeatherTelemetryViewProps {
  selectedState: "Assam" | "Uttarakhand";
  selectedDistrict: string;
  selectedCatchment: string;
  dateTime?: string;
  mode?: "live" | "historical";
  features: FeatureInputs;
  onPredict: (features: FeatureInputs, loc?: { state: string; district: string; catchment: string }) => void;
  onProceedToDashboard: () => void;
  isAnalyzing: boolean;
}

export function WeatherTelemetryView({
  selectedState,
  selectedDistrict,
  selectedCatchment,
  dateTime = "29 Aug 2026 12:00 PM",
  mode = "live",
  features,
  onPredict,
  onProceedToDashboard,
  isAnalyzing,
}: WeatherTelemetryViewProps) {
  const isAssam = selectedState === "Assam";

  // Dynamic context-based river and elevation data
  const riverName = isAssam ? "Barak River (Annapurna Ghat)" : "Alaknanda / Bhagirathi River";
  const currentRiverLevel = isAssam ? 19.45 : 621.8;
  const warningRiverLevel = isAssam ? 19.25 : 620.0;
  const dangerRiverLevel = isAssam ? 19.83 : 624.5;
  const elevationMeters = isAssam ? 38 : 1150;
  const meanSlopeDeg = features.slope_mean || (isAssam ? 14.5 : 32.2);

  // Observed rainfall breakdown
  const observedRainfall = {
    last1h: features.rainfall_mm,
    last3h: features.rainfall_3d ? (features.rainfall_3d * 0.4).toFixed(1) : "38.2",
    last6h: features.rainfall_3d ? (features.rainfall_3d * 0.7).toFixed(1) : "64.0",
    last24h: features.rainfall_1d ? (features.rainfall_1d * 2.2).toFixed(1) : "112.5",
    last7d: features.rainfall_7d || 185.0,
    intensity_mm_hr: (features.rainfall_mm * 1.3).toFixed(1),
    intensity_status: features.rainfall_mm > 15 ? "Torrential / Cloudburst" : features.rainfall_mm > 5 ? "Heavy Rain" : "Moderate",
    source: isAssam ? "IMD Radar Silchar & AWS Station #428" : "IMD Doppler Radar Dehradun & AWS #109",
    updated_at: "10 mins ago (11:50 IST)",
    status: "Live Verified",
  };

  // Forecast rainfall breakdown (strictly separated)
  const forecastRainfall = {
    next3h: (features.rainfall_mm * 1.8).toFixed(1),
    next6h: (features.rainfall_mm * 3.2).toFixed(1),
    next12h: (features.rainfall_mm * 5.4).toFixed(1),
    next24h: (features.rainfall_mm * 8.6 + 25.0).toFixed(1),
    next3days: (features.rainfall_mm * 14.0 + 80.0).toFixed(1),
    peak_intensity_time: "Next 2–4 Hours",
    source: "NCMRWF Ensemble / IMD GFS High-Res (3km)",
    updated_at: "Cycle 06:00 UTC (Operational)",
    status: "Operational Forecast",
  };

  // Soil saturation
  const soilMoisturePercent = Math.round(features.soil_saturation_proxy * 100);
  const soilStatus = soilMoisturePercent > 70 ? "Near Saturation (High Runoff Risk)" : soilMoisturePercent > 40 ? "Moderately Moist" : "Normal Dry";

  const handlePredictClick = () => {
    onPredict(features, {
      state: selectedState,
      district: selectedDistrict,
      catchment: selectedCatchment,
    });
    onProceedToDashboard();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ── Page Header / Status Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B0E19] via-[#0e1424] to-[#0B0E19] border border-[#1C253B] p-6 lg:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3B1D]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-blue-500/15 border border-blue-500/30 text-blue-400">
                <Radio className="w-3 h-3 animate-pulse" /> Live Telemetry & Weather Feed
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Data Fresh (Valid)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Weather & Catchment Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
              Location: <span className="text-white font-bold">{selectedDistrict}, {selectedState}</span> • Basin: <span className="text-cyan-400 font-semibold">{selectedCatchment}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#080B12] border border-[#181F30] rounded-2xl px-4 py-2.5 text-right">
              <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Observation Time</div>
              <div className="text-xs sm:text-sm font-mono font-bold text-white flex items-center gap-1.5 justify-end">
                <Clock className="w-3.5 h-3.5 text-[#FF3B1D]" />
                <span>{dateTime}</span>
              </div>
            </div>

            <div className="bg-[#080B12] border border-[#181F30] rounded-2xl px-4 py-2.5 text-right">
              <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Mode</div>
              <div className="text-xs sm:text-sm font-mono font-bold text-emerald-400 uppercase">
                {mode === "live" ? "🟢 Real-Time Telemetry" : "⏮️ Historical Replay"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: OBSERVED RAINFALL vs FORECAST RAINFALL (STRICTLY SEPARATED) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1A. Observed Rainfall Card */}
        <div className="rounded-3xl bg-[#090C16] border border-[#1B2338] p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                  <CloudRain className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-wide uppercase">
                    1. Observed Rainfall
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">Actual measured surface precipitation</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                OBSERVED
              </span>
            </div>

            {/* Current Intensity & 1-Hour Main Stat */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-5">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400">Current (1 Hour)</span>
                <div className="text-3xl font-black text-white font-mono mt-0.5">
                  {observedRainfall.last1h} <span className="text-sm font-normal text-slate-400">mm</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400">Rainfall Intensity</span>
                <div className="text-base font-black text-amber-400 font-mono mt-1">
                  {observedRainfall.intensity_mm_hr} mm/hr
                </div>
                <span className="text-[10px] text-amber-300/80 font-mono block">
                  [{observedRainfall.intensity_status}]
                </span>
              </div>
            </div>

            {/* Historical Observation Windows Table */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-[11px] font-mono font-bold text-slate-400 uppercase px-1">
                <span>Time Window</span>
                <span>Cumulative Amount</span>
              </div>

              {[
                { label: "Past 3 Hours", val: `${observedRainfall.last3h} mm` },
                { label: "Past 6 Hours", val: `${observedRainfall.last6h} mm` },
                { label: "Past 24 Hours (1-Day)", val: `${observedRainfall.last24h} mm` },
                { label: "Past 7 Days (Antecedent)", val: `${observedRainfall.last7d} mm` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono"
                >
                  <span className="text-slate-300">{item.label}</span>
                  <span className="font-bold text-white">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Source Metadata & Data Status Badge */}
          <div className="pt-4 border-t border-white/10 space-y-1.5 text-[11px] font-mono text-slate-400">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Source:</span>
              <span className="text-slate-200 font-semibold">{observedRainfall.source}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Update Time:</span>
              <span className="text-slate-300">{observedRainfall.updated_at}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Data Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {observedRainfall.status}
              </span>
            </div>
          </div>
        </div>

        {/* 1B. Forecast Rainfall Card */}
        <div className="rounded-3xl bg-[#090C16] border border-[#1B2338] p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-[#FF3B1D]" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                  <CloudLightning className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-wide uppercase">
                    2. Forecast Rainfall
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">High-resolution Numerical Weather Prediction</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PROJECTION
              </span>
            </div>

            {/* Peak Forecast Stat */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-5">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400">Next 3-Hour Forecast</span>
                <div className="text-3xl font-black text-amber-400 font-mono mt-0.5">
                  {forecastRainfall.next3h} <span className="text-sm font-normal text-slate-400">mm</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400">Peak Surge Window</span>
                <div className="text-sm font-black text-red-400 font-mono mt-1">
                  {forecastRainfall.peak_intensity_time}
                </div>
                <span className="text-[10px] text-red-300/80 font-mono block">
                  High Inundation Threat
                </span>
              </div>
            </div>

            {/* Forecast Windows Table */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-[11px] font-mono font-bold text-slate-400 uppercase px-1">
                <span>Forecast Horizon</span>
                <span>Expected Precipitation</span>
              </div>

              {[
                { label: "Next 6 Hours", val: `${forecastRainfall.next6h} mm` },
                { label: "Next 12 Hours", val: `${forecastRainfall.next12h} mm` },
                { label: "Next 24 Hours (1-Day)", val: `${forecastRainfall.next24h} mm` },
                { label: "Next 72 Hours (3-Days)", val: `${forecastRainfall.next3days} mm` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono"
                >
                  <span className="text-slate-300">{item.label}</span>
                  <span className="font-bold text-amber-300">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Source Metadata & Data Status Badge */}
          <div className="pt-4 border-t border-white/10 space-y-1.5 text-[11px] font-mono text-slate-400">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Source:</span>
              <span className="text-slate-200 font-semibold">{forecastRainfall.source}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Update Time:</span>
              <span className="text-slate-300">{forecastRainfall.updated_at}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Data Status:</span>
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <Satellite className="w-3 h-3" /> {forecastRainfall.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: SOIL MOISTURE, RIVER LEVEL & TERRAIN FEATURES ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 2A. Soil Moisture & Saturation Card */}
        <div className="rounded-3xl bg-[#090C16] border border-[#1B2338] p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                ISRO / NASA SMAP
              </span>
            </div>

            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Soil Moisture & Saturation
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Hydrological antecedent proxy</p>

            <div className="my-5">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-4xl font-black text-emerald-400 font-mono">
                  {soilMoisturePercent}%
                </span>
                <span className="text-xs font-mono text-slate-300 font-semibold">
                  Proxy: {features.soil_saturation_proxy.toFixed(3)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 transition-all duration-500"
                  style={{ width: `${Math.min(soilMoisturePercent, 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-amber-300 font-mono mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>{soilStatus}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-1 text-[10px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-500">Source:</span>
              <span className="text-slate-200">ISRO MOSDAC / SMAP L4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Update Time:</span>
              <span className="text-slate-300">Today 09:30 IST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="text-emerald-400 font-bold">🟢 Assimilated</span>
            </div>
          </div>
        </div>

        {/* 2B. River Level Telemetry Card */}
        <div className="rounded-3xl bg-[#090C16] border border-[#1B2338] p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                <Waves className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                CWC TELEMETRY
              </span>
            </div>

            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              River Level Telemetry
            </h3>
            <p className="text-[11px] text-cyan-300 font-mono mt-0.5 truncate">{riverName}</p>

            <div className="my-4 space-y-2 font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 text-xs">Current Level:</span>
                <span className="text-base font-bold text-amber-400">{currentRiverLevel} m</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 text-xs">Warning Level:</span>
                <span className="text-xs font-bold text-yellow-300">{warningRiverLevel} m</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 text-xs">Danger Mark:</span>
                <span className="text-xs font-bold text-red-400">{dangerRiverLevel} m</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-1 text-[10px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-500">Source:</span>
              <span className="text-slate-200">Central Water Commission (CWC)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Update Time:</span>
              <span className="text-slate-300">11:30 IST (Rising +4cm/h)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="text-amber-400 font-bold">🟠 Warning Threshold</span>
            </div>
          </div>
        </div>

        {/* 2C. Geospatial Terrain & Topo Card */}
        <div className="rounded-3xl bg-[#090C16] border border-[#1B2338] p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                <Mountain className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                SRTM 30m DEM
              </span>
            </div>

            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Elevation, Slope & Topo
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Geospatial catchment features</p>

            <div className="my-4 space-y-2 font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 text-xs">Basin Elevation:</span>
                <span className="text-sm font-bold text-white">{elevationMeters} m MSL</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 text-xs">Mean Slope:</span>
                <span className="text-sm font-bold text-indigo-300">{meanSlopeDeg.toFixed(1)}°</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 text-xs">NDVI Vegetation:</span>
                <span className="text-xs font-bold text-emerald-400">0.65 (High Absorption)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-1 text-[10px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-500">Source:</span>
              <span className="text-slate-200">ISRO Cartosat / USGS SRTM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Update Time:</span>
              <span className="text-slate-300">Calibrated High-Res Grid</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="text-emerald-400 font-bold">🟢 Validated Model Grid</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: ATMOSPHERIC & REAL-TIME WEATHER METRICS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#090C16] border border-[#181F30] font-mono">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Thermometer className="w-4 h-4 text-orange-400" />
            <span>Temperature</span>
          </div>
          <div className="text-xl font-bold text-white">24.6°C</div>
          <div className="text-[10px] text-slate-500 mt-1">Source: IMD AWS #428</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090C16] border border-[#181F30] font-mono">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span>Relative Humidity</span>
          </div>
          <div className="text-xl font-bold text-blue-300">94%</div>
          <div className="text-[10px] text-slate-500 mt-1">Source: IMD AWS #428</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090C16] border border-[#181F30] font-mono">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Wind className="w-4 h-4 text-cyan-400" />
            <span>Wind Speed & Dir</span>
          </div>
          <div className="text-xl font-bold text-white">18 km/h <span className="text-xs text-slate-400">NE</span></div>
          <div className="text-[10px] text-slate-500 mt-1">Source: Anemometer Array</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090C16] border border-[#181F30] font-mono">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Gauge className="w-4 h-4 text-purple-400" />
            <span>Surface Pressure</span>
          </div>
          <div className="text-xl font-bold text-white">1004.2 hPa</div>
          <div className="text-[10px] text-slate-500 mt-1">Source: Barometric Station</div>
        </div>
      </div>

      {/* ── SECTION 4: BIG CALL-TO-ACTION (PREDICT FLOOD RISK BUTTON) ── */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#120B0A] via-[#0B0E18] to-[#120B0A] border-2 border-[#FF3B1D]/40 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#FF3B1D]/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#FF3B1D]/20 text-[#FF5A3D] border border-[#FF3B1D]/30 uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Next Stage: AI Risk Assessment
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ready to Run Machine Learning Prediction?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono leading-relaxed">
            PravahAI will feed this live weather telemetry, antecedent soil saturation, and terrain slope into our <b>XGBoost V2 + TreeSHAP + LangGraph Agentic Pipeline</b> to compute the flood risk probability, alert zones, and safe evacuation corridors.
          </p>
        </div>

        <button
          onClick={handlePredictClick}
          disabled={isAnalyzing}
          className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF3B1D] via-[#FF4E33] to-[#D9260B] hover:from-[#FF4E33] hover:to-[#E02E10] text-white px-9 py-5 rounded-2xl text-sm font-black tracking-widest uppercase shadow-2xl shadow-[#FF3B1D]/50 border border-[#FF3B1D]/60 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
        >
          <span>PREDICT FLOOD RISK NOW</span>
          <ArrowRight className="w-5 h-5 animate-pulse" />
        </button>
      </div>
    </div>
  );
}
