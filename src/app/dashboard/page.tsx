"use client";

// =============================================================================
// Dashboard Overview Page - Light mode
// =============================================================================

import { motion } from "framer-motion";
import { WalletCard } from "@/components/wallet-card";
import { DashboardStats } from "@/components/dashboard-stats";
import { EarningsChart } from "@/components/earnings-chart";
import { RecentActivity } from "@/components/recent-activity";
import {
  MOCK_CURRENT_USER,
  MOCK_LINKS,
  MOCK_ORDERS,
  MOCK_TRANSACTIONS,
  MOCK_EARNINGS_DATA,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const userLinks = MOCK_LINKS.filter((l) => l.user_id === MOCK_CURRENT_USER.id);
  const userOrders = MOCK_ORDERS.filter((o) => o.user_id === MOCK_CURRENT_USER.id);
  const userTxns = MOCK_TRANSACTIONS.filter((t) => t.user_id === MOCK_CURRENT_USER.id);
  const totalEarnings = userOrders.reduce((s, o) => s + o.user_commission, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground">
          Xin chào, {MOCK_CURRENT_USER.full_name}! 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tổng quan hoạt động của bạn
        </p>
      </motion.div>

      {/* Wallet + Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WalletCard profile={MOCK_CURRENT_USER} />
        </div>
        <div className="lg:col-span-2">
          <DashboardStats
            totalLinks={userLinks.length}
            totalOrders={userOrders.length}
            totalEarnings={totalEarnings}
            conversionRate={3.2}
          />
        </div>
      </div>

      {/* Chart + Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <EarningsChart data={MOCK_EARNINGS_DATA} />
        <RecentActivity transactions={userTxns} />
      </div>
    </div>
  );
}
