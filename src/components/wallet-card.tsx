"use client";

// =============================================================================
// Wallet Card - Light mode with balance display
// =============================================================================

import { motion } from "framer-motion";
import { Wallet, TrendingUp, ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Profile } from "@/types";

interface WalletCardProps {
  profile: Profile;
}

export function WalletCard({ profile }: WalletCardProps) {
  const formatVND = (n: number) =>
    new Intl.NumberFormat("vi-VN").format(n) + "đ";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-600/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-200" />
          <span className="text-emerald-100 text-sm font-medium">Ví của bạn</span>
        </div>
        <Link href="/dashboard/withdraw">
          <Button
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white text-xs rounded-xl border border-white/20"
          >
            <ArrowDownToLine className="w-3.5 h-3.5 mr-1.5" />
            Rút tiền
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-emerald-100 text-xs mb-0.5">Số dư khả dụng</p>
          <p className="text-3xl font-bold tracking-tight">
            {formatVND(profile.balance_available)}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
          <TrendingUp className="w-4 h-4 text-emerald-200" />
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-100 text-xs">Chờ duyệt:</span>
            <span className="text-white text-sm font-semibold">
              {formatVND(profile.balance_pending)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
