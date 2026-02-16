"use client";

// =============================================================================
// Recent Activity - Light mode transaction list
// =============================================================================

import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Gift,
} from "lucide-react";
import type { Transaction } from "@/types";
import { TransactionType } from "@/types";

const TYPE_CONFIG: Record<
  TransactionType,
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  [TransactionType.CASHBACK_APPROVED]: {
    label: "Hoàn tiền",
    icon: ArrowDownLeft,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  [TransactionType.CASHBACK_PENDING]: {
    label: "Chờ duyệt",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  [TransactionType.WITHDRAWAL_REQUEST]: {
    label: "Yêu cầu rút",
    icon: ArrowUpRight,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  [TransactionType.WITHDRAWAL_PAID]: {
    label: "Đã rút",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  [TransactionType.WITHDRAWAL_REJECTED]: {
    label: "Từ chối rút",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  [TransactionType.MANUAL_PAYOUT]: {
    label: "Thanh toán",
    icon: Gift,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  [TransactionType.BONUS]: {
    label: "Thưởng",
    icon: Gift,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
};

interface RecentActivityProps {
  transactions: Transaction[];
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  const formatVND = (n: number) =>
    (n >= 0 ? "+" : "") + new Intl.NumberFormat("vi-VN").format(n) + "đ";

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="text-base font-semibold text-foreground mb-4">
        Hoạt động gần đây
      </h3>
      <div className="space-y-3">
        {transactions.map((txn, i) => {
          const config = TYPE_CONFIG[txn.type];
          return (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-center gap-3 py-2"
            >
              <div
                className={`w-9 h-9 rounded-xl ${config.bgColor} flex items-center justify-center shrink-0`}
              >
                <config.icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {txn.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(txn.created_at)}
                </p>
              </div>
              <span
                className={`text-sm font-semibold ${
                  txn.amount >= 0 ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {formatVND(txn.amount)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
