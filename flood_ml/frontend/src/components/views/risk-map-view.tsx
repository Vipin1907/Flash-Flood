"use client";

import { useState, useEffect, useRef } from "react";
import { GlassCard } from "../glass-card";
import {
  Map as MapIcon,
  Layers,
  Navigation2,
  ShieldCheck,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  Download,
  Info,
  Radio,
  Eye,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface RiskMapViewProps {
  selectedState: "Assam" | "Uttarakhand";
  selectedDistrict: string;
  selectedCatchment: string;
  riskProbability?: number;
}

const REGION_GIS_DATA = {
  Assam: {
    center: [24.8333, 92.7789] as [number, number],
    zoom: 10,
    riverName: "Barak River Basin Network",
    riverPath: [
      [24.7800, 93.0200],
      [24.8050, 92.9300],
      [24.8230, 92.7980],
      [24.8550, 92.6800],
      [24.8900, 92.5700],
      [24.8640, 92.3590],
    ] as [number, number][],
    tributaries: [
      [[24.8230, 92.7980], [24.7200, 92.7500]],
      [[24.8550, 92.6800], [24.9500, 92.6500]],
    ] as [number, number][][],
    zones: [
      {
        id: "z1",
        name: "Silchar Urban Inundation Zone (A127)",
        coords: [24.8230, 92.7980] as [number, number],
        risk: "Critical (93%)",
        type: "danger",
        elevation: "25m MSL",
        depthEst: "1.6m - 2.1m",
        action: "Evacuation Order Active",
        details: "Embankment breach at Bethukandi sluice gate. Rapid water ingress in urban wards.",
      },
      {
        id: "z2",
        name: "Kushiyara Confluence (Karimganj)",
        coords: [24.8640, 92.3590] as [number, number],
        risk: "High (78%)",
        type: "warning",
        elevation: "22m MSL",
        depthEst: "0.8m - 1.2m",
        action: "Stage 2 Watch",
        details: "Discharge 1,420 m³/s. Upstream surge from Manipur hills converging.",
      },
      {
        id: "z3",
        name: "Hailakandi Lowland Agricultural Basin",
        coords: [24.6830, 92.5630] as [number, number],
        risk: "Moderate (52%)",
        type: "caution",
        elevation: "28m MSL",
        depthEst: "0.3m - 0.6m",
        action: "Drainage Advisory",
        details: "Waterlogged low-lying paddy zones. Saturated alluvium.",
      },
      {
        id: "z4",
        name: "Lakhipur High-Ground Relief Camp",
        coords: [24.7920, 93.0120] as [number, number],
        risk: "Safe Shelter (4%)",
        type: "safe",
        elevation: "62m MSL",
        depthEst: "Dry / Elevated",
        action: "Open for 2,500 Evacuees",
        details: "Designated state emergency shelter campus with potable water & heli-drop zone.",
      },
    ],
  },
  Uttarakhand: {
    center: [30.7268, 78.4354] as [number, number],
    zoom: 10,
    riverName: "Upper Bhagirathi Gorge System",
    riverPath: [
      [30.9800, 78.8900],
      [30.8500, 78.6800],
      [30.7268, 78.4354],
      [30.6500, 78.3800],
      [30.5360, 78.2980],
    ] as [number, number][],
    tributaries: [
      [[30.7268, 78.4354], [30.7600, 78.3900]],
      [[30.6500, 78.3800], [30.6800, 78.3200]],
    ] as [number, number][][],
    zones: [
      {
        id: "z5",
        name: "Uttarkashi Town & Flash Runoff Basin",
        coords: [30.7268, 78.4354] as [number, number],
        risk: "Flash Flood Warning (89%)",
        type: "danger",
        elevation: "1,158m MSL",
        depthEst: "High Velocity Surge",
        action: "Red Alert Broadcasted",
        details: "Severe cloudburst upstream. Steep 29.7° slope causing rapid 18-minute runoff peak.",
      },
      {
        id: "z6",
        name: "Bhatwari Upstream Torrent Junction",
        coords: [30.8500, 78.6800] as [number, number],
        risk: "High Torrent (82%)",
        type: "warning",
        elevation: "1,420m MSL",
        depthEst: "Debris / Mud Flow",
        action: "Road Blockade Active",
        details: "Stream crossing damaged on Gangotri Highway (NH-34).",
      },
      {
        id: "z7",
        name: "Chinyalisaur Safe High Heli-base",
        coords: [30.5360, 78.2980] as [number, number],
        risk: "Safe Corridor (2%)",
        type: "safe",
        elevation: "850m MSL Airstrip",
        depthEst: "Dry / Reinforced",
        action: "Operations Base Active",
        details: "Primary regional airstrip & disaster response logistical staging point.",
      },
    ],
  },
};

export function RiskMapView({
  selectedState,
  selectedDistrict,
  selectedCatchment,
  riskProbability = 78,
}: RiskMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeLayers, setActiveLayers] = useState({
    radar: true,
    river: true,
    zones: true,
    shelters: true,
  });

  const [selectedZone, setSelectedZone] = useState<any>(
    REGION_GIS_DATA[selectedState].zones[0]
  );

  const data = REGION_GIS_DATA[selectedState];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: data.center,
      zoom: data.zoom,
      zoomControl: false,
    });
    mapInstanceRef.current = map;

    // Dark Tile Layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 18,
        subdomains: "abcd",
      }
    ).addTo(map);

    // Zoom control on bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layerGroup;

    // Draw Layers
    renderLayers(map, layerGroup);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [selectedState, activeLayers]);

  const renderLayers = (map: L.Map, layerGroup: L.LayerGroup) => {
    layerGroup.clearLayers();

    // 1. River Network Layer
    if (activeLayers.river) {
      L.polyline(data.riverPath, {
        color: "#0284C7",
        weight: 5,
        opacity: 0.85,
        dashArray: "1, 6",
        lineCap: "round",
      }).addTo(layerGroup);

      data.tributaries.forEach((trib) => {
        L.polyline(trib, {
          color: "#38BDF8",
          weight: 2.5,
          opacity: 0.6,
        }).addTo(layerGroup);
      });
    }

    // 2. Precipitation Radar Overlay (Semi-transparent pulsing circle)
    if (activeLayers.radar) {
      L.circle(data.center, {
        radius: 18000,
        color: "#FF3B1D",
        weight: 1,
        fillColor: "#FF3B1D",
        fillOpacity: 0.12,
      }).addTo(layerGroup);

      L.circle(data.center, {
        radius: 9000,
        color: "#EF4444",
        weight: 1.5,
        fillColor: "#EF4444",
        fillOpacity: 0.22,
      }).addTo(layerGroup);
    }

    // 3. Risk & Shelter Markers
    data.zones.forEach((zone) => {
      if (zone.type === "safe" && !activeLayers.shelters) return;
      if (zone.type !== "safe" && !activeLayers.zones) return;

      const isSafe = zone.type === "safe";
      const iconColor = isSafe ? "#10B981" : zone.type === "danger" ? "#EF4444" : "#F59E0B";

      const customIcon = L.divIcon({
        className: "custom-gis-pin",
        html: `
          <div style="
            width: 22px;
            height: 22px;
            background: ${iconColor};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 0 16px ${iconColor};
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker(zone.coords, { icon: customIcon }).addTo(layerGroup);

      marker.on("click", () => {
        setSelectedZone(zone);
        map.panTo(zone.coords);
      });
    });
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(data.center, data.zoom);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#0B0E19]/90 border border-[#181F30] backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
              High-Precision GIS Risk Map:
            </span>
            <span className="text-xs text-[#FF5A3D] font-bold bg-[#FF3B1D]/15 px-2.5 py-0.5 rounded-lg border border-[#FF3B1D]/25 font-mono">
              {selectedDistrict}, {selectedState} ({selectedCatchment})
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Spatial Resolution: <b className="text-white">30m DEM + OSM Drainage</b> • Flood Extent Model: <b className="text-emerald-400">XGBoost Real V2</b>
          </p>
        </div>

        {/* Map Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveLayers((p) => ({ ...p, radar: !p.radar }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              activeLayers.radar
                ? "bg-[#FF3B1D]/20 text-[#FF5A3D] border-[#FF3B1D]/40"
                : "bg-[#0E1322] text-slate-400 border-[#1C253B]"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Precipitation Radar</span>
          </button>

          <button
            onClick={() => setActiveLayers((p) => ({ ...p, river: !p.river }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              activeLayers.river
                ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                : "bg-[#0E1322] text-slate-400 border-[#1C253B]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>River Network</span>
          </button>

          <button
            onClick={() => setActiveLayers((p) => ({ ...p, shelters: !p.shelters }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              activeLayers.shelters
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                : "bg-[#0E1322] text-slate-400 border-[#1C253B]"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Safe Shelters</span>
          </button>

          <button
            onClick={handleRecenter}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0E1322] hover:bg-[#141B30] border border-[#1C253B] text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
            title="Reset Map Center"
          >
            <Navigation2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Center</span>
          </button>
        </div>
      </div>

      {/* Main Map Body & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: GIS Map */}
        <div className="lg:col-span-8 bg-[#090C16] border border-[#161D2C] rounded-2xl overflow-hidden relative shadow-2xl h-[580px]">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Map Legend Floating on Top-Left */}
          <div className="absolute top-4 left-4 z-10 bg-[#080B14]/95 border border-[#1A2234] rounded-xl p-3 backdrop-blur-md text-xs font-mono space-y-1.5 shadow-xl max-w-[210px]">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#FF3B1D]" />
              <span>Map Legends</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
              <span className="text-slate-200 text-[11px]">High Inundation Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
              <span className="text-slate-300 text-[11px]">Watch / Waterlogged</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span className="text-slate-300 text-[11px]">Designated Safe Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-blue-400" />
              <span className="text-slate-300 text-[11px]">Main River Channel</span>
            </div>
          </div>
        </div>

        {/* Right: Waypoint Inspector & Zone Telemetry */}
        <div className="lg:col-span-4 space-y-4">
          {selectedZone ? (
            <div className="bg-[#0B0E18] border border-[#181F30] rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Selected Waypoint Inspector
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5">
                    {selectedZone.name}
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                    selectedZone.type === "safe"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-red-500/15 text-red-400 border border-red-500/30"
                  }`}
                >
                  {selectedZone.risk}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080B14] border border-[#151C2C] space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Elevation:</span>
                  <span className="text-white font-bold">{selectedZone.elevation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Est. Water Depth:</span>
                  <span className="text-yellow-400 font-bold">{selectedZone.depthEst}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status Advisory:</span>
                  <span className="text-cyan-400 font-bold">{selectedZone.action}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="text-slate-400">
                    {selectedZone.coords[0].toFixed(4)}°N, {selectedZone.coords[1].toFixed(4)}°E
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase font-mono font-semibold text-slate-400 block mb-1">
                  Hydrological Impact Details:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#080B14] p-3 rounded-xl border border-[#151C2C]">
                  {selectedZone.details}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const geojson = JSON.stringify(selectedZone, null, 2);
                    navigator.clipboard.writeText(geojson);
                    alert("Zone Coordinates & Details Copied to Clipboard!");
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#FF3B1D]/15 hover:bg-[#FF3B1D]/25 border border-[#FF3B1D]/30 text-[#FF5A3D] text-xs font-bold font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Copy Zone Metadata (JSON)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 font-mono text-xs bg-[#0B0E18] rounded-2xl border border-[#181F30]">
              Click any pin on the map to inspect live hydrological conditions.
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0B0E18] border border-[#181F30]">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Catchment Area</span>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {selectedState === "Assam" ? "26,193 km²" : "8,240 km²"}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0B0E18] border border-[#181F30]">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Active CWC Gauges</span>
              <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                14 Stations
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
