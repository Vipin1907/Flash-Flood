"use client";

import { useState } from "react";
import { GlassCard } from "../glass-card";
import {
  Users,
  Building2,
  AlertTriangle,
  HeartPulse,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Truck,
  MapPin,
} from "lucide-react";

interface ImpactViewProps {
  selectedState: "Assam" | "Uttarakhand";
  selectedDistrict: string;
  selectedCatchment: string;
}

const IMPACT_DATA = {
  Assam: {
    totalPop: "248,500",
    exposedPop: "46,200",
    vulnerablePop: "14,800 (Infants / Elderly)",
    livestockAtRisk: "18,400 Cattle",
    facilities: [
      { name: "Silchar Civil Hospital (Ward 4)", type: "Hospital", risk: "Low Elevation Ground Floor Inundation", status: "Sandbagging Active" },
      { name: "Tarapur Girls High School", type: "School", risk: "Surrounded by 0.9m Water", status: "Evacuated" },
      { name: "Sadarghat Bridge Approach Road", type: "Transport Link", risk: "Erosion on East Abutment", status: "Restricted Light Vehicles" },
      { name: "Sonai Primary Health Centre", type: "Health Facility", risk: "Power Backup Flood Protected", status: "Operational" },
    ],
    shelters: [
      { name: "Lakhipur High-Ground Multi-Purpose Shelter", capacity: "3,500", occupied: "1,240 (35%)", status: "Active & Accepting", waterFood: "Good" },
      { name: "Silchar Govt Boys Higher Secondary", capacity: "2,000", occupied: "1,850 (92%)", status: "Near Capacity", waterFood: "Supplies Dispatched" },
      { name: "Sonai Block Community Hall", capacity: "1,200", occupied: "420 (35%)", status: "Active", waterFood: "Good" },
    ],
  },
  Uttarakhand: {
    totalPop: "84,200",
    exposedPop: "16,800",
    vulnerablePop: "4,600 (Elderly / Pilgrims)",
    livestockAtRisk: "6,200 Livestock",
    facilities: [
      { name: "Uttarkashi District Hospital", type: "Hospital", risk: "Located on Hill Terrace (Safe)", status: "Trauma Care Ready" },
      { name: "Bhatwari Inter-College", type: "School", risk: "Debris flow threat on access road", status: "Closed" },
      { name: "Gangotri NH-34 Culvert Km 42", type: "Bridge / Highway", risk: "Torrent overflow - Water depth 85cm", status: "Traffic Suspended" },
      { name: "Chinyalisaur Helipad Staging", type: "Logistics Hub", risk: "Airstrip Elevation Safe", status: "Active Fleet Base" },
    ],
    shelters: [
      { name: "Chinyalisaur Multi-Purpose Relief Campus", capacity: "2,500", occupied: "680 (27%)", status: "Active & Ready", waterFood: "Full Stock" },
      { name: "Uttarkashi Municipal Hall Shelter", capacity: "1,000", occupied: "820 (82%)", status: "High Occupancy", waterFood: "Adequate" },
    ],
  },
};

export function ImpactView({ selectedState, selectedDistrict, selectedCatchment }: ImpactViewProps) {
  const data = IMPACT_DATA[selectedState];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-[#0B0E19]/90 border border-[#181F30] backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
              Socio-Economic Exposure & Impact Assessment:
            </span>
            <span className="text-xs text-orange-400 font-bold bg-orange-500/15 px-2.5 py-0.5 rounded-lg border border-orange-500/25 font-mono">
              Census Overlay + OSM Building Footprints
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Catchment: <b className="text-white">{selectedDistrict} ({selectedCatchment})</b> • Threat Class: <b className="text-red-400">High Inundation Exposure</b>
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-300 bg-[#080B14] px-3.5 py-2 rounded-xl border border-[#151C2C]">
          <Truck className="w-3.5 h-3.5 text-cyan-400" />
          <span>SDRF Relief Teams Deployed</span>
        </div>
      </div>

      {/* Exposure Metrics 4-Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B0E18] border border-[#181F30]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono font-bold">Total Catchment Pop.</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{data.totalPop}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">District watershed total</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0E18] border border-[#181F30]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono font-bold">High-Risk Exposure</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 font-mono">{data.exposedPop}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">Within 1.5m flood buffer</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0E18] border border-[#181F30]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono font-bold">Vulnerable Cohort</span>
            <HeartPulse className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-orange-400 font-mono">{data.vulnerablePop}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">Priority evacuation groups</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0E18] border border-[#181F30]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono font-bold">Livestock at Risk</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{data.livestockAtRisk}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">Requiring highland fodder</p>
        </div>
      </div>

      {/* Facilities at Risk & Shelters Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Critical Facilities at Risk */}
        <div className="lg:col-span-6 bg-[#0B0E18] border border-[#181F30] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#FF3B1D]" />
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Critical Infrastructure Exposure
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">OSM Verified</span>
          </div>

          <div className="space-y-2.5">
            {data.facilities.map((fac, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#080B14] border border-[#151C2C] space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">{fac.name}</span>
                  <span className="text-[10px] text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 font-bold">
                    {fac.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Type: {fac.type}</span>
                  <span className="text-red-300">{fac.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Relief Camp Network */}
        <div className="lg:col-span-6 bg-[#0B0E18] border border-[#181F30] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Designated Evacuation Shelters
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">Live Status</span>
          </div>

          <div className="space-y-3">
            {data.shelters.map((sh, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#080B14] border border-[#151C2C] space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">{sh.name}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                    {sh.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-400 text-[11px]">
                  <div>Capacity: <b className="text-white">{sh.capacity} persons</b></div>
                  <div>Occupancy: <b className="text-cyan-400">{sh.occupied}</b></div>
                </div>
                <div className="text-slate-500 text-[10px]">Potable Water & Food Rations: <b className="text-emerald-400">{sh.waterFood}</b></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
