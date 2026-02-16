"use client";

// =============================================================================
// Admin Users Page - Search, filter, data table with modal
// =============================================================================

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_ALL_PROFILES } from "@/lib/mock-data";
import { UserRole, UserStatus, type Profile } from "@/types";
import { UserDetailModal } from "@/components/admin/user-detail-modal";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | UserStatus>("ALL");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  const usersOnly = MOCK_ALL_PROFILES.filter((p) => p.role === UserRole.USER);

  const filtered = useMemo(() => {
    let list = usersOnly;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.full_name.toLowerCase().includes(q) ||
          p.phone.includes(q)
      );
    }
    if (statusFilter !== "ALL") {
      list = list.filter((p) => p.status === statusFilter);
    }
    return list;
  }, [search, statusFilter, usersOnly]);

  const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

  const formatDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Quản lý người dùng</h1>
        <p className="text-zinc-400 text-sm mt-1">
          {usersOnly.length} người dùng • {usersOnly.filter((u) => u.status === UserStatus.ACTIVE).length} đang hoạt động
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc số điện thoại..."
            className="h-11 rounded-xl pl-10 bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-emerald-500/50"
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", UserStatus.ACTIVE, UserStatus.BANNED] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                statusFilter === status
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {status === "ALL" ? "Tất cả" : status === UserStatus.ACTIVE ? "Hoạt động" : "Bị cấm"}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider">
          <span>Người dùng</span>
          <span>Số dư</span>
          <span>Trạng thái</span>
          <span>Lần đăng nhập cuối</span>
          <span>Ngày tạo</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-zinc-500">
            <Users className="w-10 h-10" />
            <p className="text-sm">Không tìm thấy người dùng</p>
          </div>
        ) : (
          filtered.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.03 * i }}
              onClick={() => setSelectedUser(user)}
              className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 md:gap-4 px-6 py-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer transition-colors"
            >
              {/* User info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-emerald-400 font-semibold text-sm shrink-0">
                  {user.full_name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.full_name}</p>
                  <p className="text-xs text-zinc-500 font-mono">{user.phone}</p>
                </div>
              </div>

              {/* Balance */}
              <div className="flex items-center md:block">
                <span className="text-xs text-zinc-500 md:hidden mr-2">Số dư:</span>
                <div>
                  <p className="text-sm font-semibold text-emerald-400">{formatVND(user.balance_available)}</p>
                  <p className="text-xs text-zinc-500">Chờ: {formatVND(user.balance_pending)}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <Badge
                  className={
                    user.status === UserStatus.ACTIVE
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }
                >
                  {user.status === UserStatus.ACTIVE ? "Hoạt động" : "Bị cấm"}
                </Badge>
              </div>

              {/* Last login */}
              <div className="flex items-center">
                <span className="text-xs text-zinc-400">{formatDate(user.last_login)}</span>
              </div>

              {/* Created */}
              <div className="flex items-center">
                <span className="text-xs text-zinc-400">{formatDate(user.created_at)}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
