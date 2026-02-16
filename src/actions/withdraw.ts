"use server";

// =============================================================================
// Server Action: Withdrawal Request
// Validates balance, locks funds, creates withdrawal record.
// =============================================================================

import { type WithdrawResult, type BankInfo, WithdrawalStatus } from "@/types";
import { MOCK_WALLET } from "@/lib/mock-data";

const MIN_WITHDRAWAL = 50_000; // Minimum withdrawal: 50,000 VNĐ
const MAX_WITHDRAWAL = 50_000_000; // Maximum withdrawal: 50,000,000 VNĐ

/**
 * Process a withdrawal request.
 *
 * Flow:
 * 1. Validate amount (min/max, available balance)
 * 2. Validate bank info
 * 3. Lock funds (deduct from available, add to locked)
 * 4. Create withdrawal record
 * 5. Create ledger entry (negative transaction)
 * 6. Return result
 */
export async function requestWithdrawal(
    amount: number,
    bankInfo: BankInfo,
    userId: string = "user-001"
): Promise<WithdrawResult> {
    try {
        // Step 1: Validate amount
        if (!amount || amount <= 0) {
            return { success: false, error: "Please enter a valid amount." };
        }

        if (amount < MIN_WITHDRAWAL) {
            return {
                success: false,
                error: `Minimum withdrawal is ${MIN_WITHDRAWAL.toLocaleString("vi-VN")}đ.`,
            };
        }

        if (amount > MAX_WITHDRAWAL) {
            return {
                success: false,
                error: `Maximum withdrawal is ${MAX_WITHDRAWAL.toLocaleString("vi-VN")}đ per request.`,
            };
        }

        // Check available balance (mock)
        const wallet = MOCK_WALLET;
        if (amount > wallet.available_balance) {
            return {
                success: false,
                error: `Insufficient balance. Available: ${wallet.available_balance.toLocaleString("vi-VN")}đ.`,
            };
        }

        // Step 2: Validate bank info
        if (!bankInfo.bank_name || !bankInfo.account_number || !bankInfo.account_holder) {
            return {
                success: false,
                error: "Please fill in all bank information fields.",
            };
        }

        // Step 3 & 4: In production, this would be a DB transaction:
        // BEGIN;
        //   UPDATE wallets SET available_balance = available_balance - amount,
        //                      locked_balance = locked_balance + amount
        //   WHERE user_id = userId;
        //
        //   INSERT INTO withdrawals (user_id, amount, bank_info, status)
        //   VALUES (userId, amount, bankInfo, 'PENDING');
        //
        //   INSERT INTO transactions (user_id, amount, type, reference_id, description)
        //   VALUES (userId, -amount, 'WITHDRAWAL_REQUEST', withdrawal_id, 'Withdrawal request');
        // COMMIT;

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const withdrawalId = `wd-${Date.now().toString(36)}`;

        return {
            success: true,
            data: {
                withdrawal_id: withdrawalId,
                amount,
                status: WithdrawalStatus.PENDING,
            },
        };
    } catch (error) {
        console.error("[requestWithdrawal] Error:", error);
        return {
            success: false,
            error: "An unexpected error occurred. Please try again.",
        };
    }
}
