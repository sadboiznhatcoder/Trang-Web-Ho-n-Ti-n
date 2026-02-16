"use client";

// =============================================================================
// Admin Withdrawals Page - Approve/reject pending withdrawal requests
// Route: /v-admin-portal/dashboard/withdrawals
// =============================================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check,
    X,
    Clock,
    Loader2,
    CheckCircle2,
    XCircle,
    MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { MOCK_ALL_WITHDRAWALS, MOCK_ALL_USERS } from "@/lib/mock-data";
import { WithdrawalStatus, type Withdrawal } from "@/types";

function formatVND(amount: number): string {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

const STATUS_CONFIG: Record<
    WithdrawalStatus,
    { label: string; color: string; icon: typeof Clock }
> = {
    [WithdrawalStatus.PENDING]: {
        label: "Đang chờ",
        color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        icon: Clock,
    },
    [WithdrawalStatus.PROCESSING]: {
        label: "Đang xử lý",
        color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        icon: Loader2,
    },
    [WithdrawalStatus.COMPLETED]: {
        label: "Hoàn thành",
        color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        icon: CheckCircle2,
    },
    [WithdrawalStatus.REJECTED]: {
        label: "Từ chối",
        color: "bg-red-500/10 text-red-400 border-red-500/20",
        icon: XCircle,
    },
};

export default function AdminWithdrawalsPage() {
    const [withdrawals, setWithdrawals] = useState(MOCK_ALL_WITHDRAWALS);
    const [rejectModal, setRejectModal] = useState<Withdrawal | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [processing, setProcessing] = useState<string | null>(null);

    const getUserName = (userId: string) => {
        const user = MOCK_ALL_USERS.find((u) => u.id === userId);
        return user?.full_name || "Không rõ";
    };

    const handleApprove = async (id: string) => {
        setProcessing(id);
        await new Promise((r) => setTimeout(r, 800));
        setWithdrawals((prev) =>
            prev.map((w) =>
                w.id === id
                    ? { ...w, status: WithdrawalStatus.COMPLETED, admin_note: "Đã duyệt" }
                    : w
            )
        );
        setProcessing(null);
    };

    const handleReject = async () => {
        if (!rejectModal) return;
        setProcessing(rejectModal.id);
        await new Promise((r) => setTimeout(r, 800));
        setWithdrawals((prev) =>
            prev.map((w) =>
                w.id === rejectModal.id
                    ? {
                        ...w,
                        status: WithdrawalStatus.REJECTED,
                        admin_note: rejectReason || "Bị từ chối bởi quản trị viên",
                    }
                    : w
            )
        );
        setRejectModal(null);
        setRejectReason("");
        setProcessing(null);
    };

    const pendingCount = withdrawals.filter(
        (w) => w.status === WithdrawalStatus.PENDING || w.status === WithdrawalStatus.PROCESSING
    ).length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Quản lý rút tiền
                </h1>
                <p className="text-zinc-400 mt-1">
                    {pendingCount} yêu cầu đang chờ duyệt
                </p>
            </div>

            {/* Withdrawal items */}
            <div className="space-y-4">
                {withdrawals.map((wd, index) => {
                    const config = STATUS_CONFIG[wd.status];
                    const isPending =
                        wd.status === WithdrawalStatus.PENDING ||
                        wd.status === WithdrawalStatus.PROCESSING;

                    return (
                        <motion.div
                            key={wd.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* User info */}
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-white font-medium">
                                        {getUserName(wd.user_id).charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-semibold">
                                            {getUserName(wd.user_id)}
                                        </p>
                                        <p className="text-zinc-500 text-sm">
                                            ID: {wd.id} •{" "}
                                            {new Date(wd.created_at).toLocaleDateString("vi-VN", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="text-right md:text-center px-6">
                                    <p className="text-2xl font-bold text-white">
                                        {formatVND(wd.amount)}
                                    </p>
                                    <p className="text-zinc-500 text-xs mt-1">
                                        {wd.bank_info.bank_name} - {wd.bank_info.account_number}
                                    </p>
                                    <p className="text-zinc-600 text-xs">
                                        {wd.bank_info.account_holder}
                                    </p>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex items-center gap-3 md:ml-4">
                                    <Badge variant="outline" className={config.color}>
                                        <config.icon
                                            className={`w-3 h-3 mr-1 ${wd.status === WithdrawalStatus.PROCESSING
                                                ? "animate-spin"
                                                : ""
                                                }`}
                                        />
                                        {config.label}
                                    </Badge>

                                    {isPending && (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleApprove(wd.id)}
                                                disabled={processing === wd.id}
                                                className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20"
                                            >
                                                {processing === wd.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Check className="w-4 h-4" />
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setRejectModal(wd);
                                                    setRejectReason("");
                                                }}
                                                disabled={processing === wd.id}
                                                className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Admin note */}
                            {wd.admin_note && (
                                <div className="mt-3 pt-3 border-t border-white/5 flex items-start gap-2">
                                    <MessageSquare className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                                    <p className="text-zinc-400 text-sm">{wd.admin_note}</p>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Reject Modal */}
            <Dialog
                open={!!rejectModal}
                onOpenChange={(open) => !open && setRejectModal(null)}
            >
                <DialogContent className="bg-zinc-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Từ chối rút tiền</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Vui lòng cung cấp lý do từ chối yêu cầu rút{" "}
                            <span className="text-white font-medium">
                                {rejectModal && formatVND(rejectModal.amount)}
                            </span>{" "}
                            của{" "}
                            <span className="text-white font-medium">
                                {rejectModal && getUserName(rejectModal.user_id)}
                            </span>
                            .
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            placeholder="Lý do từ chối..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="bg-zinc-800/50 border-white/10 text-white"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRejectModal(null)}
                            className="border-white/10 text-zinc-300"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleReject}
                            disabled={processing !== null}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20"
                        >
                            {processing ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <XCircle className="w-4 h-4 mr-2" />
                            )}
                            Từ chối
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
