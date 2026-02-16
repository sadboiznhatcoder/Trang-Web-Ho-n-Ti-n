"use client";

// =============================================================================
// Admin Login Portal - Hidden admin authentication page
// Route: /v-admin-portal
// =============================================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Shield, Loader2, AlertCircle, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyAdminCredentials } from "@/actions/admin-auth";

export default function AdminPortalPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await verifyAdminCredentials(username, password);

        if (result.success) {
            router.push("/v-admin-portal/dashboard");
        } else {
            setError(result.error || "Truy cập bị từ chối");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-pink-500/8 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-sm"
            >
                <div className="relative p-[1px] rounded-3xl overflow-hidden">
                    {/* Gradient border */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 via-pink-500/50 to-red-500/50" />

                    <div className="relative bg-zinc-900/95 backdrop-blur-xl rounded-3xl p-8">
                        {/* Logo */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-white">Xác thực quyền truy cập</h1>
                            <p className="text-zinc-500 text-sm mt-1">
                                Vùng hạn chế
                            </p>
                        </div>

                        {/* Login form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="text-xs text-zinc-500 mb-1.5 block uppercase tracking-wider">
                                    Tên đăng nhập
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <Input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Nhập tên đăng nhập"
                                        className="bg-zinc-800/50 border-white/10 text-white h-11 rounded-xl pl-10"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 mb-1.5 block uppercase tracking-wider">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="bg-zinc-800/50 border-white/10 text-white h-11 rounded-xl pl-10"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            {/* Error message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                                >
                                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                    <span className="text-red-400 text-sm">{error}</span>
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading || !username || !password}
                                className="w-full h-11 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold rounded-xl"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4 mr-2" />
                                        Đăng nhập
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
