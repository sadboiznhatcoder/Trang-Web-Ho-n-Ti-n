"use client";

// =============================================================================
// Withdraw Page - Light mode with 50k min enforcement
// =============================================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowDownToLine,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Clock,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { requestWithdrawal } from "@/actions/withdraw";
import { MOCK_CURRENT_USER, MOCK_ALL_WITHDRAWALS } from "@/lib/mock-data";
import { WithdrawalStatus } from "@/types";

const MIN_WITHDRAWAL = 50_000;

const withdrawSchema = z.object({
  amount: z.preprocess(
    (v) => Number(v),
    z.number().min(MIN_WITHDRAWAL, `Tối thiểu ${MIN_WITHDRAWAL.toLocaleString("vi-VN")}đ`).max(50_000_000, "Tối đa 50,000,000đ")
  ),
  bank_name: z.string().min(1, "Vui lòng nhập tên ngân hàng"),
  account_number: z.string().min(5, "Số tài khoản không hợp lệ"),
  account_holder: z.string().min(2, "Vui lòng nhập tên chủ tài khoản"),
});

type WithdrawForm = z.infer<typeof withdrawSchema>;

const STATUS_CONFIG = {
  [WithdrawalStatus.PENDING]: {
    label: "Chờ duyệt",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
  },
  [WithdrawalStatus.PROCESSING]: {
    label: "Đang xử lý",
    icon: Loader2,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
  },
  [WithdrawalStatus.COMPLETED]: {
    label: "Thành công",
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
  },
  [WithdrawalStatus.REJECTED]: {
    label: "Từ chối",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
  },
};

export default function WithdrawPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const available = MOCK_CURRENT_USER.balance_available;
  const canWithdraw = available >= MIN_WITHDRAWAL;
  const userWithdrawals = MOCK_ALL_WITHDRAWALS.filter(
    (w) => w.user_id === MOCK_CURRENT_USER.id
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WithdrawForm>({
    resolver: zodResolver(withdrawSchema) as any,
  });


  const onSubmit = async (data: WithdrawForm) => {
    if (data.amount > available) {
      setResult({ success: false, message: "Số tiền vượt quá số dư khả dụng" });
      return;
    }
    setLoading(true);
    const res = await requestWithdrawal(data);
    setResult({
      success: res.success,
      message: res.success
        ? `Yêu cầu rút ${data.amount.toLocaleString("vi-VN")}đ đã được gửi!`
        : res.error || "Đã xảy ra lỗi",
    });
    if (res.success) reset();
    setLoading(false);
  };

  const formatVND = (n: number) =>
    new Intl.NumberFormat("vi-VN").format(n) + "đ";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Rút tiền</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Chuyển số dư về tài khoản ngân hàng
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ─── Form ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          {/* Balance */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-emerald-700 font-medium">Số dư khả dụng</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {formatVND(available)}
            </p>
          </div>

          {/* Minimum warning */}
          {!canWithdraw && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Không đủ số dư</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Số dư tối thiểu để rút tiền là {formatVND(MIN_WITHDRAWAL)}
                </p>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 mb-6 ${
                result.success
                  ? "bg-emerald-50 border border-emerald-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm ${result.success ? "text-emerald-700" : "text-red-600"}`}
              >
                {result.message}
              </span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Số tiền (VNĐ)
              </label>
              <Input
                type="number"
                {...register("amount")}
                placeholder="100,000"
                className="h-11 rounded-xl"
                disabled={!canWithdraw}
              />
              {errors.amount && (
                <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Ngân hàng
              </label>
              <Input
                {...register("bank_name")}
                placeholder="Vietcombank"
                className="h-11 rounded-xl"
                disabled={!canWithdraw}
              />
              {errors.bank_name && (
                <p className="text-xs text-red-500 mt-1">{errors.bank_name.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Số tài khoản
              </label>
              <Input
                {...register("account_number")}
                placeholder="1234567890"
                className="h-11 rounded-xl"
                disabled={!canWithdraw}
              />
              {errors.account_number && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.account_number.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Tên chủ tài khoản
              </label>
              <Input
                {...register("account_holder")}
                placeholder="NGUYEN VAN A"
                className="h-11 rounded-xl"
                disabled={!canWithdraw}
              />
              {errors.account_holder && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.account_holder.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !canWithdraw}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ArrowDownToLine className="w-4 h-4 mr-2" />
                  Gửi yêu cầu rút tiền
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* ─── History ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">Lịch sử rút tiền</h3>
          </div>

          {userWithdrawals.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Chưa có lịch sử rút tiền
            </p>
          ) : (
            <div className="space-y-3">
              {userWithdrawals.map((wd) => {
                const config = STATUS_CONFIG[wd.status];
                return (
                  <div
                    key={wd.id}
                    className={`border rounded-xl p-4 ${config.bg}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-foreground">
                        {formatVND(wd.amount)}
                      </span>
                      <div className={`flex items-center gap-1 text-xs font-medium ${config.color}`}>
                        <config.icon className="w-3.5 h-3.5" />
                        {config.label}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>{wd.bank_info.bank_name} • {wd.bank_info.account_number}</p>
                      <p>
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
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
