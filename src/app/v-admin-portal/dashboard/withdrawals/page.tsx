"use client";

// =============================================================================
// Admin Withdrawals Page
// =============================================================================

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  DollarSign,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_ALL_WITHDRAWALS, MOCK_ALL_PROFILES } from "@/lib/mock-data";
import { WithdrawalStatus } from "@/types";

const STATUS_CONFIG = {
  [WithdrawalStatus.PENDING]: { label: "Chờ duyệt", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  [WithdrawalStatus.PROCESSING]: { label: "Đang xử lý", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  [WithdrawalStatus.COMPLETED]: { label: "Thành công", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  [WithdrawalStatus.REJECTED]: { label: "Từ chối", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

export default function AdminWithdrawalsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | WithdrawalStatus>("ALL");

  const enriched = useMemo(() => {
    return MOCK_ALL_WITHDRAWALS.map((wd) => {
      const profile = MOCK_ALL_PROFILES.find((p) => p.id === wd.user_id);
      return { ...wd, userName: profile?.full_name || "Unknown", userPhone: profile?.phone || "" };
    });
  }, []);

  const filtered = useMemo(() => {
    let list = enriched;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (wd) => wd.userName.toLowerCase().includes(q) || wd.userPhone.includes(q)
      );
    }
    if (statusFilter !== "ALL") {
      list = list.filter((wd) => wd.status === statusFilter);
    }
    return list;
  }, [search, statusFilter, enriched]);

  const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Quản lý rút tiền</h1>
        <p className="text-zinc-400 text-sm mt-1">
          {MOCK_ALL_WITHDRAWALS.length} yêu cầu •{" "}
          {MOCK_ALL_WITHDRAWALS.filter((w) => w.status === WithdrawalStatus.PENDING).length} chờ duyệt
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc SĐT..."
            className="h-11 rounded-xl pl-10 bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-emerald-500/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["ALL", WithdrawalStatus.PENDING, WithdrawalStatus.PROCESSING, WithdrawalStatus.COMPLETED, WithdrawalStatus.REJECTED] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                statusFilter === s
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {s === "ALL" ? "Tất cả" : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Withdrawal list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl py-16 text-center">
            <DollarSign className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm text-zinc-500">Không có yêu cầu rút tiền</p>
          </div>
        ) : (
          filtered.map((wd, i) => {
            const config = STATUS_CONFIG[wd.status];
            return (
              <motion.div
                key={wd.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * i }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-semibold text-sm shrink-0">
                      {wd.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{wd.userName}</p>
                      <p className="text-xs text-zinc-500 font-mono">{wd.userPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{formatVND(wd.amount)}</p>
                      <p className="text-xs text-zinc-500">
                        {wd.bank_info.bank_name} • {wd.bank_info.account_number}
                      </p>
                    </div>
                    <Badge className={`${config.bg} ${config.color} border`}>
                      {config.label}
                    </Badge>
                  </div>
                </div>

                {/* Admin actions for pending */}
                {wd.status === WithdrawalStatus.PENDING && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800">
                    <Button
                      size="sm"
                      className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                      Duyệt
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-xs"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1.5" />
                      Từ chối
                    </Button>
                  </div>
                )}

                <p className="text-[10px] text-zinc-600 mt-3">
                  {new Date(wd.created_at).toLocaleString("vi-VN")}
                </p>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
