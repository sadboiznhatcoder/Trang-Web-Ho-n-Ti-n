"use server";

// =============================================================================
// Server Action: Admin Payout
// =============================================================================

import { MOCK_ALL_PROFILES } from "@/lib/mock-data";

interface PayoutInput {
  userId: string;
  amount: number;
  note?: string;
}

interface PayoutResult {
  success: boolean;
  error?: string;
}

export async function processManualPayout(input: PayoutInput): Promise<PayoutResult> {
  try {
    const { userId, amount, note } = input;

    if (!userId || !amount || amount <= 0) {
      return { success: false, error: "Dữ liệu không hợp lệ" };
    }

    const profile = MOCK_ALL_PROFILES.find((p) => p.id === userId);
    if (!profile) {
      return { success: false, error: "Không tìm thấy người dùng" };
    }

    if (amount > profile.balance_available) {
      return {
        success: false,
        error: `Số dư không đủ. Khả dụng: ${profile.balance_available.toLocaleString("vi-VN")}đ`,
      };
    }

    // In production: DB transaction
    await new Promise((r) => setTimeout(r, 500));

    console.log("[admin-payout] Processed:", {
      userId,
      amount,
      note,
      newBalance: profile.balance_available - amount,
    });

    return { success: true };
  } catch (error) {
    console.error("[processManualPayout] Error:", error);
    return { success: false, error: "Đã xảy ra lỗi" };
  }
}

// ─── Admin: Ban/Unban User ───────────────────────────────────────────────────
export async function toggleUserBan(userId: string): Promise<PayoutResult> {
  try {
    const profile = MOCK_ALL_PROFILES.find((p) => p.id === userId);
    if (!profile) return { success: false, error: "Không tìm thấy người dùng" };

    await new Promise((r) => setTimeout(r, 300));
    console.log("[admin] Toggle ban:", userId, "current:", profile.status);
    return { success: true };
  } catch {
    return { success: false, error: "Đã xảy ra lỗi" };
  }
}

// ─── Admin: Change User Password ─────────────────────────────────────────────
export async function changeUserPassword(
  userId: string,
  newPassword: string
): Promise<PayoutResult> {
  try {
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: "Mật khẩu mới phải có ít nhất 8 ký tự" };
    }

    // In production: hash and update auth_credentials
    await new Promise((r) => setTimeout(r, 300));
    console.log("[admin] Changed password for:", userId);
    return { success: true };
  } catch {
    return { success: false, error: "Đã xảy ra lỗi" };
  }
}

// ─── Admin: Update User Info ─────────────────────────────────────────────────
export async function updateUserInfo(
  userId: string,
  data: { full_name?: string; phone?: string }
): Promise<PayoutResult> {
  try {
    if (data.phone && !/^[0-9]{10}$/.test(data.phone)) {
      return { success: false, error: "Số điện thoại phải đúng 10 chữ số" };
    }
    if (data.full_name && data.full_name.trim().length < 2) {
      return { success: false, error: "Họ tên phải có ít nhất 2 ký tự" };
    }

    await new Promise((r) => setTimeout(r, 300));
    console.log("[admin] Updated info for:", userId, data);
    return { success: true };
  } catch {
    return { success: false, error: "Đã xảy ra lỗi" };
  }
}
