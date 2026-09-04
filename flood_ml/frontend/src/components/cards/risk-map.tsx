"use client";

import { useEffect, useRef } from "react";
import { GlassCard } from "../glass-card";
import { Map, Layers, Navigation2, ShieldCheck, AlertTriangle } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface RiskMapCardProps {
  selectedState: "Assam" | "Uttarakhand";
  selectedDistrict?: string;
  selectedCatchment?: string;
  riskPercentage?: number;
}

// Region Coordinates & Telemetry data
const REGION_MAP_DATA = {
  Assam: {
    center: [24.8333, 92.7789] as [number, number],
    zoom: 10,
    riverName: "Barak River Basin",
    riverPath: [
      [24.7800, 93.0200],
      [24.8050, 92.9300],
      [24.8230, 92.7980],
      [24.8550, 92.6800],
      [24.8900, 92.5700],
      [24.8640, 92.3590],
    ] as [number, number][],
    zones: [
      {
        name: "Silchar Urban Catchment (A127)",
        coords: [24.8230, 92.7980] as [number, number],
        risk: "Very High",
        prob: 93,
        color: "#EF4444",
        details: "Water level +1.8m above threshold. Severe flood alert.",
      },
      {
        name: "Kushiyara Confluence (Karimganj)",
        coords: [24.8640, 92.3590] as [number, number],
        risk: "High",
        prob: 78,
        color: "#F97316",
        details: "Embankment pressure high. Discharge 1,420 m³/s.",
      },
      {
        name: "Hailakandi Lowland Drainage",
        coords: [24.6830, 92.5630] as [number, number],
        risk: "Moderate",
        prob: 52,
        color: "#EAB308",
        details: "Waterlogged paddy zones. Slow drainage runoff.",
      },
      {
        name: "Lakhipur Safe Relief Corridor",
        coords: [24.7920, 93.0120] as [number, number],
        risk: "Safe Shelter",
        prob: 4,
        color: "#10B981",
        details: "Designated high-ground evacuation camp #2.",
      },
    ],
  },
  Uttarakhand: {
    center: [30.7268, 78.4354] as [number, number],
    zoom: 10,
    riverName: "Upper Bhagirathi River",
    riverPath: [
      [30.9800, 78.8900],
      [30.8700, 78.7200],
      [30.8167, 78.6167],
      [30.7268, 78.4354],
      [30.6100, 78.3600],
      [30.5360, 78.2980],
    ] as [number, number][],
    zones: [
      {
        name: "Uttarkashi Gorge Surge Node",
        coords: [30.7268, 78.4354] as [number, number],
        risk: "Very High",
        prob: 93,
        color: "#EF4444",
        details: "Steep slope cloudburst runoff. Inundation lead time: 2.5 hrs.",
      },
      {
        name: "Bhatwari Debris Flow Segment",
        coords: [30.8167, 78.6167] as [number, number],
        risk: "High",
        prob: 81,
        color: "#F97316",
        details: "NH-34 highway obstruction risk. Active landslide zone.",
      },
      {
        name: "Dharasu Inflow Junction",
        coords: [30.5600, 78.3200] as [number, number],
        risk: "Moderate",
        prob: 45,
        color: "#EAB308",
        details: "Moderate flash flood accumulation from Alaknanda tributaries.",
      },
      {
        name: "Chinyalisaur Safe Heli-base & Camp",
        coords: [30.5360, 78.2980] as [number, number],
        risk: "Safe Shelter",
        prob: 2,
        color: "#10B981",
        details: "Elevated runway & primary NDRF medical post.",
      },
    ],
  },
};

export function RiskMapCard({
  selectedState = "Assam",
  selectedDistrict,
  selectedCatchment,
  riskPercentage,
}: RiskMapCardProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if initialized
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const stateData = REGION_MAP_DATA[selectedState] || REGION_MAP_DATA.Assam;

    // Create Leaflet Map Instance with CartoDB Dark Matter tiles
    const map = L.map(mapContainerRef.current, {
      center: stateData.center,
      zoom: stateData.zoom,
      zoomControl: true,
      attributionControl: false,
    });

    // OpenStreetMap with High-Tech Dark HUD Filter
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      className: "dark-osm-tiles",
    }).addTo(map);

    const layers = L.layerGroup().addTo(map);
    layerGroupRef.current = layers;

    // Draw River Course (cyan glowing polyline)
    L.polyline(stateData.riverPath, {
      color: "#06B6D4",
      weight: 4,
      opacity: 0.8,
      dashArray: "6, 8",
    })
      .bindPopup(`<b style="color:#0891b2">${stateData.riverName}</b><br/>Primary Drainage Channel`)
      .addTo(layers);

    // Add Risk Nodes & Zones with glowing pulsing icons
    stateData.zones.forEach((zone) => {
      // Pulsing Circle Marker
      L.circle(zone.coords, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.2,
        radius: 2200,
        weight: 1.5,
      }).addTo(layers);

      // Custom Glowing DivIcon
      const markerIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="position:relative; width:24px; height:24px; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:100%; height:100%; border-radius:50%; background-color:${zone.color}; opacity:0.3; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="width:12px; height:12px; border-radius:50%; background-color:${zone.color}; border:2px solid #ffffff; box-shadow:0 0 10px ${zone.color};"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(zone.coords, { icon: markerIcon }).addTo(layers);

      marker.bindPopup(`
        <div style="font-family:sans-serif; min-width:180px; padding:2px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
            <span style="font-size:11px; font-weight:bold; color:#0f172a;">${zone.name}</span>
            <span style="font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px; background-color:${zone.color}20; color:${zone.color};">${zone.risk}</span>
          </div>
          <p style="font-size:11px; color:#475569; margin:4px 0;">${zone.details}</p>
          <div style="font-size:10px; font-weight:bold; color:#64748b; border-top:1px solid #e2e8f0; padding-top:4px; margin-top:4px;">
            Predicted Risk: <span style="color:${zone.color}; font-size:12px;">${zone.prob}%</span>
          </div>
        </div>
      `);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [selectedState]);

  return (
    <GlassCard glowColor="rgba(6,182,212,0.12)" className="row-span-2 flex flex-col p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30">
            <Map className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white tracking-widest uppercase font-mono">
              REAL OSM RISK MAP — {selectedState}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Live OpenStreetMap + Catchment Drainage Network
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#080B12] border border-[#161D2C] text-[10px] font-mono text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>CartoDB Dark Matter Active</span>
        </div>
      </div>

      {/* Real Leaflet OpenStreetMap Container */}
      <div className="relative flex-1 min-h-[280px] rounded-2xl overflow-hidden border border-[#181F30] shadow-inner">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />

        {/* Floating Coordinates Badge */}
        <div className="absolute top-3 right-3 z-20 bg-[#05070B]/85 backdrop-blur-md border border-[#181F30] rounded-xl px-3 py-1.5 text-[10px] font-mono text-slate-300 pointer-events-none">
          <span className="text-[#FF3B1D] font-bold">📍 Active Basin:</span>{" "}
          {selectedState === "Assam" ? "24.83°N, 92.77°E (Barak)" : "30.72°N, 78.43°E (Bhagirathi)"}
        </div>
      </div>

      {/* Legend & Telemetry Key */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-[#141A28] text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Very High (&gt;80%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>High (60-80%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Safe Shelter</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-cyan-400">
          <span className="w-3 h-0.5 bg-cyan-400" />
          <span>River Channel Stream</span>
        </div>
      </div>
    </GlassCard>
  );
}
