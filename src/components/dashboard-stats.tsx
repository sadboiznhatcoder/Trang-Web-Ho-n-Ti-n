"use client";

// =============================================================================
// Dashboard Stats - Light mode KPI cards
// =============================================================================

import { motion } from "framer-motion";
import { Link2, ShoppingBag, TrendingUp, DollarSign } from "lucide-react";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  color: string;
  bgColor: string;
}

function StatCard({ icon: Icon, label, value, change, color, bgColor }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {change && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
    </motion.div>
  );
}

interface DashboardStatsProps {
  totalLinks: number;
  totalOrders: number;
  totalEarnings: number;
  conversionRate: number;
}

export function DashboardStats({ totalLinks, totalOrders, totalEarnings, conversionRate }: DashboardStatsProps) {
  const formatVND = (n: number) =>
    n >= 1_000_000
      ? (n / 1_000_000).toFixed(1) + "M"
      : new Intl.NumberFormat("vi-VN").format(n);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Link2}
        label="Liên kết"
        value={totalLinks.toString()}
        color="text-blue-600"
        bgColor="bg-blue-50"
        change="+3"
      />
      <StatCard
        icon={ShoppingBag}
        label="Đơn hàng"
        value={totalOrders.toString()}
        color="text-amber-600"
        bgColor="bg-amber-50"
        change="+2"
      />
      <StatCard
        icon={DollarSign}
        label="Tổng hoàn tiền"
        value={formatVND(totalEarnings) + "đ"}
        color="text-emerald-600"
        bgColor="bg-emerald-50"
        change="+15%"
      />
      <StatCard
        icon={TrendingUp}
        label="Tỷ lệ chuyển đổi"
        value={conversionRate + "%"}
        color="text-purple-600"
        bgColor="bg-purple-50"
      />
    </div>
  );
}
