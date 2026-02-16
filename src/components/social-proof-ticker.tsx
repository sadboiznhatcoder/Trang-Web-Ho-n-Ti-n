"use client";

// =============================================================================
// SocialProofTicker - Auto-scrolling ticker showing recent cashback earnings
// =============================================================================

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { MOCK_SOCIAL_PROOF } from "@/lib/mock-data";

function formatVND(amount: number): string {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export function SocialProofTicker() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((i) => (i + 1) % MOCK_SOCIAL_PROOF.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const current = MOCK_SOCIAL_PROOF[currentIndex];

    return (
        <div className="flex items-center justify-center gap-2 py-3">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
                <AnimatePresence mode="wait">
                    <motion.span
                        key={currentIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-zinc-300"
                    >
                        <span className="font-semibold text-white">{current.name}</span>{" "}
                        vừa nhận{" "}
                        <span className="font-bold text-emerald-400">
                            {formatVND(current.amount)}
                        </span>{" "}
                        từ {current.platform}
                    </motion.span>
                </AnimatePresence>
            </div>
        </div>
    );
}
