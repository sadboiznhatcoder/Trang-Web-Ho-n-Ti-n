"use client";

// =============================================================================
// LandingNav - Navigation bar for the landing page
// =============================================================================

import { motion } from "framer-motion";
import Link from "next/link";
import { LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNav() {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-20 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto"
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                    V
                </div>
                <span className="text-xl font-bold text-white hidden sm:block">
                    V<span className="text-emerald-400"> Cashback</span>
                </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <Link href="/dashboard">
                    <Button
                        variant="ghost"
                        className="text-zinc-400 hover:text-white hover:bg-white/5"
                    >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Bảng điều khiển
                    </Button>
                </Link>
                <Link href="/login">
                    <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white border-0 shadow-lg shadow-emerald-500/20">
                        <LogIn className="w-4 h-4 mr-2" />
                        Đăng nhập
                    </Button>
                </Link>
            </div>
        </motion.nav>
    );
}
