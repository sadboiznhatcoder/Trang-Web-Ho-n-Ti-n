"use server";

// =============================================================================
// Server Action: Manual Admin Payout
// Allows admin to deduct balance from user wallets manually
// =============================================================================

import { TransactionType } from "@/types";

export interface ManualPayoutResult {
    success: boolean;
    data?: {
        transaction_id: string;
        amount: number;
        new_balance: number;
    };
    error?: string;
}

export async function processManualPayout(
    userId: string,
    amount: number,
    note: string
): Promise<ManualPayoutResult> {
    try {
        if (!amount || amount <= 0) {
            return { success: false, error: "Số tiền phải lớn hơn 0" };
        }

        if (!note.trim()) {
            return { success: false, error: "Vui lòng nhập ghi chú giao dịch" };
        }

        // In production, this would be a DB transaction:
        // BEGIN;
        //   UPDATE wallets SET available_balance = available_balance - amount
        //   WHERE user_id = userId AND available_balance >= amount;
        //
        //   INSERT INTO transactions (user_id, amount, type, description)
        //   VALUES (userId, -amount, 'WITHDRAWAL_PAID', note);
        //
        //   INSERT INTO audit_logs (admin_id, action, target_id, details)
        //   VALUES (admin_id, 'MANUAL_PAYOUT', userId, {amount, note});
        // COMMIT;

        await new Promise((resolve) => setTimeout(resolve, 500));

        const transactionId = `txn-manual-${Date.now().toString(36)}`;

        return {
            success: true,
            data: {
                transaction_id: transactionId,
                amount,
                new_balance: 0, // Would be calculated from DB
            },
        };
    } catch (error) {
        console.error("[processManualPayout] Error:", error);
        return {
            success: false,
            error: "Đã xảy ra lỗi không mong đợi. Vui lòng thử lại.",
        };
    }
}
