"use client";

// =============================================================================
// DashboardStats - Quick stat cards for the dashboard
// =============================================================================

import { motion } from "framer-motion";
import { Link2, ShoppingBag, MousePointerClick, TrendingUp } from "lucide-react";
import { MOCK_LINKS, MOCK_ORDERS } from "@/lib/mock-data";

function formatVND(amount: number): string {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M đ`;
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

const stats = [
    {
        label: "Tổng liên kết",
        value: MOCK_LINKS.length.toString(),
        icon: Link2,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
    },
    {
        label: "Tổng lượt click",
        value: MOCK_LINKS.reduce((s, l) => s + l.click_count, 0).toLocaleString(),
        icon: MousePointerClick,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
    },
    {
        label: "Đơn hàng",
        value: MOCK_ORDERS.length.toString(),
        icon: ShoppingBag,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
    },
    {
        label: "Tỷ lệ chuyển đổi",
        value: "4.2%",
        icon: TrendingUp,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
    },
];

export function DashboardStats() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-4 content-start"
        >
            {stats.map((stat, i) => (
                <div
                    key={stat.label}
                    className="bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all"
                >
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-zinc-400 text-sm mt-1">{stat.label}</p>
                </div>
            ))}
        </motion.div>
    );
}
