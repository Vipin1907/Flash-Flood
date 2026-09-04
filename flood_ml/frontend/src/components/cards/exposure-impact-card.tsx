"use client";

import { GlassCard } from "../glass-card";
import { Users, Home, AlertOctagon, Car, Milestone } from "lucide-react";

export function ExposureImpactCard() {
  const impacts = [
    { label: "Villages at Risk", value: "12", icon: Home, color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "Population Exposed", value: "~12,500", icon: Users, color: "text-red-400", bg: "bg-red-500/10" },
    { label: "Critical Facilities", value: "1 (School)", icon: AlertOctagon, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Roads at Risk", value: "4 Sections", icon: Car, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Bridges Near Risk", value: "2", icon: Milestone, color: "text-rose-400", bg: "bg-rose-500/10" },
  ];

  return (
    <GlassCard glowColor="rgba(249,115,22,0.12)" className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">
            Exposure / Impact (Est.)
          </span>
          <span className="text-[10px] bg-orange-500/15 border border-orange-500/25 text-orange-400 px-2 py-0.5 rounded-full font-semibold">
            Vulnerability Analysis
          </span>
        </div>

        <div className="space-y-2">
          {impacts.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <span className="text-xs text-white/70">{item.label}</span>
                </div>
                <span className="font-mono text-xs font-bold text-white">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
        <span>Census & OpenStreetMap Layer</span>
        <span className="text-red-400 font-semibold">Evacuation Priority: HIGH</span>
      </div>
    </GlassCard>
  );
}
