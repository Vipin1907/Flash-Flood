"use client";

import { GlassCard } from "../glass-card";
import { Waves, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface HydrologyCardProps {
  riverName: string;
  currentLevel: number;
  dangerLevel: number;
  trend: "rising" | "falling" | "stable";
  rateCmHr: number;
}

export function HydrologyCard({
  riverName,
  currentLevel,
  dangerLevel,
  trend,
  rateCmHr,
}: HydrologyCardProps) {
  const percentage = Math.min((currentLevel / dangerLevel) * 100, 100);
  const isCritical = percentage >= 80;

  const TrendIcon =
    trend === "rising" ? TrendingUp : trend === "falling" ? TrendingDown : Minus;

  return (
    <GlassCard
      glowColor={isCritical ? "rgba(239,68,68,0.15)" : "rgba(96,165,250,0.1)"}
      className={isCritical ? "border-red-500/30" : ""}
    >
      <div className="flex items-center gap-2 mb-4">
        <Waves className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white/70 tracking-wide uppercase">
          Hydrology — {riverName}
        </h3>
      </div>

      {/* Water level bar */}
      <div className="relative mb-4">
        <div className="flex justify-between text-xs text-white/40 mb-1.5">
          <span>Current: {currentLevel}m</span>
          <span>Danger: {dangerLevel}m</span>
        </div>
        <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isCritical
                ? "bg-gradient-to-r from-orange-500 to-red-500"
                : "bg-gradient-to-r from-blue-500 to-cyan-400"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-white/30 mt-1">
          {(dangerLevel - currentLevel).toFixed(1)}m below danger level
        </p>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl p-3">
        <TrendIcon
          className={`w-4 h-4 ${
            trend === "rising" ? "text-red-400" : trend === "falling" ? "text-emerald-400" : "text-white/40"
          }`}
        />
        <div>
          <p className="text-sm text-white/70 capitalize">{trend}</p>
          <p className="text-xs text-white/40">+{rateCmHr} cm/hr</p>
        </div>
      </div>
    </GlassCard>
  );
}
