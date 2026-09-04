"use client";

import { motion } from "framer-motion";
import { RiskCard, RiskBadge } from "../risk-card";
import { AlertTriangle, Droplets, Clock, TrendingUp } from "lucide-react";
import type { PredictionResponse } from "@/lib/types";

export function RiskSummaryCard({ data }: { data: PredictionResponse }) {
  const percentage = Math.round(data.probability * 100);

  return (
    <RiskCard riskLevel={data.risk_level} className="col-span-2 row-span-2">
      <div className="flex flex-col h-full justify-between gap-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/50 font-medium tracking-wide uppercase">
              Flood Risk Assessment
            </p>
            <h2 className="text-4xl font-bold text-white mt-2">
              {percentage}%
            </h2>
            <p className="text-sm text-white/40 mt-1">Probability of flash flood</p>
          </div>
          <RiskBadge level={data.risk_level} />
        </div>

        {/* Circular gauge */}
        <div className="flex items-center justify-center py-4">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="10"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={
                  data.risk_level === "Very High"
                    ? "#ef4444"
                    : data.risk_level === "High"
                    ? "#f97316"
                    : data.risk_level === "Moderate"
                    ? "#eab308"
                    : "#22c55e"
                }
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 3.27} 327`}
                initial={{ strokeDasharray: "0 327" }}
                animate={{ strokeDasharray: `${percentage * 3.27} 327` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <AlertTriangle className="w-6 h-6 text-white/60 mx-auto mb-1" />
                <span className="text-lg font-bold text-white">{percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/[0.04] rounded-xl p-3 text-center">
            <Clock className="w-4 h-4 text-white/40 mx-auto mb-1" />
            <p className="text-lg font-semibold text-white">{data.lead_time_hrs}h</p>
            <p className="text-[10px] text-white/40 uppercase">Lead Time</p>
          </div>
          <div className="bg-white/[0.04] rounded-xl p-3 text-center">
            <TrendingUp className="w-4 h-4 text-white/40 mx-auto mb-1" />
            <p className="text-lg font-semibold text-white">
              {Math.round(data.confidence * 100)}%
            </p>
            <p className="text-[10px] text-white/40 uppercase">Confidence</p>
          </div>
          <div className="bg-white/[0.04] rounded-xl p-3 text-center">
            <Droplets className="w-4 h-4 text-white/40 mx-auto mb-1" />
            <p className="text-lg font-semibold text-white">
              {data.top_drivers.length}
            </p>
            <p className="text-[10px] text-white/40 uppercase">Drivers</p>
          </div>
        </div>

        {/* SHAP Top Drivers */}
        {data.top_drivers && data.top_drivers.length > 0 && (
          <div className="mt-1 bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <p className="text-[10px] text-white/40 uppercase font-semibold tracking-wider mb-2">
              Key SHAP Risk Drivers
            </p>
            <div className="flex flex-wrap gap-2">
              {data.top_drivers.map((driver) => (
                <span
                  key={driver}
                  className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium capitalize"
                >
                  ⚡ {driver.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </RiskCard>
  );
}
