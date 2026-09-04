"use client";

import { motion } from "framer-motion";
import { CheckCircle, Loader2, Sparkles, Cpu, Satellite, Route } from "lucide-react";

interface AnalysisProgressModalProps {
  currentStep: number;
  totalSteps?: number;
}

const steps = [
  { icon: Satellite, title: "1. Fetching Remote Sensing Data", desc: "Ingesting IMD radar & GPM precipitation for selected catchment..." },
  { icon: Sparkles, title: "2. Soil & Hydrology Feature Extraction", desc: "Computing antecedent moisture, drainage accumulation & slope gradients..." },
  { icon: Cpu, title: "3. Running XGBoost AI Model", desc: "Executing inference against model_real_v2.pkl flood classifier..." },
  { icon: Route, title: "4. Calculating SHAP Drivers & Safe Routes", desc: "Generating TreeSHAP attributions and OSMnx obstacle-weighted routing..." },
];

export function AnalysisProgressModal({ currentStep }: AnalysisProgressModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="w-full max-w-lg bg-[#0d122c] border border-blue-500/30 rounded-2xl p-6 shadow-2xl shadow-blue-900/40 relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              AI Prediction & Analysis Pipeline
            </h3>
            <p className="text-xs text-white/50">Processing real-time catchment hydrology...</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
            initial={{ width: "10%" }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Step Items */}
        <div className="space-y-3.5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={step.title}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-blue-600/10 border-blue-500/40 shadow-sm"
                    : isCompleted
                    ? "bg-white/[0.02] border-emerald-500/20"
                    : "bg-white/[0.01] border-white/5 opacity-40"
                }`}
              >
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4 text-white/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white">{step.title}</div>
                  <p className="text-[11px] text-white/50 mt-0.5 leading-snug">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
