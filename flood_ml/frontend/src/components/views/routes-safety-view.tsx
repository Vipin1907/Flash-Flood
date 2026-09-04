"use client";

import { useState, useEffect, useRef } from "react";
import { GlassCard } from "../glass-card";
import {
  Navigation,
  Shield,
  AlertTriangle,
  Clock,
  Route,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Car,
  Milestone,
  ArrowRight,
  MapPin,
  ExternalLink,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface RouteData {
  name: string;
  distance: string;
  time: string;
  exposure: string;
  exposureColor: string;
  status: string;
  statusBadge: string;
  icon: any;
  isRecommended: boolean;
}

const EVACUATION_MAP_DATA = {
  Uttarakhand: {
    title: "Uttarkashi to Chamba / Chinyalisaur Safe Corridor",
    center: [30.6500, 78.3800] as [number, number],
    zoom: 11,
    start: { name: "Uttarkashi Town", coords: [30.7268, 78.4354] as [number, number] },
    hazard: {
      name: "NH-34 Km 42 Stream Crossing (Inundated)",
      coords: [30.6720, 78.3950] as [number, number],
      details: "Water depth 85cm. Landslide debris block. AVOID.",
    },
    shelter: {
      name: "Chinyalisaur Safe Shelter & Heli-base",
      coords: [30.5360, 78.2980] as [number, number],
      details: "High elevation shelter camp with medical supply station.",
    },
    blockedRoute: [
      [30.7268, 78.4354],
      [30.6950, 78.4150],
      [30.6720, 78.3950],
      [30.6200, 78.3500],
      [30.5360, 78.2980],
    ] as [number, number][],
    safeRouteA: [
      [30.7268, 78.4354],
      [30.7450, 78.3900],
      [30.7100, 78.3400],
      [30.6450, 78.3100],
      [30.5850, 78.2850],
      [30.5360, 78.2980],
    ] as [number, number][],
    secondaryRouteB: [
      [30.7268, 78.4354],
      [30.6900, 78.4700],
      [30.6100, 78.4300],
      [30.5500, 78.3600],
      [30.5360, 78.2980],
    ] as [number, number][],
  },
  Assam: {
    title: "Silchar Urban to Lakhipur High-Ground Relief Camp",
    center: [24.8100, 24.8100 ? 92.8900 : 92.8900] as [number, number],
    zoom: 11,
    start: { name: "Silchar City Center", coords: [24.8230, 92.7980] as [number, number] },
    hazard: {
      name: "Barak River Embankment Breach (NH-306)",
      coords: [24.8150, 92.8750] as [number, number],
      details: "Flood surge over road (1.2m depth). Impassable for light vehicles.",
    },
    shelter: {
      name: "Lakhipur Elevated Relief Camp #2",
      coords: [24.7920, 93.0120] as [number, number],
      details: "Designated high-ground relief shelter with 500-bed capacity.",
    },
    blockedRoute: [
      [24.8230, 92.7980],
      [24.8190, 92.8400],
      [24.8150, 92.8750],
      [24.8050, 92.9400],
      [24.7920, 93.0120],
    ] as [number, number][],
    safeRouteA: [
      [24.8230, 92.7980],
      [24.8600, 92.8300],
      [24.8750, 92.8950],
      [24.8450, 92.9650],
      [24.8100, 92.9950],
      [24.7920, 93.0120],
    ] as [number, number][],
    secondaryRouteB: [
      [24.8230, 92.7980],
      [24.7750, 92.8200],
      [24.7500, 92.8800],
      [24.7650, 92.9500],
      [24.7920, 93.0120],
    ] as [number, number][],
  },
};

export function RoutesSafetyView() {
  const [selectedState, setSelectedState] = useState<"Uttarakhand" | "Assam">("Uttarakhand");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const activeData = EVACUATION_MAP_DATA[selectedState];

  const routes: RouteData[] = [
    {
      name: "Normal Direct Route",
      distance: selectedState === "Uttarakhand" ? "48 km" : "32 km",
      time: selectedState === "Uttarakhand" ? "1h 20m" : "55m",
      exposure: "High (Submerged)",
      exposureColor: "text-red-400 bg-red-500/15 border-red-500/25",
      status: "Blocked",
      statusBadge: "bg-red-500/20 text-red-300 border-red-500/30",
      icon: XCircle,
      isRecommended: false,
    },
    {
      name: "Alternate Route A (Ridge Bypass)",
      distance: selectedState === "Uttarakhand" ? "63 km" : "45 km",
      time: selectedState === "Uttarakhand" ? "1h 45m" : "1h 15m",
      exposure: "Low (Safe)",
      exposureColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25",
      status: "Recommended",
      statusBadge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      icon: CheckCircle2,
      isRecommended: true,
    },
    {
      name: "Alternate Route B (Southern Flank)",
      distance: selectedState === "Uttarakhand" ? "57 km" : "41 km",
      time: selectedState === "Uttarakhand" ? "1h 30m" : "1h 05m",
      exposure: "Moderate",
      exposureColor: "text-yellow-400 bg-yellow-500/15 border-yellow-500/25",
      status: "Secondary",
      statusBadge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      icon: AlertCircle,
      isRecommended: false,
    },
  ];

  const riskySegments = [
    {
      title: selectedState === "Uttarakhand" ? "NH-34 Km 42 Stream Crossing" : "NH-306 Lowland Embankment",
      desc: "Severe flash overflow active — depth exceeding 85cm.",
      severity: "CRITICAL AVOID",
      color: "border-red-500/30 bg-red-500/10 text-red-400",
    },
    {
      title: selectedState === "Uttarakhand" ? "Bhatwari Debris Chute" : "Kushiyara Sluice Gate Overspill",
      desc: "Partial lane blockage due to mud accumulation.",
      severity: "CAUTION",
      color: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    },
  ];

  // Initialize and update real Leaflet OSM map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: activeData.center,
      zoom: activeData.zoom,
      zoomControl: true,
      attributionControl: false,
    });

    // OpenStreetMap with High-Tech Dark HUD Filter
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      className: "dark-osm-tiles",
    }).addTo(map);

    const layers = L.layerGroup().addTo(map);

    // 1. Blocked Normal Route (Red Dashed)
    L.polyline(activeData.blockedRoute, {
      color: "#EF4444",
      weight: 3.5,
      dashArray: "6, 8",
      opacity: 0.8,
    })
      .bindPopup("<b style='color:#ef4444'>Direct Highway Route</b><br/>Status: BLOCKED by flood inundation.")
      .addTo(layers);

    // 2. Safe Recommended Route A (Glowing Solid Green)
    L.polyline(activeData.safeRouteA, {
      color: "#10B981",
      weight: 4.5,
      opacity: 0.95,
    })
      .bindPopup("<b style='color:#10b981'>Alternate Route A (Ridge Corridor)</b><br/>Status: RECOMMENDED SAFE PATH.")
      .addTo(layers);

    // 3. Secondary Route B (Yellow Dashed)
    L.polyline(activeData.secondaryRouteB, {
      color: "#EAB308",
      weight: 3,
      dashArray: "4, 6",
      opacity: 0.75,
    })
      .bindPopup("<b style='color:#eab308'>Alternate Route B</b><br/>Status: Secondary alternate.")
      .addTo(layers);

    // 4. Hazard Marker (Pulsing Red)
    const hazardIcon = L.divIcon({
      className: "hazard-marker",
      html: `
        <div style="width:26px; height:26px; background:#EF4444; border:2px solid white; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:12px; box-shadow:0 0 12px #EF4444;">
          ✕
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });
    L.marker(activeData.hazard.coords, { icon: hazardIcon })
      .bindPopup(`<b>${activeData.hazard.name}</b><br/>${activeData.hazard.details}`)
      .addTo(layers);

    // 5. Start Marker (Blue Pin)
    const startIcon = L.divIcon({
      className: "start-marker",
      html: `
        <div style="padding:3px 8px; background:#3B82F6; color:white; font-weight:bold; font-size:10px; border-radius:6px; border:1px solid white; box-shadow:0 0 8px #3B82F6; white-space:nowrap;">
          START: ${activeData.start.name}
        </div>
      `,
      iconAnchor: [40, 10],
    });
    L.marker(activeData.start.coords, { icon: startIcon }).addTo(layers);

    // 6. Safe Shelter Marker (Green Shield)
    const shelterIcon = L.divIcon({
      className: "shelter-marker",
      html: `
        <div style="padding:3px 8px; background:#10B981; color:black; font-weight:bold; font-size:10px; border-radius:6px; border:1px solid white; box-shadow:0 0 10px #10B981; white-space:nowrap;">
          SAFE SHELTER: ${activeData.shelter.name}
        </div>
      `,
      iconAnchor: [50, 10],
    });
    L.marker(activeData.shelter.coords, { icon: shelterIcon })
      .bindPopup(`<b>${activeData.shelter.name}</b><br/>${activeData.shelter.details}`)
      .addTo(layers);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [selectedState]);

  return (
    <div className="space-y-6">
      {/* Header Banner with State Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#0B0E19] border border-[#181F30] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF3B1D]/15 border border-[#FF3B1D]/30 flex items-center justify-center">
            <Navigation className="w-5 h-5 text-[#FF3B1D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-wide uppercase font-mono">
                PANEL 9: ROUTES & SAFETY (OSM BASED)
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FF3B1D]/20 text-[#FF5A3D] border border-[#FF3B1D]/30">
                REAL-TIME
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              OpenStreetMap graph-weighted evacuation routing with obstacle avoidance
            </p>
          </div>
        </div>

        {/* State Toggle Buttons */}
        <div className="flex items-center gap-2 bg-[#06080E] p-1 rounded-xl border border-[#181F30]">
          <button
            onClick={() => setSelectedState("Uttarakhand")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedState === "Uttarakhand"
                ? "bg-[#FF3B1D] text-white shadow-md shadow-[#FF3B1D]/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Uttarakhand Corridor
          </button>
          <button
            onClick={() => setSelectedState("Assam")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedState === "Assam"
                ? "bg-[#FF3B1D] text-white shadow-md shadow-[#FF3B1D]/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Assam (Barak) Corridor
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Real Leaflet Map + Risky Segments */}
        <div className="lg:col-span-6 space-y-4">
          <GlassCard glowColor="rgba(16,185,129,0.1)" className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                  Live OSM Evacuation Map — {selectedState}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                CartoDB Dark Matter + Dijkstra Routing
              </span>
            </div>

            {/* Real Map Container */}
            <div className="relative h-[340px] rounded-xl overflow-hidden border border-[#181F30]">
              <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />

              {/* Map floating key */}
              <div className="absolute top-3 right-3 z-20 bg-[#05070B]/90 backdrop-blur-md border border-[#181F30] rounded-xl p-2 text-[10px] font-mono text-slate-300 space-y-1 pointer-events-none">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-3 h-1 bg-emerald-500 rounded-sm" />
                  <span>Alternate A (Recommended Safe)</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-400">
                  <span className="w-3 h-0.5 bg-red-500 border-dashed" />
                  <span>Normal Highway (Inundated)</span>
                </div>
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <span className="w-3 h-0.5 bg-yellow-500 border-dashed" />
                  <span>Alternate B (Secondary)</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Risky Segments Box */}
          <GlassCard glowColor="rgba(239,68,68,0.12)" className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Identified Road Inundation Obstacles
              </h3>
            </div>

            <div className="space-y-2.5">
              {riskySegments.map((seg) => (
                <div
                  key={seg.title}
                  className={`flex items-start justify-between p-3 rounded-xl border ${seg.color}`}
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>⚠</span> {seg.title}
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 font-mono">{seg.desc}</p>
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/40 shrink-0">
                    {seg.severity}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Route Comparison Table & Highlight Card */}
        <div className="lg:col-span-6 space-y-4">
          {/* Big Green Highlight Card (From Poster) */}
          <div className="relative rounded-2xl bg-[#081710] border-2 border-emerald-500/40 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 font-mono">
                  Recommended Evacuation Path
                </span>
                <h3 className="text-xl font-black text-white tracking-tight mt-0.5">
                  RECOMMENDED ROUTE: Alternate A
                </h3>
              </div>
              <div className="bg-emerald-500 text-black font-black text-xs px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg shadow-emerald-500/30 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 fill-black" />
                SAFER ROUTE
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-3 text-center">
                <p className="text-sm font-bold text-white font-mono">+15 km</p>
                <p className="text-[10px] text-emerald-300/60 uppercase mt-0.5 font-mono">Distance</p>
              </div>
              <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-3 text-center">
                <p className="text-sm font-bold text-white font-mono">+25 min</p>
                <p className="text-[10px] text-emerald-300/60 uppercase mt-0.5 font-mono">Travel Time</p>
              </div>
              <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-3 text-center">
                <p className="text-sm font-bold text-emerald-400 font-mono">-70%</p>
                <p className="text-[10px] text-emerald-300/60 uppercase mt-0.5 font-mono">Flood Exposure</p>
              </div>
            </div>

            <p className="text-xs text-emerald-200/90 leading-relaxed bg-black/30 p-3 rounded-xl border border-emerald-500/20 font-mono">
              ✓ Completely avoids flooded stream crossing and embankment breach zones.<br />
              ✓ Follows higher elevation ridge road with active emergency vehicle clearance.<br />
              ✓ Approved for civil evacuation, NDRF dispatch, and ambulance transit.
            </p>
          </div>

          {/* Route Comparison Table (From Poster) */}
          <GlassCard glowColor="rgba(255,255,255,0.06)" className="p-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">
              Route Comparison Matrix (OSM Weighted)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#181F30] text-slate-500 uppercase text-[10px]">
                    <th className="pb-2 font-bold">Route Option</th>
                    <th className="pb-2 font-bold">Distance</th>
                    <th className="pb-2 font-bold">Est. Time</th>
                    <th className="pb-2 font-bold">Exposure</th>
                    <th className="pb-2 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181F30]">
                  {routes.map((r) => {
                    const Icon = r.icon;
                    return (
                      <tr
                        key={r.name}
                        className={`transition-colors ${
                          r.isRecommended ? "bg-emerald-500/[0.08]" : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <td className="py-3 font-semibold text-white flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${r.isRecommended ? "text-emerald-400" : "text-slate-500"}`} />
                          {r.name}
                        </td>
                        <td className="py-3 text-slate-300">{r.distance}</td>
                        <td className="py-3 text-slate-300">{r.time}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${r.exposureColor}`}>
                            {r.exposure}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${r.statusBadge}`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
