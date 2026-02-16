"use client";

// =============================================================================
// Admin Overview - KPI cards and quick stats
// Route: /v-admin-portal/dashboard
// =============================================================================

import { motion } from "framer-motion";
import {
    DollarSign,
    Users,
    ShoppingBag,
    ArrowDownToLine,
    TrendingUp,
    BarChart3,
} from "lucide-react";
import { MOCK_ADMIN_KPIS } from "@/lib/mock-data";

function formatVND(amount: number): string {
    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}B đ`;
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M đ`;
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

const kpiCards = [
    {
        label: "Tổng GMV",
        value: formatVND(MOCK_ADMIN_KPIS.totalGMV),
        icon: DollarSign,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        gradient: "from-emerald-500/20 to-teal-500/20",
        change: "+12.5%",
    },
    {
        label: "Tổng chi trả",
        value: formatVND(MOCK_ADMIN_KPIS.totalPayouts),
        icon: ArrowDownToLine,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        gradient: "from-cyan-500/20 to-blue-500/20",
        change: "+8.3%",
    },
    {
        label: "Người dùng hoạt động",
        value: MOCK_ADMIN_KPIS.activeUsers.toLocaleString(),
        icon: Users,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        gradient: "from-purple-500/20 to-pink-500/20",
        change: "+5.2%",
    },
    {
        label: "Tổng đơn hàng",
        value: MOCK_ADMIN_KPIS.totalOrders.toLocaleString(),
        icon: ShoppingBag,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        gradient: "from-amber-500/20 to-orange-500/20",
        change: "+15.1%",
    },
    {
        label: "Tỷ lệ chuyển đổi",
        value: `${MOCK_ADMIN_KPIS.conversionRate}%`,
        icon: TrendingUp,
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        gradient: "from-rose-500/20 to-red-500/20",
        change: "+0.3%",
    },
    {
        label: "Rút tiền chờ duyệt",
        value: MOCK_ADMIN_KPIS.pendingWithdrawals.toString(),
        icon: BarChart3,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        gradient: "from-blue-500/20 to-indigo-500/20",
        change: "",
    },
];

export default function AdminPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Bảng điều khiển quản trị
                </h1>
                <p className="text-zinc-400 mt-1">
                    Tổng quan nền tảng và các chỉ số hiệu suất chính.
                </p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpiCards.map((kpi, index) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        className="group relative bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all overflow-hidden"
                    >
                        {/* Hover glow */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                        />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                                </div>
                                {kpi.change && (
                                    <span className="text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded-full">
                                        {kpi.change}
                                    </span>
                                )}
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{kpi.value}</p>
                            <p className="text-zinc-400 text-sm">{kpi.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.a
                    href="/v-admin-portal/dashboard/users"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-purple-500/20 hover:bg-purple-500/5 transition-all group"
                >
                    <Users className="w-8 h-8 text-purple-400 mb-3" />
                    <h3 className="text-white font-semibold text-lg">Quản lý người dùng</h3>
                    <p className="text-zinc-400 text-sm mt-1">
                        Xem, quản lý và kiểm duyệt tài khoản người dùng.
                    </p>
                </motion.a>
                <motion.a
                    href="/v-admin-portal/dashboard/withdrawals"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all group"
                >
                    <ArrowDownToLine className="w-8 h-8 text-cyan-400 mb-3" />
                    <h3 className="text-white font-semibold text-lg">Quản lý rút tiền</h3>
                    <p className="text-zinc-400 text-sm mt-1">
                        Duyệt hoặc từ chối yêu cầu rút tiền đang chờ.
                    </p>
                </motion.a>
            </div>
        </div>
    );
}
