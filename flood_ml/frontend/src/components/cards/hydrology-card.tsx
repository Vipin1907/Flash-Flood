"use client";

import { GlassCard } from "../glass-card";
import { Waves, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

interface HydrologyCardProps {
  riverName?: string;
  currentLevel?: number;
  warningLevel?: number;
  dangerLevel?: number;
  trend?: "rising" | "falling" | "stable";
  rateCmHr?: number;
  gaugeStation?: string;
}

export function HydrologyCard({
  riverName = "Barak River",
  currentLevel = 19.45,
  warningLevel = 19.25,
  dangerLevel = 19.83,
  trend = "rising",
  rateCmHr = 3.5,
  gaugeStation,
}: HydrologyCardProps) {
  const percentage = Math.min((currentLevel / dangerLevel) * 100, 100);
  const isCritical = currentLevel >= dangerLevel || percentage >= 95;
  const isWarning = currentLevel >= warningLevel;

  const TrendIcon =
    trend === "rising" ? TrendingUp : trend === "falling" ? TrendingDown : Minus;

  return (
    <GlassCard
      glowColor={isCritical ? "rgba(239,68,68,0.15)" : "rgba(6,182,212,0.12)"}
      className={isCritical ? "border-red-500/30 dark:border-red-500/40" : ""}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-500" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase font-mono">
            River Gauging & Level
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/25">
          CWC Telemetry
        </span>
      </div>

      <p className="text-xs font-bold text-[#FF5A1F] truncate mb-3 font-mono">
        {riverName}
      </p>

      {/* Water level bar */}
      <div className="relative mb-3 font-mono">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span>Current: <b className="text-slate-900 dark:text-white">{currentLevel.toFixed(2)}m</b></span>
          <span>Danger: <b className="text-red-600 dark:text-red-400">{dangerLevel.toFixed(2)}m</b></span>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isCritical
                ? "bg-gradient-to-r from-orange-500 to-red-500"
                : isWarning
                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                : "bg-gradient-to-r from-blue-500 to-cyan-400"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] mt-1 text-slate-500">
          <span>Warning Mark: {warningLevel.toFixed(2)}m</span>
          <span className={isCritical ? "text-red-600 font-bold" : isWarning ? "text-amber-600 font-bold" : "text-emerald-600 font-semibold"}>
            {isCritical
              ? "BREACH THREAT"
              : isWarning
              ? "ABOVE WARNING MARK"
              : `${(dangerLevel - currentLevel).toFixed(2)}m below danger`}
          </span>
        </div>
      </div>

      {/* Trend box */}
      <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-xl font-mono">
        <div className="flex items-center gap-2">
          <TrendIcon
            className={`w-4 h-4 ${
              trend === "rising" ? "text-red-500" : trend === "falling" ? "text-emerald-500" : "text-slate-400"
            }`}
          />
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">{trend} Water Level</p>
            <p className="text-[10px] text-slate-500">Rate: +{rateCmHr} cm/hr</p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-bold">
          Live Gauge
        </span>
      </div>
    </GlassCard>
  );
}
