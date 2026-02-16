"use client";

// =============================================================================
// Register Page - Phone/Password registration with strength meter
// =============================================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Loader2, Phone, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordStrengthMeter } from "@/components/password-strength-meter";
import { registerUser } from "@/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await registerUser({ full_name: fullName, phone, password });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setError(result.error || "Đã xảy ra lỗi");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* Subtle background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full blur-[100px] opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100 rounded-full blur-[100px] opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl shadow-xl shadow-black/5 p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-600/20">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Tạo tài khoản</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Đăng ký V Cashback để nhận hoàn tiền
            </p>
          </div>

          {/* Success message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-6"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-emerald-700 text-sm font-medium">
                Đăng ký thành công! Đang chuyển hướng...
              </p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Họ và tên
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="h-11 rounded-xl pl-10"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(val);
                  }}
                  placeholder="0912345678"
                  className="h-11 rounded-xl pl-10 font-mono"
                  maxLength={10}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Phải đúng 10 chữ số
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 rounded-xl pl-10"
                  required
                />
              </div>
              <PasswordStrengthMeter password={password} />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-red-600 text-sm">{error}</span>
              </motion.div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || success}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Đăng ký
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-emerald-600 font-medium hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
