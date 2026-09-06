"use client";

import { GlassCard } from "../glass-card";
import { CloudRain, Wind, Droplets, Thermometer, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface WeatherSummaryCardProps {
  rainfallNow?: number;
  rainfall1d?: number;
  rainfall3d?: number;
  rainfall7d?: number;
  rainfall30d?: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  districtName?: string;
  onViewDetails?: () => void;
}

export function WeatherSummaryCard({
  rainfallNow = 18.5,
  rainfall1d = 112.0,
  rainfall3d = 145.0,
  rainfall7d = 195.0,
  rainfall30d = 280.0,
  temperature = 24.6,
  humidity = 94,
  windSpeed = 14.5,
  districtName,
  onViewDetails,
}: WeatherSummaryCardProps) {
  const intensity = (rainfallNow * 1.25).toFixed(1);

  const summaryRows = [
    { period: "Current (1h)", amount: `${rainfallNow.toFixed(1)} mm`, highlight: true },
    { period: "Past 24h (1-Day)", amount: `${rainfall1d.toFixed(1)} mm` },
    { period: "Past 3-Days", amount: `${rainfall3d.toFixed(1)} mm` },
    { period: "Antecedent (7-Days)", amount: `${rainfall7d.toFixed(1)} mm` },
    { period: "Cumulative (30-Days)", amount: `${rainfall30d.toFixed(1)} mm` },
  ];

  return (
    <GlassCard glowColor="rgba(59,130,246,0.12)" className="h-full flex flex-col justify-between">
      <div>
        {/* Weather Now Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono font-bold tracking-wider">
              Live Weather Feed
            </span>
            {districtName && (
              <span className="text-[10px] text-[#FF5A1F] font-bold font-mono">
                • {districtName}
              </span>
            )}
          </div>
          <span className="text-[10px] bg-blue-500/15 border border-blue-500/25 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full font-semibold font-mono">
            Doppler Telemetry
          </span>
        </div>

        {/* Temperature & Main Rain */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 dark:border-blue-500/30 flex items-center justify-center">
              <CloudRain className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
                {temperature.toFixed(1)}°C
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-300 font-medium mt-1">
                Monsoon Rain Showers
              </p>
            </div>
          </div>

          <div className="text-right text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
            <div className="flex items-center gap-1 justify-end">
              <Droplets className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>Humidity: <b className="text-slate-900 dark:text-white">{humidity}%</b></span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <Wind className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Wind: <b className="text-slate-900 dark:text-white">{windSpeed} km/h</b></span>
            </div>
          </div>
        </div>

        {/* Rainfall Summary Breakdown */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-mono">
            <span>Observed Rain Series</span>
            <span className="text-amber-600 dark:text-amber-400 text-[10px]">rate: {intensity} mm/hr</span>
          </div>

          <div className="space-y-1.5 font-mono">
            {summaryRows.map((row) => (
              <div
                key={row.period}
                className={`flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl border ${
                  row.highlight
                    ? "bg-blue-500/10 border-blue-500/25 text-blue-900 dark:text-blue-200 font-bold"
                    : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300"
                }`}
              >
                <span>{row.period}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{row.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3.5 pt-2.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
        <span>IMD Automatic AWS Station</span>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-[#FF5A1F] font-bold flex items-center gap-0.5 cursor-pointer hover:underline"
          >
            Full Telemetry <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </GlassCard>
  );
}
