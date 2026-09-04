"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ComposedChart,
} from "recharts";
import { GlassCard } from "../glass-card";
import { TrendingUp } from "lucide-react";
import type { RainfallDataPoint } from "@/lib/types";

export function RainfallChart({ data }: { data: RainfallDataPoint[] }) {
  return (
    <GlassCard className="col-span-2" glowColor="rgba(96,165,250,0.1)">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white/70 tracking-wide uppercase">
          Risk Forecast Timeline
        </h3>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.3)"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="rgba(255,255,255,0.3)"
              fontSize={11}
              tickLine={false}
              label={{
                value: "mm",
                angle: -90,
                position: "insideLeft",
                style: { fill: "rgba(255,255,255,0.3)", fontSize: 10 },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="rgba(255,255,255,0.3)"
              fontSize={11}
              tickLine={false}
              domain={[0, 1]}
              label={{
                value: "Risk",
                angle: 90,
                position: "insideRight",
                style: { fill: "rgba(255,255,255,0.3)", fontSize: 10 },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15,23,42,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                backdropFilter: "blur(12px)",
                color: "#fff",
                fontSize: 12,
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="rainfall_mm"
              fill="url(#rainGradient)"
              stroke="#3b82f6"
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
              barSize={20}
              name="Rainfall (mm)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="risk_probability"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#riskGradient)"
              name="Risk Probability"
              dot={{ fill: "#ef4444", r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
