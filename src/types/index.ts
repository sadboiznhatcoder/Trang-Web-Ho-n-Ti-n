// =============================================================================
// V Cashback - Core TypeScript Types & Enums
// =============================================================================

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
}

export enum Platform {
  SHOPEE = "SHOPEE",
  LAZADA = "LAZADA",
  TIKTOK = "TIKTOK",
  TIKI = "TIKI",
}

export enum OrderStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID",
}

export enum TransactionType {
  CASHBACK_PENDING = "CASHBACK_PENDING",
  CASHBACK_APPROVED = "CASHBACK_APPROVED",
  WITHDRAWAL_REQUEST = "WITHDRAWAL_REQUEST",
  WITHDRAWAL_PAID = "WITHDRAWAL_PAID",
  WITHDRAWAL_REJECTED = "WITHDRAWAL_REJECTED",
  MANUAL_PAYOUT = "MANUAL_PAYOUT",
  BONUS = "BONUS",
}

export enum WithdrawalStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

// ─── Database Models ─────────────────────────────────────────────────────────

/**
 * Profile — maps to `profiles` table.
 * Balances are stored directly on the profile (no separate wallet).
 */
export interface Profile {
  id: string;
  phone: string; // 10 digits
  full_name: string;
  role: UserRole;
  status: UserStatus;
  balance_available: number; // VND
  balance_pending: number; // VND
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Auth credentials — maps to `auth_credentials` table.
 */
export interface AuthCredentials {
  user_id: string;
  password_hash: string;
  updated_at: string;
}

/**
 * Tracking link — for affiliate link conversion.
 */
export interface TrackingLink {
  id: string;
  user_id: string;
  original_url: string;
  affiliate_url: string;
  short_code: string;
  platform: Platform;
  click_count: number;
  created_at: string;
}

/**
 * Order — cashback tracking for e-commerce purchases.
 */
export interface Order {
  id: string;
  user_id: string;
  link_id: string;
  platform: Platform;
  external_order_id: string;
  gmv: number; // Gross Merchandise Value
  commission_rate: number;
  total_commission: number;
  platform_share: number;
  user_commission: number; // What user gets
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Transaction — ledger entry for payouts, bonuses.
 */
export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  balance_after: number;
  description: string;
  reference_id: string | null;
  created_at: string;
}

/**
 * Withdrawal request.
 */
export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  bank_info: BankInfo;
  status: WithdrawalStatus;
  admin_note: string | null;
  created_at: string;
  processed_at: string | null;
}

export interface BankInfo {
  bank_name: string;
  account_number: string;
  account_holder: string;
}

// ─── Earnings Chart ──────────────────────────────────────────────────────────

export interface EarningsDataPoint {
  date: string;
  earnings: number;
}

// ─── Action types ────────────────────────────────────────────────────────────

export interface AuthResult {
  success: boolean;
  redirect?: string;
  error?: string;
}

export interface RegisterInput {
  full_name: string;
  phone: string;
  password: string;
}

export interface WithdrawInput {
  amount: number;
  bank_name: string;
  account_number: string;
  account_holder: string;
}

export interface WithdrawResult {
  success: boolean;
  data?: { withdrawal_id: string; locked_amount: number };
  error?: string;
}
