"use client";

// =============================================================================
// User Detail Modal - Comprehensive user view with admin actions
// Shows user info, click history, orders, and manual payout
// =============================================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    User,
    MousePointer2,
    ShoppingBag,
    Wallet,
    Loader2,
    Check,
    AlertCircle,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_LINKS, MOCK_ORDERS, MOCK_WALLET } from "@/lib/mock-data";
import { processManualPayout } from "@/actions/admin-payout";
import type { User as UserType } from "@/types";
import { Platform, OrderStatus } from "@/types";

interface UserDetailModalProps {
    user: UserType;
    onClose: () => void;
}

function formatVND(amount: number): string {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

const TABS = [
    { id: "info", label: "Thông tin", icon: User },
    { id: "clicks", label: "Lịch sử click", icon: MousePointer2 },
    { id: "orders", label: "Đơn hàng", icon: ShoppingBag },
    { id: "payout", label: "Thao tác Admin", icon: Wallet },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PLATFORM_COLORS: Record<Platform, string> = {
    [Platform.SHOPEE]: "text-orange-400 bg-orange-500/10",
    [Platform.LAZADA]: "text-blue-400 bg-blue-500/10",
    [Platform.TIKTOK]: "text-pink-400 bg-pink-500/10",
    [Platform.TIKI]: "text-cyan-400 bg-cyan-500/10",
};

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    [OrderStatus.APPROVED]: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    [OrderStatus.PAID]: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    [OrderStatus.REJECTED]: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
    const [activeTab, setActiveTab] = useState<TabId>("info");
    const [payoutAmount, setPayoutAmount] = useState("");
    const [payoutNote, setPayoutNote] = useState("");
    const [payoutLoading, setPayoutLoading] = useState(false);
    const [payoutResult, setPayoutResult] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    // Mock: filter data for this user
    const userLinks = MOCK_LINKS.filter((l) => l.user_id === user.id);
    const userOrders = MOCK_ORDERS.filter((o) => o.user_id === user.id);
    const userWallet = MOCK_WALLET; // In production, fetch wallet by user.id

    const handlePayout = async () => {
        const amount = parseInt(payoutAmount);
        if (!amount || amount <= 0) return;

        setPayoutLoading(true);
        setPayoutResult(null);

        const result = await processManualPayout(user.id, amount, payoutNote);

        if (result.success) {
            setPayoutResult({
                success: true,
                message: `Thanh toán ${formatVND(amount)} thành công! Mã: ${result.data?.transaction_id}`,
            });
            setPayoutAmount("");
            setPayoutNote("");
        } else {
            setPayoutResult({
                success: false,
                message: result.error || "Lỗi",
            });
        }

        setPayoutLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-hidden bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-white font-medium">
                            {user.full_name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-white font-semibold">{user.full_name}</h2>
                            <p className="text-zinc-500 text-xs">{user.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5 px-4 overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id
                                    ? "text-purple-400 border-purple-400"
                                    : "text-zinc-500 border-transparent hover:text-zinc-300"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[60vh] p-6">
                    {/* ─── Info Tab ─── */}
                    {activeTab === "info" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/[0.02] rounded-xl p-4">
                                    <p className="text-zinc-500 text-xs mb-1">Vai trò</p>
                                    <p className="text-white font-medium">{user.role}</p>
                                </div>
                                <div className="bg-white/[0.02] rounded-xl p-4">
                                    <p className="text-zinc-500 text-xs mb-1">Cấp</p>
                                    <p className="text-amber-400 font-medium">⭐ {user.tier_level}</p>
                                </div>
                                <div className="bg-white/[0.02] rounded-xl p-4">
                                    <p className="text-zinc-500 text-xs mb-1">Mã giới thiệu</p>
                                    <p className="text-cyan-400 font-mono text-sm">{user.referral_code}</p>
                                </div>
                                <div className="bg-white/[0.02] rounded-xl p-4">
                                    <p className="text-zinc-500 text-xs mb-1">Trạng thái</p>
                                    <p className={user.is_banned ? "text-red-400" : "text-emerald-400"}>
                                        {user.is_banned ? "Đã cấm" : "Hoạt động"}
                                    </p>
                                </div>
                                <div className="bg-white/[0.02] rounded-xl p-4">
                                    <p className="text-zinc-500 text-xs mb-1">Ngày tham gia</p>
                                    <p className="text-white text-sm">
                                        {new Date(user.created_at).toLocaleDateString("vi-VN")}
                                    </p>
                                </div>
                                <div className="bg-white/[0.02] rounded-xl p-4">
                                    <p className="text-zinc-500 text-xs mb-1">Số dư khả dụng</p>
                                    <p className="text-emerald-400 font-bold">
                                        {formatVND(userWallet.available_balance)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── Clicks Tab ─── */}
                    {activeTab === "clicks" && (
                        <div className="space-y-3">
                            {userLinks.length === 0 ? (
                                <p className="text-zinc-500 text-center py-8">Chưa có lịch sử click</p>
                            ) : (
                                userLinks.map((link) => (
                                    <div
                                        key={link.id}
                                        className="bg-white/[0.02] rounded-xl p-4 flex items-center gap-4"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${PLATFORM_COLORS[link.platform]
                                                }`}
                                        >
                                            {link.platform.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium truncate">
                                                {link.original_url}
                                            </p>
                                            <p className="text-zinc-500 text-xs">
                                                Mã: {link.short_code} •{" "}
                                                {new Date(link.created_at).toLocaleDateString("vi-VN")}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-emerald-400 font-bold text-lg">
                                                {link.click_count}
                                            </p>
                                            <p className="text-zinc-500 text-xs">clicks</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ─── Orders Tab ─── */}
                    {activeTab === "orders" && (
                        <div className="space-y-3">
                            {userOrders.length === 0 ? (
                                <p className="text-zinc-500 text-center py-8">Chưa có đơn hàng</p>
                            ) : (
                                userOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-white/[0.02] rounded-xl p-4"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className={PLATFORM_COLORS[order.platform]}
                                                >
                                                    {order.platform}
                                                </Badge>
                                                <span className="text-zinc-500 text-xs font-mono">
                                                    #{order.external_order_id}
                                                </span>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={ORDER_STATUS_COLORS[order.status]}
                                            >
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 mt-3">
                                            <div>
                                                <p className="text-zinc-500 text-xs">GMV</p>
                                                <p className="text-white text-sm font-medium">
                                                    {formatVND(order.gmv)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-500 text-xs">Hoa hồng</p>
                                                <p className="text-emerald-400 text-sm font-medium">
                                                    {formatVND(order.user_commission)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-500 text-xs">Ngày tạo</p>
                                                <p className="text-zinc-300 text-sm">
                                                    {new Date(order.created_at).toLocaleDateString(
                                                        "vi-VN"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ─── Admin Payout Tab ─── */}
                    {activeTab === "payout" && (
                        <div className="space-y-6">
                            {/* Wallet info */}
                            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-5">
                                <p className="text-zinc-400 text-sm mb-1">Số dư hiện tại của người dùng</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    {formatVND(userWallet.available_balance)}
                                </p>
                            </div>

                            {/* Manual Payout Form */}
                            <div className="space-y-4">
                                <h4 className="text-white font-semibold flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-purple-400" />
                                    Thanh toán thủ công
                                </h4>
                                <p className="text-zinc-500 text-sm">
                                    Trừ số tiền từ ví người dùng và tạo giao dịch rút tiền.
                                </p>

                                <div>
                                    <label className="text-xs text-zinc-500 mb-1.5 block">
                                        Số tiền trừ (VNĐ)
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="Ví dụ: 100000"
                                        value={payoutAmount}
                                        onChange={(e) => setPayoutAmount(e.target.value)}
                                        className="bg-zinc-800/50 border-white/10 text-white h-11 rounded-xl"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-zinc-500 mb-1.5 block">
                                        Ghi chú giao dịch
                                    </label>
                                    <Input
                                        placeholder="Ví dụ: Thanh toán thủ công cho đơn hàng #..."
                                        value={payoutNote}
                                        onChange={(e) => setPayoutNote(e.target.value)}
                                        className="bg-zinc-800/50 border-white/10 text-white h-11 rounded-xl"
                                    />
                                </div>

                                <Button
                                    onClick={handlePayout}
                                    disabled={
                                        payoutLoading ||
                                        !payoutAmount ||
                                        parseInt(payoutAmount) <= 0 ||
                                        !payoutNote.trim()
                                    }
                                    className="w-full h-11 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold rounded-xl"
                                >
                                    {payoutLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    ) : (
                                        <Wallet className="w-4 h-4 mr-2" />
                                    )}
                                    Xác nhận thanh toán
                                </Button>

                                {/* Result */}
                                {payoutResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-xl flex items-start gap-3 ${payoutResult.success
                                                ? "bg-emerald-500/10 border border-emerald-500/20"
                                                : "bg-red-500/10 border border-red-500/20"
                                            }`}
                                    >
                                        {payoutResult.success ? (
                                            <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                        )}
                                        <p
                                            className={`text-sm ${payoutResult.success
                                                    ? "text-emerald-300"
                                                    : "text-red-300"
                                                }`}
                                        >
                                            {payoutResult.message}
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
