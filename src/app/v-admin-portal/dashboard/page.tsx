"use client";

// =============================================================================
// Admin Dashboard Overview - KPI cards
// =============================================================================

import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MOCK_ADMIN_KPIS } from "@/lib/mock-data";

const formatVND = (n: number) => {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + " tỷ";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  return new Intl.NumberFormat("vi-VN").format(n);
};

export default function AdminOverview() {
  const kpi = MOCK_ADMIN_KPIS;

  const cards = [
    {
      label: "Tổng người dùng",
      value: kpi.totalUsers.toString(),
      sub: `${kpi.activeUsers} đang hoạt động`,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Tổng GMV",
      value: formatVND(kpi.totalGMV) + "đ",
      sub: "Tổng giá trị giao dịch",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Đã thanh toán",
      value: formatVND(kpi.totalPayouts) + "đ",
      sub: "Tổng tiền đã rút",
      icon: DollarSign,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      label: "Chờ xử lý",
      value: kpi.pendingWithdrawals.toString(),
      sub: "Yêu cầu rút tiền",
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tổng quan</h1>
        <p className="text-zinc-400 text-sm mt-1">Bảng điều khiển quản trị</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-zinc-400 mt-0.5">{card.label}</p>
            <p className="text-xs text-zinc-500 mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/v-admin-portal/dashboard/users"
          className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-emerald-500/30 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-white">Quản lý người dùng</p>
              <p className="text-xs text-zinc-500">Xem, cấm, sửa thông tin</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
        </Link>
        <Link
          href="/v-admin-portal/dashboard/withdrawals"
          className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-emerald-500/30 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-sm font-medium text-white">Quản lý rút tiền</p>
              <p className="text-xs text-zinc-500">Duyệt, từ chối yêu cầu</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
