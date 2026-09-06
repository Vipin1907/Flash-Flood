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
        "relative rounded-2xl border border-slate-200 dark:border-[#181F30]",
        "bg-white/95 dark:bg-[#0B0E18]/90 backdrop-blur-xl text-slate-900 dark:text-slate-100",
        "p-6 overflow-hidden",
        "transition-all duration-200",
        "shadow-md shadow-slate-200/50 dark:shadow-black/40 hover:shadow-xl hover:border-slate-300 dark:hover:border-[#222C44]",
        className
      )}
      style={{
        boxShadow: `0 4px 20px 0 rgba(0,0,0,0.06), 0 0 15px 0 ${glowColor}`,
      }}
    >
      {/* Top bevel highlight line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
