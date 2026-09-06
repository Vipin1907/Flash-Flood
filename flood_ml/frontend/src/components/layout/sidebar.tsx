"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Map,
  Layers,
  Waves,
  Bell,
  Navigation,
  Users,
  FileText,
  Database,
  Settings,
  CloudRain,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavTab =
  | "landing"
  | "weather-telemetry"
  | "dashboard"
  | "risk-map"
  | "catchment"
  | "hydrology"
  | "alerts"
  | "routes"
  | "impact"
  | "reports"
  | "data-quality"
  | "settings";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const navItems: { id: NavTab; label: string; icon: any; badge?: string }[] = [
  { id: "landing", label: "Home / Overview", icon: LayoutDashboard },
  { id: "weather-telemetry", label: "Weather & Telemetry", icon: CloudRain, badge: "Step 2" },
  { id: "dashboard", label: "Live Dashboard", icon: Layers, badge: "AI" },
  { id: "risk-map", label: "Risk Map", icon: Map },
  { id: "catchment", label: "Catchment View", icon: Layers },
  { id: "hydrology", label: "Hydrology", icon: Waves },
  { id: "alerts", label: "Alerts", icon: Bell, badge: "Live" },
  { id: "routes", label: "Routes & Safety", icon: Navigation, badge: "OSM" },
  { id: "impact", label: "Impact / Exposure", icon: Users },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "data-quality", label: "Data Quality", icon: Database },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
          />

          {/* Slide-out Sidebar Drawer */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-white/98 dark:bg-[#06080E]/98 backdrop-blur-2xl border-r border-slate-200 dark:border-[#151B29] flex flex-col h-screen select-none z-50 shadow-2xl shadow-slate-400/30 dark:shadow-black/80 transition-colors duration-200"
          >
            {/* Drawer Header with Logo & Close X Button */}
            <div className="p-5 border-b border-slate-200 dark:border-[#151B29] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#FF3B1D]/15 border border-[#FF3B1D]/30">
                  <div className="w-3 h-3 rounded-full bg-[#FF3B1D] shadow-lg shadow-[#FF3B1D]/60 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-widest uppercase">
                      PRAVAH
                    </h1>
                    <span className="text-sm font-black text-[#FF3B1D] tracking-widest uppercase">
                      AI.
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase mt-0.5">
                    Flash Flood Intelligence
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Close Sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation List */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 text-left group cursor-pointer",
                      isActive
                        ? "bg-gradient-to-r from-[#FF3B1D] to-[#D9260B] text-white shadow-lg shadow-[#FF3B1D]/25 font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-[#FF3B1D] dark:group-hover:text-white"
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded-md font-bold tracking-wider uppercase font-mono",
                          isActive
                            ? "bg-black/30 text-white"
                            : "bg-[#FF3B1D]/15 text-[#FF5A3D] border border-[#FF3B1D]/25"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Bottom Info Status */}
            <div className="p-4 border-t border-slate-200 dark:border-[#151B29] bg-slate-50 dark:bg-[#05070B] transition-colors duration-200">
              <div className="bg-white dark:bg-[#090C15] border border-slate-200 dark:border-[#161D2C] rounded-xl p-3 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    Assam & Uttarakhand
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                  OSM Evacuation Engine Active
                  <br />
                  ML: XGBoost v2 + TreeSHAP
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
