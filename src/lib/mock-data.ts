// =============================================================================
// Mock Data - Realistic sample data for development
// =============================================================================

import {
    type User,
    type Wallet,
    type TrackingLink,
    type Order,
    type Transaction,
    type Withdrawal,
    type EarningsDataPoint,
    UserRole,
    Platform,
    OrderStatus,
    TransactionType,
    WithdrawalStatus,
} from "@/types";

// ─── Current Mock User ───────────────────────────────────────────────────────

export const MOCK_USER: User = {
    id: "user-001",
    email: "demo@vcashback.vn",
    full_name: "Nguyễn Văn Minh",
    avatar_url: "",
    role: UserRole.USER,
    tier_level: 3,
    referral_code: "VCASH2024",
    referred_by: null,
    metadata: {},
    is_banned: false,
    created_at: "2024-06-15T08:00:00Z",
    updated_at: "2025-02-10T12:00:00Z",
};

export const MOCK_ADMIN: User = {
    id: "admin-001",
    email: "admin@vcashback.vn",
    full_name: "Admin V Cashback",
    avatar_url: "",
    role: UserRole.ADMIN,
    tier_level: 5,
    referral_code: "ADMIN001",
    referred_by: null,
    metadata: {},
    is_banned: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2025-02-10T12:00:00Z",
};

// ─── Wallet ──────────────────────────────────────────────────────────────────

export const MOCK_WALLET: Wallet = {
    id: "wallet-001",
    user_id: "user-001",
    available_balance: 1_250_000,
    pending_balance: 430_000,
    locked_balance: 0,
    lifetime_earnings: 8_750_000,
    updated_at: "2025-02-10T12:00:00Z",
};

// ─── Tracking Links ─────────────────────────────────────────────────────────

export const MOCK_LINKS: TrackingLink[] = [
    {
        id: "link-001",
        user_id: "user-001",
        platform: Platform.SHOPEE,
        original_url: "https://shopee.vn/product/12345",
        affiliate_url: "https://shopee.vn/product/12345?aff_id=CT001",
        short_code: "Abc123",
        click_count: 342,
        created_at: "2025-02-01T10:00:00Z",
    },
    {
        id: "link-002",
        user_id: "user-001",
        platform: Platform.LAZADA,
        original_url: "https://lazada.vn/products/i678.html",
        affiliate_url: "https://lazada.vn/products/i678.html?aff_id=CT002",
        short_code: "Def456",
        click_count: 128,
        created_at: "2025-02-03T14:30:00Z",
    },
    {
        id: "link-003",
        user_id: "user-001",
        platform: Platform.TIKTOK,
        original_url: "https://tiktokshop.com/item/91011",
        affiliate_url: "https://tiktokshop.com/item/91011?aff_id=CT003",
        short_code: "Ghj789",
        click_count: 89,
        created_at: "2025-02-05T09:15:00Z",
    },
    {
        id: "link-004",
        user_id: "user-001",
        platform: Platform.TIKI,
        original_url: "https://tiki.vn/p/12345",
        affiliate_url: "https://tiki.vn/p/12345?aff_id=CT004",
        short_code: "Klm012",
        click_count: 56,
        created_at: "2025-02-07T16:45:00Z",
    },
    {
        id: "link-005",
        user_id: "user-001",
        platform: Platform.SHOPEE,
        original_url: "https://shopee.vn/sale-item/67890",
        affiliate_url: "https://shopee.vn/sale-item/67890?aff_id=CT005",
        short_code: "Nop345",
        click_count: 210,
        created_at: "2025-02-09T11:20:00Z",
    },
];

// ─── Orders ──────────────────────────────────────────────────────────────────

