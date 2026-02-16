"use client";

// =============================================================================
// Admin Users Page - Enhanced with balance column and detail modal
// Route: /v-admin-portal/dashboard/users
// =============================================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Ban,
    Eye,
    MoreVertical,
    Shield,
    ShieldCheck,
    UserX,
    Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_ALL_USERS, MOCK_WALLET } from "@/lib/mock-data";
import { UserRole, type User } from "@/types";
import { UserDetailModal } from "@/components/admin/user-detail-modal";

const ROLE_COLORS: Record<UserRole, string> = {
    [UserRole.USER]: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    [UserRole.ADMIN]: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    [UserRole.SUPPORT]: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

function formatVND(amount: number): string {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

// Mock wallet balances for different users
const USER_BALANCES: Record<string, number> = {
    "user-001": 1_250_000,
    "user-002": 680_000,
    "user-003": 0,
    "user-004": 2_150_000,
    "admin-001": 0,
};

export default function AdminUsersPage() {
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const filteredUsers = MOCK_ALL_USERS.filter(
        (u) =>
            u.full_name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Quản lý người dùng
                    </h1>
                    <p className="text-zinc-400 mt-1">
                        {MOCK_ALL_USERS.length} người dùng
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                    placeholder="Tìm theo tên hoặc email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-zinc-900/80 border-white/10 text-white h-11 rounded-xl pl-10"
                />
            </div>

            {/* Users table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
            >
                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-zinc-400 text-xs uppercase tracking-wider border-b border-white/5">
                                <th className="text-left px-6 py-3 font-medium">Người dùng</th>
                                <th className="text-left px-6 py-3 font-medium">Vai trò</th>
                                <th className="text-center px-6 py-3 font-medium">Cấp</th>
                                <th className="text-right px-6 py-3 font-medium">Số dư</th>
                                <th className="text-left px-6 py-3 font-medium">Trạng thái</th>
                                <th className="text-left px-6 py-3 font-medium">Ngày tham gia</th>
                                <th className="text-right px-6 py-3 font-medium">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-white text-sm font-medium">
                                                {user.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium">
                                                    {user.full_name}
                                                </p>
                                                <p className="text-zinc-500 text-xs">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className={ROLE_COLORS[user.role]}>
                                            {user.role === UserRole.ADMIN && (
                                                <ShieldCheck className="w-3 h-3 mr-1" />
                                            )}
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-amber-400 font-medium">
                                            ⭐ {user.tier_level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-emerald-400 font-medium text-sm">
                                            {formatVND(USER_BALANCES[user.id] || 0)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.is_banned ? (
                                            <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
                                                <UserX className="w-3 h-3 mr-1" />
                                                Đã cấm
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                                Hoạt động
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400 text-sm">
                                        {new Date(user.created_at).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-zinc-400 hover:text-white"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="bg-zinc-800 border-white/10"
                                            >
                                                <DropdownMenuItem
                                                    className="text-zinc-300 hover:text-white"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedUser(user);
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Xem chi tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-400 hover:text-red-300">
                                                    <Ban className="w-4 h-4 mr-2" />
                                                    {user.is_banned ? "Bỏ cấm" : "Cấm người dùng"}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-3 p-4">
                    {filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className="bg-white/[0.02] rounded-xl p-4 space-y-3 cursor-pointer hover:bg-white/[0.04] transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-white text-sm font-medium">
                                        {user.full_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">
                                            {user.full_name}
                                        </p>
                                        <p className="text-zinc-500 text-xs">{user.email}</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className={ROLE_COLORS[user.role]}>
                                    {user.role}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500">Cấp {user.tier_level}</span>
                                <span className="text-emerald-400 font-medium">
                                    {formatVND(USER_BALANCES[user.id] || 0)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                {user.is_banned ? (
                                    <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                                        Đã cấm
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                                        Hoạt động
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* User Detail Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <UserDetailModal
                        user={selectedUser}
                        onClose={() => setSelectedUser(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
