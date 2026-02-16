-- =============================================================================
-- V Cashback — Database Schema (Supabase/PostgreSQL)
-- =============================================================================

-- ─── Profiles ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       VARCHAR(10) UNIQUE NOT NULL,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  status      TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'BANNED')),
  balance_available DECIMAL(15, 0) NOT NULL DEFAULT 0,
  balance_pending   DECIMAL(15, 0) NOT NULL DEFAULT 0,
  last_login  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ─── Auth Credentials ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auth_credentials (
  user_id       UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Tracking Links ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tracking_links (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  original_url  TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  short_code    VARCHAR(12) UNIQUE NOT NULL,
  platform      TEXT NOT NULL CHECK (platform IN ('SHOPEE', 'LAZADA', 'TIKTOK', 'TIKI')),
  click_count   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_links_user ON tracking_links(user_id);
CREATE INDEX idx_links_short ON tracking_links(short_code);

-- ─── Orders (Cashback Tracking) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  link_id           UUID REFERENCES tracking_links(id),
  platform          TEXT NOT NULL CHECK (platform IN ('SHOPEE', 'LAZADA', 'TIKTOK', 'TIKI')),
  external_order_id TEXT NOT NULL,
  gmv               DECIMAL(15, 0) NOT NULL,
  commission_rate   DECIMAL(5, 4) NOT NULL,
  total_commission  DECIMAL(15, 0) NOT NULL,
  platform_share    DECIMAL(15, 0) NOT NULL,
  user_commission   DECIMAL(15, 0) NOT NULL,
  status            TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'PAID')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- ─── Transactions (Ledger) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN (
    'CASHBACK_PENDING', 'CASHBACK_APPROVED',
    'WITHDRAWAL_REQUEST', 'WITHDRAWAL_PAID', 'WITHDRAWAL_REJECTED',
    'MANUAL_PAYOUT', 'BONUS'
  )),
  amount        DECIMAL(15, 0) NOT NULL,
  balance_after DECIMAL(15, 0) NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  reference_id  UUID,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_txn_user ON transactions(user_id);
CREATE INDEX idx_txn_type ON transactions(type);

-- ─── Withdrawals ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS withdrawals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount          DECIMAL(15, 0) NOT NULL,
  bank_name       TEXT NOT NULL,
  account_number  TEXT NOT NULL,
  account_holder  TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED')),
  admin_note      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at    TIMESTAMPTZ
);

CREATE INDEX idx_wd_user ON withdrawals(user_id);
CREATE INDEX idx_wd_status ON withdrawals(status);
