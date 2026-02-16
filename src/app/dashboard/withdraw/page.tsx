"use client";

// =============================================================================
// Withdraw Page - Withdrawal form with balance display and history
// =============================================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    ArrowDownToLine,
    Loader2,
    Check,
    AlertCircle,
    Clock,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { requestWithdrawal } from "@/actions/withdraw";
import { MOCK_WALLET, MOCK_WITHDRAWALS } from "@/lib/mock-data";
import { WithdrawalStatus } from "@/types";

const withdrawSchema = z.object({
    amount: z
        .number({ error: "Vui lòng nhập số tiền hợp lệ" })
        .min(50_000, "Số tiền rút tối thiểu là 50.000đ")
        .max(50_000_000, "Số tiền rút tối đa là 50.000.000đ"),
    bank_name: z.string().min(1, "Vui lòng nhập tên ngân hàng"),
    account_number: z.string().min(6, "Số tài khoản phải có ít nhất 6 chữ số"),
    account_holder: z.string().min(2, "Vui lòng nhập tên chủ tài khoản"),
});

type WithdrawFormData = z.infer<typeof withdrawSchema>;

function formatVND(amount: number): string {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

const STATUS_META: Record<WithdrawalStatus, { color: string; icon: typeof Clock }> = {
    [WithdrawalStatus.PENDING]: { color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: Clock },
    [WithdrawalStatus.PROCESSING]: { color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: Loader2 },
    [WithdrawalStatus.COMPLETED]: { color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
    [WithdrawalStatus.REJECTED]: { color: "text-red-400 bg-red-500/10 border-red-500/20", icon: XCircle },
};

export default function WithdrawPage() {
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const wallet = MOCK_WALLET;
    const canWithdraw = wallet.available_balance >= 50_000;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<WithdrawFormData>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: {
            bank_name: "",
            account_number: "",
            account_holder: "",
        },
    });

    const onSubmit = async (data: WithdrawFormData) => {
        setSubmitting(true);
        setResult(null);

        const res = await requestWithdrawal(data.amount, {
            bank_name: data.bank_name,
            account_number: data.account_number,
            account_holder: data.account_holder,
        });

        if (res.success) {
            setResult({
                success: true,
                message: `Yêu cầu rút ${formatVND(data.amount)} đã gửi thành công! Mã: ${res.data?.withdrawal_id}`,
            });
            reset();
        } else {
            setResult({ success: false, message: res.error || "Error" });
        }

        setSubmitting(false);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Rút tiền</h1>
                <p className="text-zinc-400 mt-1">
                    Yêu cầu chi trả vào tài khoản ngân hàng của bạn.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Balance card */}
                <div className="lg:col-span-1">
                    <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 sticky top-8">
                        <h3 className="text-white font-semibold">Số dư khả dụng</h3>
                        <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            {formatVND(wallet.available_balance)}
                        </p>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-zinc-400">
                                <span>Đang chờ</span>
                                <span className="text-amber-400">{formatVND(wallet.pending_balance)}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>Đã khóa</span>
                                <span>{formatVND(wallet.locked_balance)}</span>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-white/5 text-xs text-zinc-500 space-y-1">
                            <p>• Rút tối thiểu: 50.000đ</p>
                            <p>• Thời gian xử lý: 1-3 ngày làm việc</p>
                            <p>• Không phí rút tiền</p>
                        </div>
                    </div>
                </div>

                {/* Withdrawal form */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                    >
                        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                            <ArrowDownToLine className="w-5 h-5 text-emerald-400" />
                            Yêu cầu rút tiền
                        </h3>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="text-sm text-zinc-400 mb-2 block">
                                    Số tiền (VNĐ)
                                </label>
                                <Input
                                    type="number"
                                    placeholder="Ví dụ: 500000"
                                    {...register("amount", { valueAsNumber: true })}
                                    className="bg-zinc-800/50 border-white/10 text-white h-12 rounded-xl text-lg"
                                />
                                {errors.amount && (
                                    <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-zinc-400 mb-2 block">Tên ngân hàng</label>
                                    <Input
                                        placeholder="Ví dụ: Vietcombank"
                                        {...register("bank_name")}
                                        className="bg-zinc-800/50 border-white/10 text-white h-11 rounded-xl"
                                    />
                                    {errors.bank_name && (
                                        <p className="text-red-400 text-xs mt-1">{errors.bank_name.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm text-zinc-400 mb-2 block">Số tài khoản</label>
                                    <Input
                                        placeholder="Ví dụ: 001234567890"
                                        {...register("account_number")}
                                        className="bg-zinc-800/50 border-white/10 text-white h-11 rounded-xl"
                                    />
                                    {errors.account_number && (
                                        <p className="text-red-400 text-xs mt-1">{errors.account_number.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-zinc-400 mb-2 block">Tên chủ tài khoản</label>
                                <Input
                                    placeholder="Ví dụ: NGUYEN VAN MINH"
                                    {...register("account_holder")}
                                    className="bg-zinc-800/50 border-white/10 text-white h-11 rounded-xl uppercase"
                                />
                                {errors.account_holder && (
                                    <p className="text-red-400 text-xs mt-1">{errors.account_holder.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={submitting || !canWithdraw}
                                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                ) : (
                                    <ArrowDownToLine className="w-5 h-5 mr-2" />
                                )}
                                Gửi yêu cầu rút tiền
                            </Button>

                            {!canWithdraw && (
                                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                                    <p className="text-amber-400 text-sm">
                                        Số dư tối thiểu để rút tiền là 50.000đ. Số dư hiện tại:{" "}
                                        <span className="font-semibold">{formatVND(wallet.available_balance)}</span>
                                    </p>
                                </div>
                            )}
                        </form>

                        {/* Result message */}
                        <AnimatePresence>
                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`mt-4 p-4 rounded-xl flex items-start gap-3 ${result.success
                                        ? "bg-emerald-500/10 border border-emerald-500/20"
                                        : "bg-red-500/10 border border-red-500/20"
                                        }`}
                                >
                                    {result.success ? (
                                        <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    )}
                                    <p className={`text-sm ${result.success ? "text-emerald-300" : "text-red-300"}`}>
                                        {result.message}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Withdrawal history */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                    >
                        <h3 className="text-white font-semibold mb-4">Lịch sử rút tiền</h3>
                        <div className="space-y-3">
                            {MOCK_WITHDRAWALS.map((wd) => {
                                const meta = STATUS_META[wd.status];
                                return (
                                    <div
                                        key={wd.id}
                                        className="flex items-center gap-4 bg-white/[0.02] rounded-xl px-4 py-3"
                                    >
                                        <div className={`w-10 h-10 rounded-xl ${meta.color.split(" ")[1]} flex items-center justify-center shrink-0`}>
                                            <meta.icon className={`w-5 h-5 ${meta.color.split(" ")[0]}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium">
                                                {formatVND(wd.amount)}
                                            </p>
                                            <p className="text-zinc-500 text-xs">
                                                {wd.bank_info.bank_name} - {wd.bank_info.account_number}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className={meta.color}>
                                            {wd.status}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
