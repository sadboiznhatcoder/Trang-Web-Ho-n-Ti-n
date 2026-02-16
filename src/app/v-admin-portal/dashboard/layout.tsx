"use client";

// =============================================================================
// Admin Dashboard Layout - Dark sidebar, distinct from user dashboard
// =============================================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ArrowDownToLine,
  LogOut,
  Shield,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSession, logout } from "@/actions/auth";

const NAV_ITEMS = [
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
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const session = await getSession();
      if (session?.role === "ADMIN") {
        setAuthorized(true);
      } else {
        router.replace("/login");
      }
      setChecking(false);
    };
    check();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* ───── Desktop Sidebar ───── */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-zinc-900 border-r border-zinc-800 z-40">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
            V
          </div>
          <div>
            <span className="text-sm font-bold text-white">Admin Portal</span>
            <p className="text-[10px] text-zinc-500">V Cashback</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
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
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ───── Mobile Header ───── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-sm">Admin Portal</span>
          </div>
          <button onClick={handleLogout} className="text-zinc-400 p-2">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ───── Main Content ───── */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-24 lg:pb-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">{children}</div>
      </main>

      {/* ───── Mobile Bottom Tab Bar ───── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/v-admin-portal/dashboard"
                ? pathname === "/v-admin-portal/dashboard"
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
