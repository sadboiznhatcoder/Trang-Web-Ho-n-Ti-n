"use server";

// =============================================================================
// Server Action: Withdrawal Request
// =============================================================================

import { type WithdrawResult, WithdrawalStatus } from "@/types";
import { MOCK_CURRENT_USER } from "@/lib/mock-data";

const MIN_WITHDRAWAL = 50_000;
const MAX_WITHDRAWAL = 50_000_000;

interface WithdrawInput {
  amount: number;
  bank_name: string;
  account_number: string;
  account_holder: string;
}

export async function requestWithdrawal(input: WithdrawInput): Promise<WithdrawResult> {
  try {
    const { amount, bank_name, account_number, account_holder } = input;

    if (!amount || amount <= 0) {
      return { success: false, error: "Vui lòng nhập số tiền hợp lệ" };
    }

    if (amount < MIN_WITHDRAWAL) {
      return {
        success: false,
        error: `Số tiền rút tối thiểu là ${MIN_WITHDRAWAL.toLocaleString("vi-VN")}đ`,
      };
    }

    if (amount > MAX_WITHDRAWAL) {
      return {
        success: false,
        error: `Số tiền rút tối đa là ${MAX_WITHDRAWAL.toLocaleString("vi-VN")}đ`,
      };
    }

    // Check available balance
    if (amount > MOCK_CURRENT_USER.balance_available) {
      return {
        success: false,
        error: `Số dư không đủ. Khả dụng: ${MOCK_CURRENT_USER.balance_available.toLocaleString("vi-VN")}đ`,
      };
    }

    if (!bank_name || !account_number || !account_holder) {
      return { success: false, error: "Vui lòng điền đầy đủ thông tin ngân hàng" };
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const withdrawalId = `wd-${Date.now().toString(36)}`;

    return {
      success: true,
      data: { withdrawal_id: withdrawalId, locked_amount: amount },
    };
  } catch (error) {
    console.error("[requestWithdrawal] Error:", error);
    return { success: false, error: "Đã xảy ra lỗi. Vui lòng thử lại." };
  }
}
