"use client";

// =============================================================================
// EarningsChart - Line chart showing earnings history over last 30 days
// =============================================================================

import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { MOCK_EARNINGS_CHART } from "@/lib/mock-data";

/** Format currency for tooltip */
function formatVND(value: number): string {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M đ`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K đ`;
    return `${value}đ`;
}

/** Custom tooltip component */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-zinc-800/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-xl">
            <p className="text-zinc-400 text-xs mb-1">{label}</p>
            <p className="text-emerald-400 font-bold text-lg">
                {formatVND(payload[0].value)}
            </p>
        </div>
    );
}

export function EarningsChart() {
    const data = MOCK_EARNINGS_CHART;

    // Calculate total and trend
    const total = data.reduce((sum, d) => sum + d.amount, 0);
    const recentAvg =
        data.slice(-7).reduce((sum, d) => sum + d.amount, 0) / 7;
    const olderAvg =
        data.slice(0, 7).reduce((sum, d) => sum + d.amount, 0) / 7;
    const trend = ((recentAvg - olderAvg) / olderAvg) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-white font-semibold text-lg">Lịch sử thu nhập</h3>
                    <p className="text-zinc-400 text-sm">30 ngày gần nhất</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    {trend > 0 ? "+" : ""}
                    {trend.toFixed(1)}%
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                        <defs>
                            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.05)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
                            tickFormatter={(v) => {
                                const d = new Date(v);
                                return `${d.getDate()}/${d.getMonth() + 1}`;
                            }}
                            interval={6}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
                            tickFormatter={(v) => formatVND(v)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            fill="url(#earningsGradient)"
                            dot={false}
                            activeDot={{
                                r: 6,
                                fill: "#10b981",
                                stroke: "#fff",
                                strokeWidth: 2,
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-zinc-400 text-sm">Tổng thu nhập (30 ngày)</span>
                <span className="text-white font-bold text-lg">{formatVND(total)}</span>
            </div>
        </motion.div>
    );
}
