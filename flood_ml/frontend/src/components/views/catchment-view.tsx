"use client";

import { useState } from "react";
import { GlassCard } from "../glass-card";
import {
  Layers,
  Mountain,
  Droplets,
  Activity,
  Trees,
  TrendingUp,
  MapPin,
  Compass,
  ArrowDownRight,
  ShieldAlert,
} from "lucide-react";

interface CatchmentViewProps {
  selectedState: "Assam" | "Uttarakhand";
  selectedDistrict: string;
  selectedCatchment: string;
}

const CATCHMENT_SPECS = {
  Assam: {
    name: "Barak River Basin (Sub-Basin A127)",
    area: "26,193 km²",
    elevationRange: "18m - 1,200m MSL",
    meanSlope: "18.4° (Hills) / 2.1° (Valley)",
    soilType: "Alluvial Silty-Clay (Low infiltration)",
    runoffCoefficient: "0.82 (High Runoff)",
    flowAccumulationMax: "14,820 cells",
    drainageDensity: "3.4 km/km²",
    subBasins: [
      {
        name: "A127-1 Silchar Core Drainage",
        area: "420 km²",
        discharge: "1,840 m³/s",
        saturation: "92%",
        status: "Critical Risk",
        color: "text-red-400 border-red-500/30 bg-red-500/10",
      },
      {
        name: "A127-2 Kushiyara Upper Reach",
        area: "780 km²",
        discharge: "1,210 m³/s",
        saturation: "78%",
        status: "High Alert",
        color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
      },
      {
        name: "A127-3 Surma Valley Lowlands",
        area: "960 km²",
        discharge: "890 m³/s",
        saturation: "64%",
        status: "Moderate Watch",
        color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
      },
      {
        name: "A127-4 Lakhipur Foothills",
        area: "540 km²",
        discharge: "420 m³/s",
        saturation: "45%",
        status: "Normal",
        color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      },
    ],
  },
  Uttarakhand: {
    name: "Upper Bhagirathi Himalayan Catchment",
    area: "8,240 km²",
    elevationRange: "950m - 6,800m MSL",
    meanSlope: "29.7° (Steep V-Shaped Gorge)",
    soilType: "Rocky Glacial Moraine / Colluvium",
    runoffCoefficient: "0.91 (Ultra Rapid Runoff)",
    flowAccumulationMax: "6,410 cells",
    drainageDensity: "4.8 km/km²",
    subBasins: [
      {
        name: "BH-01 Uttarkashi Gorge Reach",
        area: "310 km²",
        discharge: "980 m³/s (Flash Surge)",
        saturation: "88%",
        status: "Cloudburst Alert",
        color: "text-red-400 border-red-500/30 bg-red-500/10",
      },
      {
        name: "BH-02 Bhatwari Debris Torrent",
        area: "460 km²",
        discharge: "740 m³/s",
        saturation: "76%",
        status: "High Watch",
        color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
      },
      {
        name: "BH-03 Harsil High Valley",
        area: "620 km²",
        discharge: "390 m³/s",
        saturation: "51%",
        status: "Moderate",
        color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
      },
      {
        name: "BH-04 Chinyalisaur Reservoir Inflow",
        area: "890 km²",
        discharge: "520 m³/s",
        saturation: "38%",
        status: "Controlled",
        color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      },
    ],
  },
};

export function CatchmentView({
  selectedState,
  selectedDistrict,
  selectedCatchment,
}: CatchmentViewProps) {
  const specs = CATCHMENT_SPECS[selectedState];
  const [selectedSub, setSelectedSub] = useState(specs.subBasins[0]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-[#0B0E19]/90 border border-[#181F30] backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
              Hydrographic Catchment Basin:
            </span>
            <span className="text-xs text-cyan-400 font-bold bg-cyan-500/15 px-2.5 py-0.5 rounded-lg border border-cyan-500/25 font-mono">
              {specs.name}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Catchment DEM Slope: <b className="text-white">{specs.meanSlope}</b> • Runoff Potential: <b className="text-red-400">{specs.runoffCoefficient}</b>
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-[#080B14] px-3.5 py-2 rounded-xl border border-[#151C2C]">
          <MapPin className="w-3.5 h-3.5 text-[#FF3B1D]" />
          <span>Active Basin: {selectedCatchment}</span>
        </div>
      </div>

      {/* 4 Key Catchment Telemetry Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B0E18] border border-[#181F30]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono font-bold">Total Basin Area</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{specs.area}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">Hydrographic boundary area</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0E18] border border-[#181F30]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono font-bold">Elevation Gradient</span>
            <Mountain className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{specs.elevationRange}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">SRTM 30m Digital Elevation</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0E18] border border-[#181F30]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono font-bold">Drainage Density</span>
            <Droplets className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{specs.drainageDensity}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">Channel length per km²</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0E18] border border-[#181F30]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono font-bold">Max Flow Acc.</span>
            <Activity className="w-4 h-4 text-[#FF3B1D]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{specs.flowAccumulationMax}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">Upstream contributing cells</p>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sub-Basin Status Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Catchment Sub-Basin Status & Discharges
            </h3>
            <span className="text-xs text-slate-400 font-mono">Click to inspect</span>
          </div>

          {specs.subBasins.map((sub, idx) => (
            <div
              key={sub.name}
              onClick={() => setSelectedSub(sub)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedSub.name === sub.name
                  ? "bg-[#0E1424] border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                  : "bg-[#0B0E18] border-[#181F30] hover:border-slate-600"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-sm font-bold text-white">{sub.name}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border ${sub.color}`}>
                  {sub.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
                <div>
                  <span className="text-slate-500 block text-[10px]">Sub-Area:</span>
                  <span className="text-white font-semibold">{sub.area}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Peak Discharge:</span>
                  <span className="text-cyan-400 font-semibold">{sub.discharge}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Soil Saturation:</span>
                  <span className="text-emerald-400 font-semibold">{sub.saturation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Sub-Basin Deep Dive */}
        <div className="lg:col-span-5 bg-[#0B0E18] border border-[#181F30] rounded-2xl p-5 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">
              Drainage Sub-Basin Diagnostics
            </span>
            <h4 className="text-base font-black text-white mt-0.5">
              {selectedSub.name}
            </h4>
          </div>

          <div className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C] space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Dominant Soil Texture:</span>
              <span className="text-slate-200 font-bold">{specs.soilType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Mean Terrain Gradient:</span>
              <span className="text-yellow-400 font-bold">{specs.meanSlope}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Runoff Yield Rate:</span>
              <span className="text-[#FF3B1D] font-bold">{specs.runoffCoefficient}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Time of Concentration (Tc):</span>
              <span className="text-cyan-400 font-bold">
                {selectedState === "Assam" ? "2.4 Hours" : "28 Minutes"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 block font-bold">
              Sub-basin Infiltration Saturation Curve:
            </span>
            <div className="w-full h-3 rounded-full bg-[#141B2C] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500"
                style={{ width: selectedSub.saturation }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Dry Soil (0%)</span>
              <span>Critical Over-Saturation (100%)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FF3B1D]/10 border border-[#FF3B1D]/25 text-xs text-slate-300 leading-relaxed font-mono">
            🚨 <b>Hydrological Advisory:</b> Fast runoff convergence detected from upper ridges. Low lying floodplain zones must prepare sluice gates.
          </div>
        </div>
      </div>
    </div>
  );
}
