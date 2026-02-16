"use client";

// =============================================================================
// RecentActivity - Latest transactions list
// =============================================================================

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { TransactionType } from "@/types";

function formatVND(amount: number): string {
    return new Intl.NumberFormat("vi-VN").format(Math.abs(amount)) + "đ";
}

function getTransactionMeta(type: TransactionType) {
    switch (type) {
        case TransactionType.CASHBACK_APPROVED:
            return { label: "Hoàn tiền đã duyệt", color: "text-emerald-400", icon: ArrowUpRight, bg: "bg-emerald-500/10" };
        case TransactionType.CASHBACK_PENDING:
            return { label: "Hoàn tiền đang chờ", color: "text-amber-400", icon: Clock, bg: "bg-amber-500/10" };
        case TransactionType.WITHDRAWAL_PAID:
            return { label: "Rút tiền", color: "text-red-400", icon: ArrowDownRight, bg: "bg-red-500/10" };
        case TransactionType.WITHDRAWAL_REQUEST:
            return { label: "Yêu cầu rút tiền", color: "text-orange-400", icon: ArrowDownRight, bg: "bg-orange-500/10" };
        default:
            return { label: type, color: "text-zinc-400", icon: Clock, bg: "bg-zinc-500/10" };
    }
}

export function RecentActivity() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
        >
            <h3 className="text-white font-semibold text-lg mb-4">Hoạt động gần đây</h3>

            <div className="space-y-3">
                {MOCK_TRANSACTIONS.map((txn) => {
                    const meta = getTransactionMeta(txn.type);
                    const isPositive = txn.amount > 0;

                    return (
                        <div
                            key={txn.id}
                            className="flex items-center gap-4 bg-white/[0.02] rounded-xl px-4 py-3 hover:bg-white/[0.05] transition-colors"
                        >
                            <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}>
                                <meta.icon className={`w-5 h-5 ${meta.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium">{meta.label}</p>
                                <p className="text-zinc-500 text-xs truncate">
                                    {txn.description}
                                </p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className={`font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                                    {isPositive ? "+" : "-"}{formatVND(txn.amount)}
                                </p>
                                <p className="text-zinc-500 text-xs">
                                    {new Date(txn.created_at).toLocaleDateString("vi-VN")}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
