"use client";

// =============================================================================
// User Detail Modal - Admin actions: Ban, Change Password, Edit, Payout
// =============================================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Phone,
  Calendar,
  DollarSign,
  Ban,
  Key,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  ShieldOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Profile } from "@/types";
import { UserStatus } from "@/types";
import {
  processManualPayout,
  toggleUserBan,
  changeUserPassword,
  updateUserInfo,
} from "@/actions/admin-payout";
import { MOCK_LINKS, MOCK_ORDERS } from "@/lib/mock-data";

interface UserDetailModalProps {
  user: Profile;
  onClose: () => void;
}

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Payout state
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutNote, setPayoutNote] = useState("");

  // Password state
  const [newPassword, setNewPassword] = useState("");

  // Edit state
  const [editName, setEditName] = useState(user.full_name);
  const [editPhone, setEditPhone] = useState(user.phone);

  const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // ─── Ban/Unban ───
  const handleToggleBan = async () => {
    setLoading(true);
    const result = await toggleUserBan(user.id);
    if (result.success) {
      showMsg("success", user.status === UserStatus.ACTIVE ? "Đã cấm người dùng" : "Đã bỏ cấm người dùng");
    } else {
      showMsg("error", result.error || "Lỗi");
    }
    setLoading(false);
  };

  // ─── Change Password ───
  const handleChangePassword = async () => {
    if (!newPassword) return;
    setLoading(true);
    const result = await changeUserPassword(user.id, newPassword);
    if (result.success) {
      showMsg("success", "Đã đổi mật khẩu thành công");
      setNewPassword("");
    } else {
      showMsg("error", result.error || "Lỗi");
    }
    setLoading(false);
  };

  // ─── Edit Info ───
  const handleEditInfo = async () => {
    setLoading(true);
    const result = await updateUserInfo(user.id, { full_name: editName, phone: editPhone });
    if (result.success) {
      showMsg("success", "Đã cập nhật thông tin");
    } else {
      showMsg("error", result.error || "Lỗi");
    }
    setLoading(false);
  };

  // ─── Manual Payout ───
  const handlePayout = async () => {
    const amount = Number(payoutAmount);
    if (!amount || amount <= 0) return;
    setLoading(true);
    const result = await processManualPayout({ userId: user.id, amount, note: payoutNote });
    if (result.success) {
      showMsg("success", `Đã thanh toán ${formatVND(amount)}`);
      setPayoutAmount("");
      setPayoutNote("");
    } else {
      showMsg("error", result.error || "Lỗi");
    }
    setLoading(false);
  };

  const userLinks = MOCK_LINKS.filter((l) => l.user_id === user.id);
  const userOrders = MOCK_ORDERS.filter((o) => o.user_id === user.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 py-4 z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
                {user.full_name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{user.full_name}</h2>
                <p className="text-xs text-zinc-500 font-mono">{user.phone}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message toast */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mx-6 mt-4 flex items-center gap-2 rounded-xl px-4 py-3 ${
                  message.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
            <TabsList className="bg-zinc-800/50 border border-zinc-800 rounded-xl p-1 w-full grid grid-cols-4 gap-1">
              <TabsTrigger value="info" className="rounded-lg text-xs data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
                Thông tin
              </TabsTrigger>
              <TabsTrigger value="actions" className="rounded-lg text-xs data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
                Thao tác
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-lg text-xs data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
                Đơn hàng
              </TabsTrigger>
              <TabsTrigger value="links" className="rounded-lg text-xs data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
                Liên kết
              </TabsTrigger>
            </TabsList>

            {/* ─── Info Tab ─── */}
            <TabsContent value="info" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Trạng thái", value: user.status === UserStatus.ACTIVE ? "Hoạt động" : "Bị cấm", icon: User },
                  { label: "Số dư khả dụng", value: formatVND(user.balance_available), icon: DollarSign },
                  { label: "Số dư chờ", value: formatVND(user.balance_pending), icon: DollarSign },
                  { label: "Điện thoại", value: user.phone, icon: Phone },
                  { label: "Ngày tạo", value: new Date(user.created_at).toLocaleDateString("vi-VN"), icon: Calendar },
                  { label: "Đăng nhập cuối", value: user.last_login ? new Date(user.last_login).toLocaleDateString("vi-VN") : "—", icon: Calendar },
                ].map((item) => (
                  <div key={item.label} className="bg-zinc-800/50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-0.5">
                      <item.icon className="w-3 h-3" />
                      {item.label}
                    </div>
                    <p className="text-sm font-medium text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ─── Actions Tab ─── */}
            <TabsContent value="actions" className="mt-4 space-y-5">
              {/* Ban/Unban */}
              <div className="bg-zinc-800/50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  {user.status === UserStatus.ACTIVE ? (
                    <><Ban className="w-4 h-4 text-red-400" /> Cấm người dùng</>
                  ) : (
                    <><ShieldOff className="w-4 h-4 text-emerald-400" /> Bỏ cấm người dùng</>
                  )}
                </h4>
                <p className="text-xs text-zinc-400 mb-3">
                  {user.status === UserStatus.ACTIVE
                    ? "Người dùng sẽ không thể đăng nhập sau khi bị cấm."
                    : "Cho phép người dùng đăng nhập trở lại."}
                </p>
                <Button
                  onClick={handleToggleBan}
                  disabled={loading}
                  size="sm"
                  className={
                    user.status === UserStatus.ACTIVE
                      ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                      : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                  }
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : user.status === UserStatus.ACTIVE ? "Cấm" : "Bỏ cấm"}
                </Button>
              </div>

              {/* Change Password */}
              <div className="bg-zinc-800/50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Key className="w-4 h-4 text-amber-400" /> Đổi mật khẩu
                </h4>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
                    className="h-10 rounded-xl bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500"
                  />
                  <Button
                    onClick={handleChangePassword}
                    disabled={loading || !newPassword}
                    size="sm"
                    className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 shrink-0"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Đổi"}
                  </Button>
                </div>
              </div>

              {/* Edit Info */}
              <div className="bg-zinc-800/50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Edit3 className="w-4 h-4 text-blue-400" /> Sửa thông tin
                </h4>
                <div className="space-y-2 mb-3">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Họ tên"
                    className="h-10 rounded-xl bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500"
                  />
                  <Input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Số điện thoại"
                    className="h-10 rounded-xl bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500 font-mono"
                    maxLength={10}
                  />
                </div>
                <Button
                  onClick={handleEditInfo}
                  disabled={loading}
                  size="sm"
                  className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu thay đổi"}
                </Button>
              </div>

              {/* Manual Payout */}
              <div className="bg-zinc-800/50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Thanh toán thủ công
                </h4>
                <p className="text-xs text-zinc-400 mb-3">
                  Trừ số dư và tạo giao dịch rút tiền cho người dùng.
                </p>
                <div className="space-y-2 mb-3">
                  <Input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="Số tiền (VNĐ)"
                    className="h-10 rounded-xl bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500"
                  />
                  <Input
                    value={payoutNote}
                    onChange={(e) => setPayoutNote(e.target.value)}
                    placeholder="Ghi chú (tùy chọn)"
                    className="h-10 rounded-xl bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500"
                  />
                </div>
                <Button
                  onClick={handlePayout}
                  disabled={loading || !payoutAmount}
                  size="sm"
                  className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Thanh toán"}
                </Button>
              </div>
            </TabsContent>

            {/* ─── Orders Tab ─── */}
            <TabsContent value="orders" className="mt-4">
              {userOrders.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-8">Chưa có đơn hàng</p>
              ) : (
                <div className="space-y-2">
                  {userOrders.map((order) => (
                    <div key={order.id} className="bg-zinc-800/50 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{order.platform} • #{order.external_order_id}</p>
                        <p className="text-xs text-zinc-500">GMV: {formatVND(order.gmv)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-400">{formatVND(order.user_commission)}</p>
                        <Badge
                          className={
                            order.status === "PAID" ? "bg-emerald-500/10 text-emerald-400" :
                            order.status === "APPROVED" ? "bg-blue-500/10 text-blue-400" :
                            order.status === "REJECTED" ? "bg-red-500/10 text-red-400" :
                            "bg-amber-500/10 text-amber-400"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ─── Links Tab ─── */}
            <TabsContent value="links" className="mt-4">
              {userLinks.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-8">Chưa có liên kết</p>
              ) : (
                <div className="space-y-2">
                  {userLinks.map((link) => (
                    <div key={link.id} className="bg-zinc-800/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <Badge className="bg-zinc-700 text-zinc-300">{link.platform}</Badge>
                        <span className="text-xs text-zinc-500">{link.click_count} clicks</span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate">{link.original_url}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
