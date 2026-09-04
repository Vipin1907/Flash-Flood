"use client";

import { GlassCard } from "../glass-card";
import { Navigation, Route, Clock, Shield } from "lucide-react";

interface RouteCardProps {
  normalRoute: {
    distance_meters: number;
    estimated_time_seconds: number;
    exposure_level: string;
  };
  safeRoute: {
    distance_meters: number;
    estimated_time_seconds: number;
    exposure_level: string;
  };
}

export function RouteCard({ normalRoute, safeRoute }: RouteCardProps) {
  const formatDist = (m: number) => `${(m / 1000).toFixed(1)} km`;
  const formatTime = (s: number) => `${Math.round(s / 60)} min`;

  return (
    <GlassCard glowColor="rgba(96,165,250,0.1)">
      <div className="flex items-center gap-2 mb-4">
        <Navigation className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white/70 tracking-wide uppercase">
          Evacuation Routes
        </h3>
      </div>

      <div className="space-y-3">
        {/* Normal Route */}
        <div className="bg-red-500/[0.06] border border-red-500/20 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-red-400 uppercase">Normal Route</span>
            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
              {normalRoute.exposure_level} Exposure
            </span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5 text-white/40" />
              <span className="text-sm text-white/70">{formatDist(normalRoute.distance_meters)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-white/40" />
              <span className="text-sm text-white/70">{formatTime(normalRoute.estimated_time_seconds)}</span>
            </div>
          </div>
        </div>

        {/* Safe Route */}
        <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400 uppercase">Safe Route</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
              {safeRoute.exposure_level} Exposure
            </span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5 text-white/40" />
              <span className="text-sm text-white/70">{formatDist(safeRoute.distance_meters)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-white/40" />
              <span className="text-sm text-white/70">{formatTime(safeRoute.estimated_time_seconds)}</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
