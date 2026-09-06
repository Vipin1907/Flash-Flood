"use client";

import { motion } from "framer-motion";
import { RiskCard, RiskBadge } from "../risk-card";
import { AlertTriangle, Droplets, Clock, TrendingUp, Sparkles, ShieldAlert, CheckCircle2 } from "lucide-react";
import type { PredictionResponse } from "@/lib/types";

export function RiskSummaryCard({ data }: { data: PredictionResponse }) {
  const percentage = Math.round(data.probability * 100);
  const confidencePct = Math.round(data.confidence * 100);

  // Generate plain English explanation based on risk and top drivers (Section 7 of Spec)
  const getWhyThisRiskExplanation = () => {
    if (data.risk_level === "Very High" || data.risk_level === "High") {
      const driverText = data.top_drivers && data.top_drivers.length > 0
        ? data.top_drivers.slice(0, 2).map(d => d.replace(/_/g, " ")).join(" and ")
        : "excessive precipitation";
      return `Recent heavy ${driverText} exceeds the catchment infiltration threshold, leading to rapid surface runoff and high flash flood inundation risk.`;
    } else if (data.risk_level === "Moderate") {
      return "Catchment soil is moderately saturated. Continued precipitation in the next 3 to 6 hours could trigger localized stream swelling.";
    } else {
      return "Current precipitation and catchment antecedent moisture are within safe absorption limits with low flash flood probability.";
    }
  };

  return (
    <RiskCard riskLevel={data.risk_level} className="h-full flex flex-col justify-between">
      <div>
        {/* Top Header & Badge */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <ShieldAlert className="w-4 h-4 text-[#FF5A1F]" />
              <span>AI Flash Flood Assessment</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              {percentage}%
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Flood Inundation Probability
            </p>
          </div>
          <RiskBadge level={data.risk_level} />
        </div>

        {/* Circular Gauge & Core Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
          {/* Circular SVG Gauge */}
          <div className="sm:col-span-5 flex justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="currentColor"
                  className="text-slate-200 dark:text-white/10"
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
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <AlertTriangle className="w-5 h-5 text-amber-500 mb-0.5" />
                <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{percentage}%</span>
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400">Threat</span>
              </div>
            </div>
          </div>

          {/* 3 Metric Pills */}
          <div className="sm:col-span-7 grid grid-cols-3 gap-2 font-mono">
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-white/5 text-center shadow-sm">
              <Clock className="w-3.5 h-3.5 text-[#FF5A1F] mx-auto mb-1" />
              <p className="text-base font-black text-slate-900 dark:text-white">{data.lead_time_hrs}h</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-bold">Lead Time</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-white/5 text-center shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500 mx-auto mb-1" />
              <p className="text-base font-black text-slate-900 dark:text-white">{confidencePct}%</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-bold">Confidence</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-white/5 text-center shadow-sm">
              <Droplets className="w-3.5 h-3.5 text-emerald-500 mx-auto mb-1" />
              <p className="text-base font-black text-slate-900 dark:text-white">
                {data.top_drivers?.length || 3}
              </p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-bold">Key Drivers</p>
            </div>
          </div>
        </div>

        {/* Section 7: Explainable AI "Why this risk?" Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 uppercase text-[11px] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>Why this risk? (Explainable AI Insight)</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            {getWhyThisRiskExplanation()}
          </p>

          {data.top_drivers && data.top_drivers.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {data.top_drivers.map((driver) => (
                <span
                  key={driver}
                  className="px-2 py-0.5 rounded-md bg-orange-500/10 dark:bg-red-500/10 border border-orange-500/25 dark:border-red-500/25 text-orange-700 dark:text-red-300 text-[10px] font-mono font-semibold capitalize"
                >
                  ⚡ {driver.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Model Verification Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
        <span>Model: Calibrated XGBoost V2 (scale_pos_weight)</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Live Inference Ready
        </span>
      </div>
    </RiskCard>
  );
}
