"use client";

// =============================================================================
// LandingFeatures - Feature highlights grid for the landing page
// =============================================================================

import { motion } from "framer-motion";
import { Zap, Shield, Wallet, BarChart3, Users, Globe } from "lucide-react";

const FEATURES = [
    {
        icon: Zap,
        title: "Chuyển đổi tức thì",
        description:
            "Dán bất kỳ liên kết từ Shopee, Lazada, TikTok Shop hoặc Tiki và nhận liên kết hoàn tiền ngay lập tức.",
        gradient: "from-amber-500/20 to-orange-500/20",
        iconColor: "text-amber-400",
    },
    {
        icon: Shield,
        title: "Bảo vệ chống gian lận",
        description:
            "Hệ thống phát hiện gian lận tiên tiến với nhận dạng thiết bị và giới hạn tốc độ đảm bảo công bằng.",
        gradient: "from-blue-500/20 to-indigo-500/20",
        iconColor: "text-blue-400",
    },
    {
        icon: Wallet,
        title: "Rút tiền dễ dàng",
        description:
            "Rút tiền trực tiếp về tài khoản ngân hàng. Xử lý nhanh chóng, không phí ẩn.",
        gradient: "from-emerald-500/20 to-teal-500/20",
        iconColor: "text-emerald-400",
    },
    {
        icon: BarChart3,
        title: "Phân tích thời gian thực",
        description:
            "Theo dõi lượt click, chuyển đổi và thu nhập với biểu đồ đẹp mắt và báo cáo chi tiết.",
        gradient: "from-purple-500/20 to-pink-500/20",
        iconColor: "text-purple-400",
    },
    {
        icon: Users,
        title: "Chương trình giới thiệu",
        description:
            "Mời bạn bè và nhận thêm hoàn tiền. Mở rộng mạng lưới, tăng thu nhập.",
        gradient: "from-cyan-500/20 to-blue-500/20",
        iconColor: "text-cyan-400",
    },
    {
        icon: Globe,
        title: "Đa nền tảng",
        description:
            "Hỗ trợ tất cả các sàn thương mại điện tử lớn tại Việt Nam. Một liên kết, một tài khoản, mọi thu nhập.",
        gradient: "from-rose-500/20 to-orange-500/20",
        iconColor: "text-rose-400",
    },
];

export function LandingFeatures() {
    return (
        <section className="relative z-10 max-w-6xl mx-auto px-4 py-24">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Tại sao chọn{" "}
                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        V Cashback
                    </span>
                    ?
                </h2>
                <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                    Nền tảng hoàn tiền mạnh mẽ nhất dành cho người mua sắm Việt Nam.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group relative bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300"
                    >
                        {/* Glow on hover */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
                        />

                        <div className="relative z-10">
                            <div
                                className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${feature.iconColor}`}
                            >
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
