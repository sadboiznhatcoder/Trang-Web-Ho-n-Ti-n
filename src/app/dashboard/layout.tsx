"use client";

// =============================================================================
// Dashboard Layout - Sidebar (desktop) + Bottom Tab Bar (mobile)
// =============================================================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Link2,
    ArrowDownToLine,
    ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/dashboard/links", label: "Liên kết", icon: Link2 },
    { href: "/dashboard/withdraw", label: "Rút tiền", icon: ArrowDownToLine },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* ───── Desktop Sidebar ───── */}
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-zinc-900/50 backdrop-blur-xl border-r border-white/5 z-40">
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                        V
                    </div>
                    <span className="text-lg font-bold">
                        V<span className="text-emerald-400"> Cashback</span>
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-3 py-4 border-t border-white/5 space-y-1">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Về trang chủ
                    </Link>
                </div>
            </aside>

            {/* ───── Mobile Header ───── */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-zinc-900/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                            V
                        </div>
                        <span className="font-bold text-sm">V Cashback</span>
                    </div>
                    <Link href="/" className="text-zinc-400 text-sm hover:text-white">
                        Trang chủ
                    </Link>
                </div>
            </header>

            {/* ───── Main Content ───── */}
            <main className="lg:ml-64 pt-16 lg:pt-0 pb-24 lg:pb-8 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
                    {children}
                </div>
            </main>

            {/* ───── Mobile Bottom Tab Bar ───── */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-xl border-t border-white/5">
                <div className="flex items-center justify-around py-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive =
                            item.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                                    isActive ? "text-emerald-400" : "text-zinc-500"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
