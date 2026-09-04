"use client";

import { GlassCard } from "./glass-card";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/types";

const riskConfig: Record<
  RiskLevel,
  { glow: string; border: string; badge: string; text: string }
> = {
  Low: {
    glow: "rgba(34,197,94,0.15)",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-400",
    text: "text-emerald-400",
  },
  Moderate: {
    glow: "rgba(234,179,8,0.15)",
    border: "border-yellow-500/30",
    badge: "bg-yellow-500/20 text-yellow-400",
    text: "text-yellow-400",
  },
  High: {
    glow: "rgba(249,115,22,0.2)",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-400",
    text: "text-orange-400",
  },
  "Very High": {
    glow: "rgba(239,68,68,0.25)",
    border: "border-red-500/40",
    badge: "bg-red-500/20 text-red-400",
    text: "text-red-400",
  },
};

interface RiskCardProps {
  riskLevel: RiskLevel;
  children: React.ReactNode;
  className?: string;
}

export function RiskCard({ riskLevel, children, className }: RiskCardProps) {
  const config = riskConfig[riskLevel];

  return (
    <GlassCard
      glowColor={config.glow}
      className={cn(config.border, className)}
    >
      {children}
    </GlassCard>
  );
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const config = riskConfig[level];
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase",
        config.badge
      )}
    >
      {level}
    </span>
  );
}

export { riskConfig };
