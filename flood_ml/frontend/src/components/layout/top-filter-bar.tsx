"use client";

import { useState } from "react";
import {
  Menu,
  Play,
  Calendar,
  Loader2,
  Sun,
  Moon,
  MapPin,
  Clock,
  Zap,
  Activity,
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import { DatePickerModal } from "@/components/ui/date-picker-modal";

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
  dateTime?: string;
  onDateTimeChange?: (dt: string) => void;
  mode?: "live" | "historical";
  onModeChange?: (m: "live" | "historical") => void;
  onBackToLanding?: () => void;
}

export function TopFilterBar({
  onToggleSidebar,
  onPredict,
  isLoading,
  features,
  selectedState,
  selectedDistrict,
  selectedCatchment,
  dateTime = "29 Aug 2026 12:00 PM",
  onDateTimeChange,
  mode = "live",
  onModeChange,
  onBackToLanding,
}: TopFilterBarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleDateSelected = (newDateTimeStr: string) => {
    if (onDateTimeChange) {
      onDateTimeChange(newDateTimeStr);
    }
  };

  return (
    <div className="bg-white/95 dark:bg-[#060810]/95 backdrop-blur-2xl border-b border-slate-200/80 dark:border-[#151B29] px-4 lg:px-6 py-2.5 sticky top-0 z-20 transition-colors duration-200">
      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        selectedDateTime={dateTime}
        onSelectDateTime={handleDateSelected}
        selectedState={selectedState}
      />

      <div className="flex items-center justify-between gap-3">
        {/* ── Left Section: Menu + Brand + Location Context ── */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger Menu */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#0C0F1A] border border-slate-200 dark:border-[#1A2035] text-slate-600 dark:text-slate-400 hover:text-[#FF5A1F] hover:border-[#FF5A1F]/40 transition-all cursor-pointer flex-shrink-0"
            title="Open Navigation Menu"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>

          {/* Brand Logo */}
          <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200 dark:border-[#1A2035] flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#FF5A1F] shadow-sm shadow-[#FF5A1F]/50 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-800 dark:text-white">PRAVAH</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FF5A1F]">AI</span>
          </div>

          {/* Location Context Badge (Read-only — inputs are on landing page) */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF5A1F]/8 dark:bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 min-w-0">
              <MapPin className="w-3 h-3 text-[#FF5A1F] flex-shrink-0" />
              <span className="text-[11px] font-bold text-[#FF5A1F] truncate">
                {selectedDistrict}, {selectedState}
              </span>
              <span className="hidden sm:inline text-[10px] text-slate-500 dark:text-slate-500 font-mono truncate">
                ({selectedCatchment})
              </span>
            </div>

            {/* Back to inputs link */}
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-500 hover:text-[#FF5A1F] transition-colors cursor-pointer flex-shrink-0"
                title="Change location inputs"
              >
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden md:inline">Change</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Right Section: Mode + Date + Theme + Predict ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Live / Historical Mode Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-[#0C0F1A] border border-slate-200 dark:border-[#1A2035] rounded-xl p-0.5">
            <button
              onClick={() => onModeChange && onModeChange("historical")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1",
                mode === "historical"
                  ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              )}
            >
              <Clock className="w-3 h-3" />
              Historical
            </button>
            <button
              onClick={() => onModeChange && onModeChange("live")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer",
                mode === "live"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              )}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Live
            </button>
          </div>

          {/* Date & Time Display */}
          <button
            type="button"
            onClick={() => setIsDatePickerOpen(true)}
            className="hidden md:flex items-center gap-1.5 bg-slate-50 dark:bg-[#0C0F1A] border border-slate-200 dark:border-[#1A2035] hover:border-[#FF5A1F]/50 rounded-xl px-3 py-1.5 text-[11px] cursor-pointer transition-colors group"
            title="Click to pick observation date"
          >
            <Calendar className="w-3 h-3 text-[#FF5A1F] group-hover:scale-110 transition-transform" />
            <span className="font-mono font-bold text-slate-800 dark:text-white">{dateTime}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#0C0F1A] border border-slate-200 dark:border-[#1A2035] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-700" />
            )}
          </button>

          {/* Re-Predict Button */}
          <button
            onClick={() =>
              onPredict(features, {
                state: selectedState,
                district: selectedDistrict,
                catchment: selectedCatchment,
              })
            }
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#FF5A1F] to-[#FF4500] hover:from-[#FF6A30] hover:to-[#FF5A1F] text-white px-4 py-2 rounded-xl text-[11px] font-black tracking-wider uppercase shadow-lg shadow-[#FF5A1F]/25 border border-[#FF5A1F]/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
            <span>RE-ANALYZE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
