"use client";

// =============================================================================
// WalletCard - Credit-card style wallet display with balance toggle
// =============================================================================

import { motion } from "framer-motion";
import { Eye, EyeOff, TrendingUp, Clock, Wallet } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { MOCK_WALLET } from "@/lib/mock-data";

/** Format VNĐ currency */
function formatVND(amount: number): string {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export function WalletCard() {
    const { balanceVisible, toggleBalanceVisibility } = useAppStore();
    const wallet = MOCK_WALLET;

    const hiddenValue = "••••••••";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl p-[1px]"
        >
            {/* Gradient border */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-cyan-500 to-purple-600 opacity-80" />

            <div className="relative bg-zinc-900/95 backdrop-blur-xl rounded-3xl p-6 md:p-8">
                {/* Card header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-emerald-400" />
                        <span className="text-zinc-400 text-sm font-medium">Ví của tôi</span>
                    </div>
                    <button
                        onClick={toggleBalanceVisibility}
                        className="text-zinc-400 hover:text-white transition-colors p-1"
                        aria-label="Toggle balance visibility"
                    >
                        {balanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                </div>

                {/* Main balance */}
                <div className="mb-6">
                    <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Số dư khả dụng</p>
                    <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        {balanceVisible ? formatVND(wallet.available_balance) : hiddenValue}
                    </p>
                </div>

                {/* Sub-balances */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <span className="text-zinc-400 text-xs">Đang chờ</span>
                        </div>
                        <p className="text-white font-semibold text-lg">
                            {balanceVisible ? formatVND(wallet.pending_balance) : hiddenValue}
                        </p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-zinc-400 text-xs">Tổng cộng</span>
                        </div>
                        <p className="text-white font-semibold text-lg">
                            {balanceVisible ? formatVND(wallet.lifetime_earnings) : hiddenValue}
                        </p>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-2xl" />
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
            </div>
        </motion.div>
    );
}
