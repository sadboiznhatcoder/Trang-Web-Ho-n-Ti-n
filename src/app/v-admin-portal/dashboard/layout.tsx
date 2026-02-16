"use client";

// =============================================================================
// Admin Dashboard Layout - with session guard
// Route: /v-admin-portal/dashboard/*
// =============================================================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    ArrowDownToLine,
    Shield,
    ChevronLeft,
    LogOut,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { checkAdminSession, logoutAdmin } from "@/actions/admin-auth";

const ADMIN_NAV = [
    { href: "/v-admin-portal/dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/v-admin-portal/dashboard/users", label: "Người dùng", icon: Users },
    { href: "/v-admin-portal/dashboard/withdrawals", label: "Rút tiền", icon: ArrowDownToLine },
];

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        checkAdminSession().then((valid) => {
            if (!valid) {
                router.replace("/v-admin-portal");
            } else {
                setAuthenticated(true);
            }
            setChecking(false);
        });
    }, [router]);

    if (checking || !authenticated) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Admin sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-zinc-900/50 backdrop-blur-xl border-r border-white/5 z-40">
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                        <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold">
                        V<span className="text-purple-400"> Admin</span>
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {ADMIN_NAV.map((item) => {
                        const isActive =
                            item.href === "/v-admin-portal/dashboard"
                                ? pathname === "/v-admin-portal/dashboard"
                                : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
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
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Về bảng điều khiển
                    </Link>
                    <form action={logoutAdmin}>
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full"
                        >
                            <LogOut className="w-5 h-5" />
                            Đăng xuất Admin
                        </button>
                    </form>
                </div>
            </aside>

            {/* Mobile header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-zinc-900/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                            <Shield className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm">V Admin</span>
                    </div>
                    <Link href="/dashboard" className="text-zinc-400 text-sm hover:text-white">
                        Bảng điều khiển
                    </Link>
                </div>
                <div className="flex px-2 pb-2 gap-1 overflow-x-auto">
                    {ADMIN_NAV.map((item) => {
                        const isActive =
                            item.href === "/v-admin-portal/dashboard"
                                ? pathname === "/v-admin-portal/dashboard"
                                : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                                    isActive
                                        ? "bg-purple-500/20 text-purple-400"
                                        : "text-zinc-500"
                                )}
                            >
                                <item.icon className="w-3.5 h-3.5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </header>

            {/* Main content */}
            <main className="lg:ml-64 pt-24 lg:pt-0 pb-8 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