export const MOCK_ORDERS: Order[] = [
    {
        id: "order-001",
        external_order_id: "SHP240201001",
        tracking_link_id: "link-001",
        user_id: "user-001",
        platform: Platform.SHOPEE,
        gmv: 850_000,
        commission_amount: 42_500,
        user_commission: 21_250,
        system_fee: 17_000,
        tax: 4_250,
        status: OrderStatus.PAID,
        estimated_payout_date: "2025-03-01T00:00:00Z",
        created_at: "2025-02-01T14:00:00Z",
        updated_at: "2025-02-10T08:00:00Z",
    },
    {
        id: "order-002",
        external_order_id: "LZD240203001",
        tracking_link_id: "link-002",
        user_id: "user-001",
        platform: Platform.LAZADA,
        gmv: 1_200_000,
        commission_amount: 72_000,
        user_commission: 36_000,
        system_fee: 28_800,
        tax: 7_200,
        status: OrderStatus.APPROVED,
        estimated_payout_date: "2025-03-10T00:00:00Z",
        created_at: "2025-02-03T18:00:00Z",
        updated_at: "2025-02-08T10:00:00Z",
    },
    {
        id: "order-003",
        external_order_id: "TIK240205001",
        tracking_link_id: "link-003",
        user_id: "user-001",
        platform: Platform.TIKTOK,
        gmv: 450_000,
        commission_amount: 36_000,
        user_commission: 18_000,
        system_fee: 14_400,
        tax: 3_600,
        status: OrderStatus.PENDING,
        estimated_payout_date: "2025-03-15T00:00:00Z",
        created_at: "2025-02-05T12:00:00Z",
        updated_at: "2025-02-05T12:00:00Z",
    },
];

// ─── Transactions ────────────────────────────────────────────────────────────

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: "txn-001",
        user_id: "user-001",
        amount: 21_250,
        type: TransactionType.CASHBACK_APPROVED,
        reference_id: "order-001",
        description: "Cashback from SHOPEE order #SHP240201001",
        status: "COMPLETED",
        created_at: "2025-02-10T08:00:00Z",
    },
    {
        id: "txn-002",
        user_id: "user-001",
        amount: 36_000,
        type: TransactionType.CASHBACK_PENDING,
        reference_id: "order-002",
        description: "Cashback from LAZADA order #LZD240203001",
        status: "COMPLETED",
        created_at: "2025-02-08T10:00:00Z",
    },
    {
        id: "txn-003",
        user_id: "user-001",
        amount: -500_000,
        type: TransactionType.WITHDRAWAL_PAID,
        reference_id: "withdraw-001",
        description: "Withdrawal to Vietcombank ***4567",
        status: "COMPLETED",
        created_at: "2025-02-06T14:00:00Z",
    },
    {
        id: "txn-004",
        user_id: "user-001",
        amount: 18_000,
        type: TransactionType.CASHBACK_PENDING,
        reference_id: "order-003",
        description: "Cashback from TIKTOK order #TIK240205001",
        status: "COMPLETED",
        created_at: "2025-02-05T12:00:00Z",
    },
];

// ─── Withdrawals ─────────────────────────────────────────────────────────────

export const MOCK_WITHDRAWALS: Withdrawal[] = [
    {
        id: "withdraw-001",
        user_id: "user-001",
        amount: 500_000,
        bank_info: {
            bank_name: "Vietcombank",
            account_number: "***4567",
            account_holder: "NGUYEN VAN MINH",
        },
        status: WithdrawalStatus.COMPLETED,
        admin_note: "Processed successfully",
        processed_by: "admin-001",
        processed_at: "2025-02-06T14:00:00Z",
        created_at: "2025-02-05T10:00:00Z",
    },
    {
        id: "withdraw-002",
        user_id: "user-001",
        amount: 300_000,
        bank_info: {
            bank_name: "Techcombank",
            account_number: "***8901",
            account_holder: "NGUYEN VAN MINH",
        },
        status: WithdrawalStatus.PENDING,
        admin_note: null,
        processed_by: null,
        processed_at: null,
        created_at: "2025-02-10T09:00:00Z",
    },
];

// ─── All Users (for Admin view) ──────────────────────────────────────────────

