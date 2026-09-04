"use client";

import { GlassCard } from "../glass-card";
import { CloudRain, Wind, Droplets, Thermometer, ArrowUpRight } from "lucide-react";

interface WeatherSummaryCardProps {
  rainfallNow: number;
}

export function WeatherSummaryCard({ rainfallNow }: WeatherSummaryCardProps) {
  const summaryRows = [
    { period: "1 Hour", amount: rainfallNow > 0 ? `${rainfallNow.toFixed(1)} mm` : "18.0 mm" },
    { period: "3 Hours", amount: "62.5 mm" },
    { period: "6 Hours", amount: "105.2 mm" },
    { period: "24 Hours", amount: "176.0 mm" },
    { period: "7 Days", amount: "412.5 mm" },
  ];

  return (
    <GlassCard glowColor="rgba(59,130,246,0.1)" className="h-full flex flex-col justify-between">
      <div>
        {/* Weather Now Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">
            Weather Now
          </span>
          <span className="text-[10px] bg-blue-500/15 border border-blue-500/25 text-blue-400 px-2 py-0.5 rounded-full font-semibold">
            Real-time Radar
          </span>
        </div>

        {/* Temperature & Main Rain */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <CloudRain className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-white leading-none">24.6°C</div>
              <p className="text-xs text-blue-300 font-medium mt-1">Heavy Rain</p>
            </div>
          </div>

          <div className="text-right text-[11px] text-white/50 space-y-0.5">
            <div className="flex items-center gap-1 justify-end">
              <Droplets className="w-3 h-3 text-cyan-400" />
              <span>Humidity: <b className="text-white">94%</b></span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <Wind className="w-3 h-3 text-indigo-400" />
              <span>Wind: <b className="text-white">12 km/h</b></span>
            </div>
          </div>
        </div>

        {/* Rainfall Summary Breakdown */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-white/70 uppercase tracking-wider mb-2">
            <span>Rainfall Summary</span>
            <span className="text-red-400 text-[10px] lowercase">intensity: 18 mm/hr</span>
          </div>

          <div className="space-y-1.5">
            {summaryRows.map((row) => (
              <div
                key={row.period}
                className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white/[0.02] border border-white/5"
              >
                <span className="text-white/60">{row.period}</span>
                <span className="font-mono font-semibold text-white">{row.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
        <span className="text-white/40">Station: IMD Automatic Gauge</span>
        <span className="text-blue-400 font-medium flex items-center gap-0.5 cursor-pointer hover:underline">
          View Radar Trend <ArrowUpRight className="w-2.5 h-2.5" />
        </span>
      </div>
    </GlassCard>
  );
}
