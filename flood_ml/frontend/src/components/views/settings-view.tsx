"use client";

import { useState } from "react";
import { GlassCard } from "../glass-card";
import {
  Settings,
  Sliders,
  Bell,
  Key,
  Database,
  Check,
  Save,
  Radio,
  Sparkles,
  MapPin,
  ShieldAlert,
} from "lucide-react";

export function SettingsView() {
  const [warningThreshold, setWarningThreshold] = useState(40);
  const [dangerThreshold, setDangerThreshold] = useState(70);
  const [autoDispatchAlerts, setAutoDispatchAlerts] = useState(true);
  const [telemetryInterval, setTelemetryInterval] = useState("10");
  const [mapTheme, setMapTheme] = useState("dark");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-[#0B0E19]/90 border border-[#181F30] backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
              System Configuration & Model Sensitivity:
            </span>
            <span className="text-xs text-blue-400 font-bold bg-blue-500/15 px-2.5 py-0.5 rounded-lg border border-blue-500/25 font-mono">
              PravahAI Core Parameters
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Manage risk boundaries, LangGraph agent autonomous broadcast triggers, and telemetry poll rates.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF3B1D] to-[#D9260B] hover:from-[#FF4E33] hover:to-[#E02E10] text-white text-xs font-black font-mono tracking-wider uppercase transition-all shadow-lg shadow-[#FF3B1D]/30 flex items-center gap-2 cursor-pointer"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Risk Probability Thresholds */}
        <div className="bg-[#0B0E18] border border-[#181F30] rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#181F30]">
            <Sliders className="w-4 h-4 text-[#FF3B1D]" />
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              XGBoost Model Risk Thresholds
            </h3>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-yellow-400 font-bold">Stage 1 Warning Threshold</span>
                <span className="text-white font-bold">{warningThreshold}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(parseInt(e.target.value))}
                className="w-full accent-yellow-400"
              />
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                Triggers cautionary advisory for emergency disaster management teams.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-red-400 font-bold">Stage 2 Red Danger Threshold</span>
                <span className="text-white font-bold">{dangerThreshold}%</span>
              </div>
              <input
                type="range"
                min="55"
                max="90"
                value={dangerThreshold}
                onChange={(e) => setDangerThreshold(parseInt(e.target.value))}
                className="w-full accent-[#FF3B1D]"
              />
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                Triggers mandatory evacuation order and bilingual SMS alerts.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: LangGraph & Agent Automation */}
        <div className="bg-[#0B0E18] border border-[#181F30] rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#181F30]">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Autonomous Agent & SMS Dispatch
            </h3>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#080B14] border border-[#151C2C]">
              <div>
                <span className="text-white font-bold block">Autonomous LangGraph SMS Dispatch</span>
                <span className="text-slate-500 text-[10px]">Auto-broadcast SMS when Red Alert threshold is crossed</span>
              </div>
              <button
                onClick={() => setAutoDispatchAlerts(!autoDispatchAlerts)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  autoDispatchAlerts ? "bg-emerald-500" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    autoDispatchAlerts ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase block mb-1.5">
                Telemetry Refresh Interval
              </label>
              <select
                value={telemetryInterval}
                onChange={(e) => setTelemetryInterval(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#080B14] border border-[#151C2C] text-white focus:outline-none cursor-pointer"
              >
                <option value="5">Every 5 Minutes (High Alert Mode)</option>
                <option value="10">Every 10 Minutes (Standard Telemetry)</option>
                <option value="30">Every 30 Minutes (Conserve Quota)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase block mb-1.5">
                GIS Map Surface Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMapTheme("dark")}
                  className={`p-2.5 rounded-xl border font-bold cursor-pointer ${
                    mapTheme === "dark"
                      ? "bg-[#FF3B1D]/20 text-white border-[#FF3B1D]/40"
                      : "bg-[#080B14] text-slate-400 border-[#151C2C]"
                  }`}
                >
                  Carto Dark Matter
                </button>
                <button
                  onClick={() => setMapTheme("satellite")}
                  className={`p-2.5 rounded-xl border font-bold cursor-pointer ${
                    mapTheme === "satellite"
                      ? "bg-[#FF3B1D]/20 text-white border-[#FF3B1D]/40"
                      : "bg-[#080B14] text-slate-400 border-[#151C2C]"
                  }`}
                >
                  High-Res Terrain
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