export const MOCK_ALL_USERS: User[] = [
    MOCK_USER,
    {
        id: "user-002",
        email: "trang.le@gmail.com",
        full_name: "Lê Thị Trang",
        avatar_url: "",
        role: UserRole.USER,
        tier_level: 2,
        referral_code: "TRANG88",
        referred_by: "user-001",
        metadata: {},
        is_banned: false,
        created_at: "2024-08-20T10:00:00Z",
        updated_at: "2025-02-09T15:00:00Z",
    },
    {
        id: "user-003",
        email: "hoang.vu@yahoo.com",
        full_name: "Vũ Hoàng Nam",
        avatar_url: "",
        role: UserRole.USER,
        tier_level: 1,
        referral_code: "HOANG99",
        referred_by: null,
        metadata: {},
        is_banned: true,
        created_at: "2024-10-05T08:00:00Z",
        updated_at: "2025-01-15T09:00:00Z",
    },
    {
        id: "user-004",
        email: "phuong.dao@outlook.com",
        full_name: "Đào Phương Anh",
        avatar_url: "",
        role: UserRole.USER,
        tier_level: 4,
        referral_code: "PHUONG77",
        referred_by: "user-001",
        metadata: {},
        is_banned: false,
        created_at: "2024-07-10T14:00:00Z",
        updated_at: "2025-02-10T11:00:00Z",
    },
    MOCK_ADMIN,
];

// ─── All Withdrawals (for Admin view) ────────────────────────────────────────

export const MOCK_ALL_WITHDRAWALS: Withdrawal[] = [
    ...MOCK_WITHDRAWALS,
    {
        id: "withdraw-003",
        user_id: "user-002",
        amount: 750_000,
        bank_info: {
            bank_name: "MB Bank",
            account_number: "***2345",
            account_holder: "LE THI TRANG",
        },
        status: WithdrawalStatus.PENDING,
        admin_note: null,
        processed_by: null,
        processed_at: null,
        created_at: "2025-02-11T08:30:00Z",
    },
    {
        id: "withdraw-004",
        user_id: "user-004",
        amount: 1_200_000,
        bank_info: {
            bank_name: "ACB",
            account_number: "***6789",
            account_holder: "DAO PHUONG ANH",
        },
        status: WithdrawalStatus.PROCESSING,
        admin_note: null,
        processed_by: "admin-001",
        processed_at: null,
        created_at: "2025-02-09T16:00:00Z",
    },
];

// ─── Earnings Chart Data (Last 30 days) ──────────────────────────────────────

export const MOCK_EARNINGS_CHART: EarningsDataPoint[] = Array.from(
    { length: 30 },
    (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
            date: date.toISOString().split("T")[0],
            amount: Math.floor(Math.random() * 150_000) + 10_000,
        };
    }
);

// ─── Admin KPI Data ──────────────────────────────────────────────────────────

export const MOCK_ADMIN_KPIS = {
    totalGMV: 125_400_000,
    totalPayouts: 8_750_000,
    activeUsers: 1_247,
    pendingWithdrawals: 3,
    totalOrders: 3_891,
    conversionRate: 4.2,
};

// ─── Social Proof Data ───────────────────────────────────────────────────────

export const MOCK_SOCIAL_PROOF = [
    { name: "Minh N.", amount: 125_000, platform: "Shopee" },
    { name: "Trang L.", amount: 89_000, platform: "Lazada" },
    { name: "Hoàng V.", amount: 230_000, platform: "TikTok Shop" },
    { name: "Phương A.", amount: 67_000, platform: "Tiki" },
    { name: "Đức T.", amount: 195_000, platform: "Shopee" },
    { name: "Lan P.", amount: 148_000, platform: "Lazada" },
    { name: "Tuấn K.", amount: 310_000, platform: "TikTok Shop" },
    { name: "Hà M.", amount: 78_000, platform: "Shopee" },
];
