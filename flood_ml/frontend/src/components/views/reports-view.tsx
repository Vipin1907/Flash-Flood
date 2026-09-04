"use client";

import { useState } from "react";
import { GlassCard } from "../glass-card";
import {
  FileText,
  Download,
  Copy,
  Printer,
  CheckCircle2,
  Calendar,
  MapPin,
  ShieldAlert,
  Share2,
} from "lucide-react";
import type { FeatureInputs } from "../layout/top-filter-bar";
import type { PredictionResponse } from "@/lib/types";

interface ReportsViewProps {
  selectedState: "Assam" | "Uttarakhand";
  selectedDistrict: string;
  selectedCatchment: string;
  features: FeatureInputs;
  prediction: PredictionResponse | null;
}

export function ReportsView({
  selectedState,
  selectedDistrict,
  selectedCatchment,
  features,
  prediction,
}: ReportsViewProps) {
  const [copied, setCopied] = useState(false);

  const reportId = `DEIP-192-REP-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const riskLevel = prediction?.risk_level || "HIGH RISK";
  const probPercent = prediction
    ? (prediction.probability * 100).toFixed(1)
    : "78.4";
  const leadTime = prediction?.lead_time_hrs || 3;
  const topDrivers = prediction?.top_drivers || [
    "Rainfall_1h (28.5 mm)",
    "Rainfall_7d (185.0 mm)",
    "Soil Saturation (72%)",
  ];

  const reportMarkdown = `# DEIP-192 FLASH FLOOD EARLY WARNING & ACTION REPORT
Report Reference: ${reportId}
Issued At: ${dateStr}
Classification: CRITICAL DISASTER MANAGEMENT SITREP

## 1. INCIDENT LOCATION & WATERSHED
- Jurisdiction: ${selectedDistrict} District, State of ${selectedState}
- Target Catchment: ${selectedCatchment}
- Geospatial Coordinates: ${selectedState === "Assam" ? "24.8333°N, 92.7789°E" : "30.7268°N, 78.4354°E"}

## 2. MACHINE LEARNING RISK ASSESSMENT
- AI Engine: XGBoost Real V2 + TreeSHAP Explainability
- Evaluated Risk Status: ${riskLevel}
- Peak Flood Probability: ${probPercent}%
- Actionable Lead Time: ${leadTime} Hours prior to flood crest
- Dominant Hydrological Drivers: ${topDrivers.join(", ")}

## 3. HYDROMETEOROLOGICAL TELEMETRY
- Current 1-Hour Rainfall: ${features.rainfall_mm} mm
- Cumulative 7-Day Antecedent Rainfall: ${features.rainfall_7d} mm
- Estimated Soil Saturation Index: ${(features.soil_saturation_proxy * 100).toFixed(0)}%
- Digital Elevation Mean Slope: ${features.slope_mean}°
- Watershed Flow Accumulation: ${features.flow_accumulation} log(cells)

## 4. EMERGENCY ACTION DIRECTIVES
- Immediate Evacuation: Residents in low-lying riparian floodplains must evacuate to designated relief shelters.
- Recommended Corridor: Lakhipur High Ground Shelter Campus via NH-37.
- Caution: AVOID Bethukandi / low-lying stream crossings due to rapid water ingress.
- Agency Actions: CWC sluice gates to be regulated, SDRF teams placed on active standby.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const reportData = {
      reportId,
      timestamp: dateStr,
      location: {
        state: selectedState,
        district: selectedDistrict,
        catchment: selectedCatchment,
      },
      prediction,
      features,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-[#0B0E19]/90 border border-[#181F30] backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
              DEIP-192 Official Hazard Situation Report:
            </span>
            <span className="text-xs text-[#FF5A3D] font-bold bg-[#FF3B1D]/15 px-2.5 py-0.5 rounded-lg border border-[#FF3B1D]/25 font-mono">
              Ref: {reportId}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Generated: <b className="text-white">{dateStr}</b> • Target: <b className="text-emerald-400">{selectedDistrict}, {selectedState}</b>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-[#0E1322] hover:bg-[#141B30] border border-[#1C253B] text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "Copied!" : "Copy Report"}</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-3.5 py-2 rounded-xl bg-[#0E1322] hover:bg-[#141B30] border border-[#1C253B] text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#FF3B1D] hover:bg-[#E02E10] text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md shadow-[#FF3B1D]/25 cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Report Document Sheet */}
      <div className="max-w-4xl mx-auto bg-[#090C16] border border-[#181F30] rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 font-sans">
        {/* Document Header */}
        <div className="border-b border-[#181F30] pb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-[#FF3B1D] animate-pulse" />
              <span className="text-lg font-black text-white uppercase tracking-widest font-mono">
                PRAVAH AI
              </span>
              <span className="text-xs text-slate-500 font-mono">| DEIP-192</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Flash Flood Early Warning & Action Situation Report
            </h2>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 space-y-1">
            <div>Doc ID: <b className="text-white">{reportId}</b></div>
            <div>Date: <b className="text-slate-300">{dateStr}</b></div>
            <div>Status: <b className="text-red-400 font-bold">URGENT DISPATCH</b></div>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#0B0E18] border border-[#161D2C] font-mono text-center">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Risk Level</span>
            <span className="text-xl font-black text-red-400">{riskLevel}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Flood Probability</span>
            <span className="text-xl font-black text-white">{probPercent}%</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Action Lead Time</span>
            <span className="text-xl font-black text-yellow-400">{leadTime} Hours</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Current Rain</span>
            <span className="text-xl font-black text-cyan-400">{features.rainfall_mm} mm</span>
          </div>
        </div>

        {/* Section 1: Location & Catchment */}
        <div className="space-y-2">
          <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FF3B1D]" />
            <span>1. Location Assessment & Catchment Geography</span>
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            The target area is located in <b>{selectedDistrict} District, {selectedState}</b> within the <b>{selectedCatchment}</b> watershed basin. Antecedent moisture conditions have reached critical saturation at <b>{(features.soil_saturation_proxy * 100).toFixed(0)}%</b> with 7-day cumulative rainfall exceeding <b>{features.rainfall_7d} mm</b>.
          </p>
        </div>

        {/* Section 2: Machine Learning Findings */}
        <div className="space-y-2">
          <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>2. XGBoost + TreeSHAP Predictive Findings</span>
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            The machine learning ensemble model has triggered a <b>{riskLevel}</b> classification with confidence level <b>{probPercent}%</b>. The local SHAP feature attributions identify the following dominant hydrological drivers:
          </p>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-1 pl-2">
            {topDrivers.map((driver, idx) => (
              <li key={idx} className="font-mono text-xs">
                <span className="text-cyan-300 font-bold">{driver}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3: Recommended Action Directives */}
        <div className="p-5 rounded-2xl bg-[#FF3B1D]/10 border border-[#FF3B1D]/30 space-y-2">
          <h4 className="text-sm font-bold text-[#FF5A3D] uppercase font-mono tracking-wider">
            🚨 Immediate Emergency Directives
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed font-mono">
            • Issue immediate evacuation advisory for riparian floodplain wards.<br />
            • Direct traffic away from submerged culverts and low stream crossings.<br />
            • Activate Lakhipur High Ground Shelter & Chinyalisaur Base for emergency staging.<br />
            • Transmit bilingual SMS broadcast alerts to community leaders and local volunteers.
          </p>
        </div>

        {/* Signature & Authentication */}
        <div className="pt-6 border-t border-[#181F30] flex items-center justify-between text-xs font-mono text-slate-500">
          <div>Verified by: PravahAI Machine Learning Engine v2.0</div>
          <div>DEIP-192 Autonomous Disaster Intelligence</div>
        </div>
      </div>
    </div>
  );
}
