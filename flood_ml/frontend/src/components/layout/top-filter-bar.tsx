"use client";

import { useState } from "react";
import {
  Menu,
  SlidersHorizontal,
  Play,
  Clock,
  Calendar,
  Loader2,
  Sparkles,
  ChevronDown,
  CloudLightning,
  SunMedium,
  CloudRain,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureInputs {
  rainfall_mm: number;
  rainfall_1d: number;
  rainfall_3d: number;
  rainfall_7d: number;
  rainfall_30d: number;
  soil_saturation_proxy: number;
  ndvi: number;
  slope_mean: number;
  flow_accumulation: number;
}

interface TopFilterBarProps {
  onToggleSidebar?: () => void;
  onPredict: (features: FeatureInputs, locationInfo: { state: string; district: string; catchment: string }) => void;
  isLoading: boolean;
  features: FeatureInputs;
  onFeaturesChange: (features: FeatureInputs) => void;
  selectedState: "Assam" | "Uttarakhand";
  selectedDistrict: string;
  selectedCatchment: string;
  onLocationChange: (state: "Assam" | "Uttarakhand", district: string, catchment: string) => void;
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

export function TopFilterBar({
  onToggleSidebar,
  onPredict,
  isLoading,
  features,
  onFeaturesChange,
  selectedState,
  selectedDistrict,
  selectedCatchment,
  onLocationChange,
}: TopFilterBarProps) {
  const [mode, setMode] = useState<"live" | "historical">("live");
  const [dateTime, setDateTime] = useState("29 Aug 2026 12:00 PM");
  const [showParamsModal, setShowParamsModal] = useState(false);

  const handleStateSelect = (state: "Assam" | "Uttarakhand") => {
    const newDistrict = locations[state].districts[0];
    const newCatchment = locations[state].catchments[0];
    onLocationChange(state, newDistrict, newCatchment);

    // Auto load realistic features for that region
    if (state === "Assam") {
      onFeaturesChange(scenarioPresets.high.features);
    } else {
      onFeaturesChange(scenarioPresets.extreme.features);
    }
  };

  const handleDistrictSelect = (district: string) => {
    onLocationChange(selectedState, district, selectedCatchment);
  };

  const handleCatchmentSelect = (catchment: string) => {
    onLocationChange(selectedState, selectedDistrict, catchment);
  };

  const applyPreset = (presetKey: keyof typeof scenarioPresets) => {
    onFeaturesChange(scenarioPresets[presetKey].features);
  };

  const handleSliderChange = (key: keyof FeatureInputs, value: number) => {
    onFeaturesChange({
      ...features,
      [key]: value,
    });
  };

  return (
    <div className="bg-[#06080E]/95 backdrop-blur-2xl border-b border-[#151B29] px-6 py-3.5 flex flex-col gap-3 sticky top-0 z-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: 3-Line Hamburger Menu Button + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-[#0B0E18] border border-[#181F30] text-slate-300 hover:text-white hover:border-[#FF3B1D]/40 transition-all flex items-center justify-center cursor-pointer shadow-sm group"
            title="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-slate-300 group-hover:text-[#FF3B1D] transition-colors" />
          </button>

          <div className="flex items-center gap-2 pr-3 border-r border-[#181F30]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B1D] shadow-md shadow-[#FF3B1D]/50 animate-pulse" />
            <div className="flex items-center gap-1 font-black text-xs uppercase tracking-widest">
              <span className="text-white">PRAVAH</span>
              <span className="text-[#FF3B1D]">AI.</span>
            </div>
          </div>
        </div>

        {/* Step 2: Location Controls (State -> District -> Catchment) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* State */}
          <div className="flex items-center gap-1.5 bg-[#0B0E18] border border-[#181F30] rounded-xl px-3 py-1.5">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-semibold">State</span>
            <select
              value={selectedState}
              onChange={(e) => handleStateSelect(e.target.value as "Assam" | "Uttarakhand")}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="Assam" className="bg-[#080B12] text-white">Assam</option>
              <option value="Uttarakhand" className="bg-[#080B12] text-white">Uttarakhand</option>
            </select>
          </div>

          {/* District */}
          <div className="flex items-center gap-1.5 bg-[#0B0E18] border border-[#181F30] rounded-xl px-3 py-1.5">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-semibold">District</span>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictSelect(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {locations[selectedState].districts.map((d) => (
                <option key={d} value={d} className="bg-[#080B12] text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Catchment */}
          <div className="flex items-center gap-1.5 bg-[#0B0E18] border border-[#181F30] rounded-xl px-3 py-1.5">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-semibold">Catchment</span>
            <select
              value={selectedCatchment}
              onChange={(e) => handleCatchmentSelect(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {locations[selectedState].catchments.map((c) => (
                <option key={c} value={c} className="bg-[#080B12] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Mode & Time */}
          <div className="bg-[#0B0E18] border border-[#181F30] rounded-xl p-0.5 flex items-center">
            <button
              onClick={() => setMode("historical")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all",
                mode === "historical" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"
              )}
            >
              Historical Replay
            </button>
            <button
              onClick={() => setMode("live")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all",
                mode === "live"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Live Monitoring
            </button>
          </div>

          {/* Date & Time Picker (Matching Step 3 from Poster) */}
          <div className="flex items-center gap-1.5 bg-[#0B0E18] border border-[#181F30] rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-[#FF3B1D]" />
            <input
              type="text"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-mono w-36 focus:outline-none"
            />
          </div>
        </div>

        {/* Step 4: Big Contagion Style Predict Risk Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowParamsModal(!showParamsModal)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
              showParamsModal
                ? "bg-[#FF3B1D]/20 border-[#FF3B1D]/40 text-[#FF5A3D] shadow-sm"
                : "bg-[#0B0E18] border-[#181F30] text-slate-400 hover:border-slate-500 hover:text-white"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize Parameters</span>
          </button>

          <button
            onClick={() =>
              onPredict(features, {
                state: selectedState,
                district: selectedDistrict,
                catchment: selectedCatchment,
              })
            }
            disabled={isLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF3B1D] to-[#D9260B] hover:from-[#FF4E33] hover:to-[#E02E10] text-white px-6 py-2 rounded-xl text-xs font-black tracking-widest uppercase shadow-lg shadow-[#FF3B1D]/30 border border-[#FF3B1D]/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-white" />
            )}
            <span>PREDICT RISK</span>
          </button>
        </div>
      </div>

      {/* Preset Scenario Buttons (1-Click Test Scenarios) */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5 text-[11px]">
        <span className="text-white/40 flex items-center gap-1 font-semibold uppercase text-[10px]">
          <Sparkles className="w-3 h-3 text-yellow-400" /> Test Scenarios:
        </span>

        {Object.entries(scenarioPresets).map(([key, item]) => {
          const Icon = item.icon;
          return (
            <button
              key={key}
              onClick={() => applyPreset(key as keyof typeof scenarioPresets)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all hover:scale-[1.02]",
                item.color
              )}
            >
              <Icon className="w-3 h-3" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Expandable Sliders for Custom Weather/Soil Inputs */}
      {showParamsModal && (
        <div className="mt-2 pt-3 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 bg-white/[0.02] p-3.5 rounded-xl">
          <div>
            <div className="flex justify-between text-[11px] text-white/60 mb-1">
              <span>Rainfall (Now)</span>
              <span className="font-mono text-white font-bold">{features.rainfall_mm} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={features.rainfall_mm}
              onChange={(e) => handleSliderChange("rainfall_mm", parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-white/60 mb-1">
              <span>Rainfall (3 Days)</span>
              <span className="font-mono text-white font-bold">{features.rainfall_3d} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="350"
              step="5"
              value={features.rainfall_3d}
              onChange={(e) => handleSliderChange("rainfall_3d", parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-white/60 mb-1">
              <span>Rainfall (7 Days)</span>
              <span className="font-mono text-white font-bold">{features.rainfall_7d} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="450"
              step="5"
              value={features.rainfall_7d}
              onChange={(e) => handleSliderChange("rainfall_7d", parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-white/60 mb-1">
              <span>Soil Saturation</span>
              <span className="font-mono text-white font-bold">{Math.round(features.soil_saturation_proxy * 100)}%</span>
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

          <div>
            <div className="flex justify-between text-[11px] text-white/60 mb-1">
              <span>Slope Gradient</span>
              <span className="font-mono text-white font-bold">{features.slope_mean}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={features.slope_mean}
              onChange={(e) => handleSliderChange("slope_mean", parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
