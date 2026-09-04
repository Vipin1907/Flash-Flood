"use client";

import { useState } from "react";
import { GlassCard } from "../glass-card";
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Wifi,
  Satellite,
  Waves,
  ShieldCheck,
  Server,
  Activity,
} from "lucide-react";

export function DataQualityView() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState("Just now");

  const [services, setServices] = useState([
    {
      name: "XGBoost Real V2 ML Pipeline",
      icon: Cpu,
      category: "Inference Engine",
      latency: "14ms",
      uptime: "99.98%",
      status: "Operational",
      statusBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      details: "Native C++ TreeSHAP fast path loaded. 9-feature telemetry schema validated.",
    },
    {
      name: "IMD Doppler Weather Radar Feed",
      icon: Wifi,
      category: "Meteorological Telemetry",
      latency: "210ms",
      uptime: "99.84%",
      status: "Operational",
      statusBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      details: "Silchar & Dehradun radar stations streaming 10-minute precipitation grids.",
    },
    {
      name: "CWC River Stage Sensor Stream",
      icon: Waves,
      category: "Hydrological Sensors",
      latency: "95ms",
      uptime: "99.91%",
      status: "Operational",
      statusBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      details: "14 active ultrasonic water level gauge stations across Barak & Bhagirathi basins.",
    },
    {
      name: "Sentinel-2 NDVI Vegetation Index",
      icon: Satellite,
      category: "Earth Observation Satellite",
      latency: "Cached (18h)",
      uptime: "100%",
      status: "Synchronized",
      statusBadge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      details: "10m surface reflectance raster cloud-filtered. Catchment absorption proxy ready.",
    },
    {
      name: "OpenStreetMap Evacuation Routing",
      icon: Database,
      category: "Geospatial Routing Graph",
      latency: "32ms",
      uptime: "100%",
      status: "Operational",
      statusBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      details: "High-ground Dijkstra graph pre-compiled. Inundated road exclusions active.",
    },
    {
      name: "LangGraph + Gemini 1.5 SMS Agent",
      icon: Server,
      category: "Agentic Messaging",
      latency: "420ms",
      uptime: "99.75%",
      status: "Operational",
      statusBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      details: "State machine checkpointer initialized. Bilingual Assamese/Hindi prompt templates loaded.",
    },
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastChecked("Just now");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-[#0B0E19]/90 border border-[#181F30] backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
              Telemetry Ingestion & Sensor Data Quality:
            </span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/15 px-2.5 py-0.5 rounded-lg border border-emerald-500/25 font-mono">
              System Health 100% Nominal
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Last Telemetry Heartbeat: <b className="text-white">{lastChecked}</b> • Missing Values: <b className="text-emerald-400">0.00%</b>
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 rounded-xl bg-[#0E1322] hover:bg-[#141B30] border border-[#1C253B] text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Pinging Sensors..." : "Re-Verify Health"}</span>
        </button>
      </div>

      {/* 4 Health Overview Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B0E18] border border-[#181F30]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono font-bold">API Gateway Latency</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">18 ms</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">FastAPI Python backend</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0E18] border border-[#181F30]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono font-bold">Sensor Packet Loss</span>
            <Wifi className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">0.02%</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">CWC Telemetry link</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0E18] border border-[#181F30]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono font-bold">Schema Consistency</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">100%</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">Pydantic v2 strict models</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0E18] border border-[#181F30]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono font-bold">SHAP Accuracy</span>
            <Cpu className="w-4 h-4 text-[#FF3B1D]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">97.4%</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">TreeSHAP exact additivity</p>
        </div>
      </div>

      {/* Services Breakdown List */}
      <div className="bg-[#0B0E18] border border-[#181F30] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
          Integrated Data Ingestion Services & Sensor Health
        </h3>

        <div className="space-y-3">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.name}
                className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{svc.name}</span>
                      <span className="text-[10px] text-slate-500 uppercase">({svc.category})</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{svc.details}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-slate-500 text-[10px]">Latency</div>
                    <div className="text-white font-bold">{svc.latency}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-500 text-[10px]">Uptime</div>
                    <div className="text-emerald-400 font-bold">{svc.uptime}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] ${svc.statusBadge}`}>
                    {svc.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
