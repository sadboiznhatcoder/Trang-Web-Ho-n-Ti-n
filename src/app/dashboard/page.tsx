// =============================================================================
// Dashboard Overview - Wallet, chart, quick stats, recent activity
// =============================================================================

import { WalletCard } from "@/components/wallet-card";
import { EarningsChart } from "@/components/earnings-chart";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentActivity } from "@/components/recent-activity";
import { LinkInput } from "@/components/link-input";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Chào mừng trở lại, <span className="text-emerald-400">Minh</span> 👋
                </h1>
                <p className="text-zinc-400 mt-1">
                    Tổng quan hoàn tiền của bạn hôm nay.
                </p>
            </div>

            {/* Quick link converter */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-4">Chuyển đổi nhanh</h2>
                <LinkInput />
            </div>

            {/* Wallet + Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WalletCard />
                <DashboardStats />
            </div>

            {/* Chart */}
            <EarningsChart />

            {/* Recent activity */}
            <RecentActivity />
        </div>
    );
}
