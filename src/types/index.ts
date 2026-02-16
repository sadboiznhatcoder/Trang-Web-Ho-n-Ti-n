// =============================================================================
// CashbackTitan - Core TypeScript Types & Enums
// =============================================================================

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPPORT = "SUPPORT",
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
}

export enum WithdrawalStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

// ─── Database Models ─────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: UserRole;
  tier_level: number;
  referral_code: string;
  referred_by: string | null;
  metadata: Record<string, unknown>;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  available_balance: number;
  pending_balance: number;
  locked_balance: number;
  lifetime_earnings: number;
  updated_at: string;
}

export interface TrackingLink {
  id: string;
  user_id: string;
  platform: Platform;
  original_url: string;
  affiliate_url: string;
  short_code: string;
  click_count: number;
  created_at: string;
}

export interface Order {
  id: string;
  external_order_id: string | null;
  tracking_link_id: string | null;
  user_id: string;
  platform: Platform;
  gmv: number;
  commission_amount: number;
  user_commission: number;
  system_fee: number;
  tax: number;
  status: OrderStatus;
  estimated_payout_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  reference_id: string | null;
  description: string | null;
  status: string;
  created_at: string;
}

export interface BankInfo {
  bank_name: string;
  account_number: string;
  account_holder: string;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  bank_info: BankInfo;
  status: WithdrawalStatus;
  admin_note: string | null;
  processed_by: string | null;
  processed_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

// ─── API / Action Types ──────────────────────────────────────────────────────

export interface GenerateLinkInput {
  url: string;
}

export interface GenerateLinkResult {
  success: boolean;
  data?: {
    platform: Platform;
    original_url: string;
    affiliate_url: string;
    short_code: string;
    short_url: string;
    estimated_commission: string;
  };
  error?: string;
}

export interface WithdrawInput {
  amount: number;
  bank_info: BankInfo;
}

export interface WithdrawResult {
  success: boolean;
  data?: {
    withdrawal_id: string;
    amount: number;
    status: WithdrawalStatus;
  };
  error?: string;
}

// ─── Mock Data Types ─────────────────────────────────────────────────────────

export interface MockAffiliateResponse {
  affiliate_url: string;
  commission_rate: number; // percentage, e.g., 3.5 means 3.5%
  platform: Platform;
  campaign_name: string;
}

export interface EarningsDataPoint {
  date: string;
  amount: number;
}
