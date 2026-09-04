"use client";

import { useState } from "react";
import { GlassCard } from "../glass-card";
import {
  Waves,
  TrendingUp,
  AlertOctagon,
  Activity,
  ArrowUpRight,
  Radio,
  Gauge,
  Clock,
  ShieldAlert,
} from "lucide-react";

interface HydrologyViewProps {
  selectedState: "Assam" | "Uttarakhand";
}

const RIVER_STATIONS = {
  Assam: [
    {
      id: "st-1",
      station: "Annapurna Ghat (Silchar)",
      river: "Barak River",
      currentLevel: 20.45,
      dangerLevel: 19.83,
      warningLevel: 18.83,
      hfl: 21.98,
      trend: "Rising Rapidly",
      rateCmHr: "+6.4 cm/hr",
      discharge: "2,140 m³/s",
      status: "Severe Danger",
      statusColor: "text-red-400 bg-red-500/10 border-red-500/30",
    },
    {
      id: "st-2",
      station: "Badarpur Ghat",
      river: "Barak River",
      currentLevel: 17.15,
      dangerLevel: 16.85,
      warningLevel: 15.85,
      hfl: 18.25,
      trend: "Rising",
      rateCmHr: "+3.8 cm/hr",
      discharge: "1,680 m³/s",
      status: "Above Danger",
      statusColor: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    },
    {
      id: "st-3",
      station: "Fulertal Gauge",
      river: "Barak River",
      currentLevel: 24.10,
      dangerLevel: 25.50,
      warningLevel: 24.50,
      hfl: 26.85,
      trend: "Rising Steadily",
      rateCmHr: "+4.1 cm/hr",
      discharge: "1,450 m³/s",
      status: "Watch Level",
      statusColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    },
    {
      id: "st-4",
      station: "Lakhipur CWC Station",
      river: "Jiri / Barak Confluence",
      currentLevel: 22.30,
      dangerLevel: 24.00,
      warningLevel: 23.00,
      hfl: 25.40,
      trend: "Stable",
      rateCmHr: "+0.5 cm/hr",
      discharge: "920 m³/s",
      status: "Normal",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
  ],
  Uttarakhand: [
    {
      id: "st-5",
      station: "Uttarkashi Town Gauge",
      river: "Bhagirathi River",
      currentLevel: 1124.6,
      dangerLevel: 1123.0,
      warningLevel: 1121.5,
      hfl: 1127.2,
      trend: "Surge Spike",
      rateCmHr: "+18.2 cm/hr",
      discharge: "1,150 m³/s",
      status: "Flash Flood",
      statusColor: "text-red-400 bg-red-500/10 border-red-500/30",
    },
    {
      id: "st-6",
      station: "Devprayag Confluence",
      river: "Alaknanda - Bhagirathi",
      currentLevel: 458.2,
      dangerLevel: 462.0,
      warningLevel: 459.0,
      hfl: 465.8,
      trend: "Rising",
      rateCmHr: "+5.2 cm/hr",
      discharge: "2,380 m³/s",
      status: "Watch Level",
      statusColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    },
    {
      id: "st-7",
      station: "Joshimath Downstream",
      river: "Alaknanda River",
      currentLevel: 1380.4,
      dangerLevel: 1384.0,
      warningLevel: 1382.0,
      hfl: 1388.5,
      trend: "Steady",
      rateCmHr: "+1.2 cm/hr",
      discharge: "840 m³/s",
      status: "Normal",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
  ],
};

export function HydrologyView({ selectedState }: HydrologyViewProps) {
  const stations = RIVER_STATIONS[selectedState];
  const [selectedStation, setSelectedStation] = useState(stations[0]);

  const diffFromDanger = (selectedStation.currentLevel - selectedStation.dangerLevel).toFixed(2);
  const isAboveDanger = selectedStation.currentLevel >= selectedStation.dangerLevel;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-[#0B0E19]/90 border border-[#181F30] backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
              Hydrological River Stage Monitoring:
            </span>
            <span className="text-xs text-blue-400 font-bold bg-blue-500/15 px-2.5 py-0.5 rounded-lg border border-blue-500/25 font-mono">
              CWC Real-Time Telemetry Feed
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Active Station Network: <b className="text-white">{stations.length} Gauge Sensors</b> • Refresh Frequency: <b className="text-emerald-400">10 Minutes</b>
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/25">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Telemetry Stream Active</span>
        </div>
      </div>

      {/* Main Gauge Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: River Level Gauge Visualizer */}
        <div className="lg:col-span-5 bg-[#0B0E18] border border-[#181F30] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500">
                Active Gauge Station
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                {selectedStation.station}
              </h3>
              <p className="text-xs text-blue-400 font-mono mt-0.5">
                {selectedStation.river}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${selectedStation.statusColor}`}>
              {selectedStation.status}
            </span>
          </div>

          {/* Current Level Meter Box */}
          <div className="p-5 rounded-xl bg-[#080B14] border border-[#151C2C] text-center relative overflow-hidden">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Current Water Level
            </span>
            <div className="text-5xl font-black text-white font-mono my-2 tracking-tight">
              {selectedStation.currentLevel} <span className="text-xl text-slate-500">m</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FF3B1D]/15 text-[#FF5A3D] border border-[#FF3B1D]/30">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{selectedStation.rateCmHr} ({selectedStation.trend})</span>
            </div>
          </div>

          {/* Danger Benchmarks Comparison */}
          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-[#080B14] border border-[#151C2C]">
              <span className="text-slate-400">Danger Mark (DL):</span>
              <span className="text-red-400 font-bold">{selectedStation.dangerLevel} m</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-[#080B14] border border-[#151C2C]">
              <span className="text-slate-400">Warning Mark (WL):</span>
              <span className="text-yellow-400 font-bold">{selectedStation.warningLevel} m</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-[#080B14] border border-[#151C2C]">
              <span className="text-slate-400">Historical Peak (HFL):</span>
              <span className="text-slate-200 font-bold">{selectedStation.hfl} m</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-[#080B14] border border-[#151C2C]">
              <span className="text-slate-400">Discharge Flow:</span>
              <span className="text-cyan-400 font-bold">{selectedStation.discharge}</span>
            </div>
          </div>

          {/* Inundation Warning Alert Banner */}
          <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed ${
            isAboveDanger
              ? "bg-red-500/15 border-red-500/30 text-red-300"
              : "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
          }`}>
            {isAboveDanger ? (
              <span>
                🚨 <b>DANGER BREACH:</b> River stage is <b>+{diffFromDanger}m</b> above the official CWC danger level! Embankment sluices pressurized.
              </span>
            ) : (
              <span>
                ✓ River stage is currently <b>{Math.abs(Number(diffFromDanger))}m</b> below danger mark. Continuous telemetry surveillance active.
              </span>
            )}
          </div>
        </div>

        {/* Right: Station Network List & Telemetry Status */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Central Water Commission (CWC) Sensor Network
            </h3>
            <span className="text-xs text-slate-400 font-mono">Select station to monitor</span>
          </div>

          <div className="space-y-3">
            {stations.map((st) => (
              <div
                key={st.id}
                onClick={() => setSelectedStation(st)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedStation.id === st.id
                    ? "bg-[#0E1528] border-blue-500/60 shadow-lg shadow-blue-500/15"
                    : "bg-[#0B0E18] border-[#181F30] hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Waves className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold text-white">{st.station}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border ${st.statusColor}`}>
                    {st.status}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Current:</span>
                    <span className="text-white font-bold">{st.currentLevel}m</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Danger:</span>
                    <span className="text-red-400 font-bold">{st.dangerLevel}m</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Rise Rate:</span>
                    <span className="text-yellow-400 font-bold">{st.rateCmHr}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Discharge:</span>
                    <span className="text-cyan-400 font-bold">{st.discharge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hydrograph 24-Hour Timeline projection */}
          <div className="bg-[#0B0E18] border border-[#181F30] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-white uppercase tracking-wider">
                Predicted 24-Hour Surge Hydrograph
              </span>
              <span className="text-slate-500">Lead Time: 3 Hours</span>
            </div>

            <div className="h-28 flex items-end gap-2 pt-4 px-2 border-b border-[#181F30]">
              {[35, 42, 50, 68, 85, 96, 92, 84, 76, 65, 55, 48].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      val >= 80 ? "bg-red-500 group-hover:bg-red-400" : val >= 60 ? "bg-orange-500" : "bg-blue-500"
                    }`}
                    style={{ height: `${val}%` }}
                  />
                  <span className="text-[9px] text-slate-500 font-mono">{i * 2}h</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
              <span>Now (T+0)</span>
              <span className="text-red-400 font-bold">Peak Inflow (T+10h)</span>
              <span>Receding (T+24h)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
