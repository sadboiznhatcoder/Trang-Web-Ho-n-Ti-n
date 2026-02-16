"use client";

// =============================================================================
// Earnings Chart - Light mode
// =============================================================================

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import type { EarningsDataPoint } from "@/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EarningsChartProps {
  data: EarningsDataPoint[];
}

export function EarningsChart({ data }: EarningsChartProps) {
  const total = data.reduce((s, d) => s + d.earnings, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Thu nhập</h3>
          <p className="text-sm text-muted-foreground">14 ngày qua</p>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          <TrendingUp className="w-4 h-4" />
          {new Intl.NumberFormat("vi-VN").format(total)}đ
        </div>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickFormatter={(v) => (v / 1000).toFixed(0) + "K"}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ color: "#374151", fontWeight: 600, fontSize: 12 }}
              formatter={(value: number | undefined) => [
                new Intl.NumberFormat("vi-VN").format(value ?? 0) + "đ",
                "Thu nhập",
              ]}
            />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="#059669"
              strokeWidth={2}
              fill="url(#earningsGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
