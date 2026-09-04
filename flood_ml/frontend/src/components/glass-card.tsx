"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hoverScale?: number;
}

export function GlassCard({
  children,
  className,
  glowColor = "rgba(255,255,255,0.04)",
  hoverScale = 1.015,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ scale: hoverScale, y: -2 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={cn(
        "relative rounded-2xl border border-[#181F30]",
        "bg-[#0B0E18]/90 backdrop-blur-xl",
        "p-6 overflow-hidden",
        "transition-all duration-200",
        "shadow-lg shadow-black/40 hover:shadow-2xl hover:border-[#222C44]",
        className
      )}
      style={{
        boxShadow: `0 4px 20px 0 rgba(0,0,0,0.5), 0 0 15px 0 ${glowColor}`,
      }}
    >
      {/* Top bevel highlight line like Contagion Grid cards */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
