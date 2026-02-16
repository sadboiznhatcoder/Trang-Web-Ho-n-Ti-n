-- =============================================================================
-- CashbackTitan - Database Schema for Supabase (PostgreSQL)
-- =============================================================================
-- A Double-Entry Ledger System for financial integrity.
-- Deploy this to your Supabase project via the SQL Editor.
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'SUPPORT');
CREATE TYPE platform_type AS ENUM ('SHOPEE', 'LAZADA', 'TIKTOK', 'TIKI');
CREATE TYPE order_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PAID');
CREATE TYPE transaction_type AS ENUM (
  'CASHBACK_PENDING',
  'CASHBACK_APPROVED',
  'WITHDRAWAL_REQUEST',
  'WITHDRAWAL_PAID',
  'WITHDRAWAL_REJECTED'
);
CREATE TYPE withdrawal_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED');

-- =============================================================================
-- TABLE: users (extends Supabase auth.users)
-- =============================================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'USER',
  tier_level INTEGER NOT NULL DEFAULT 1 CHECK (tier_level BETWEEN 1 AND 5),
  referral_code TEXT UNIQUE DEFAULT UPPER(SUBSTRING(uuid_generate_v4()::text, 1, 8)),
  referred_by UUID REFERENCES public.users(id),
  metadata JSONB DEFAULT '{}',
  is_banned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- TABLE: wallets
-- =============================================================================
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  available_balance DECIMAL(15,2) NOT NULL DEFAULT 0.00 CHECK (available_balance >= 0),
  pending_balance DECIMAL(15,2) NOT NULL DEFAULT 0.00 CHECK (pending_balance >= 0),
  locked_balance DECIMAL(15,2) NOT NULL DEFAULT 0.00 CHECK (locked_balance >= 0),
  lifetime_earnings DECIMAL(15,2) NOT NULL DEFAULT 0.00 CHECK (lifetime_earnings >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create wallet when user is created
CREATE OR REPLACE FUNCTION public.handle_new_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallets (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created_wallet
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_wallet();

-- =============================================================================
-- TABLE: tracking_links
-- =============================================================================
CREATE TABLE public.tracking_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  original_url TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  short_code TEXT NOT NULL UNIQUE,
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tracking_links_user ON public.tracking_links(user_id);
CREATE INDEX idx_tracking_links_short_code ON public.tracking_links(short_code);

-- =============================================================================
-- TABLE: orders
-- =============================================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_order_id TEXT,
  tracking_link_id UUID REFERENCES public.tracking_links(id),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  gmv DECIMAL(15,2) NOT NULL DEFAULT 0.00,            -- Gross Merchandise Value
  commission_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00, -- Total commission from platform
  user_commission DECIMAL(15,2) NOT NULL DEFAULT 0.00,   -- 50% to user
  system_fee DECIMAL(15,2) NOT NULL DEFAULT 0.00,        -- 40% system
  tax DECIMAL(15,2) NOT NULL DEFAULT 0.00,               -- 10% tax
  status order_status NOT NULL DEFAULT 'PENDING',
  estimated_payout_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON public.orders(user_id);

-- =============================================================================
-- TABLE: transactions (The Double-Entry Ledger)
-- =============================================================================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,  -- Positive = credit, Negative = debit
  type transaction_type NOT NULL,
  reference_id UUID,              -- Links to order_id or withdrawal_id
  description TEXT,
  status TEXT NOT NULL DEFAULT 'COMPLETED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON public.transactions(user_id);
CREATE INDEX idx_transactions_type ON public.transactions(type);

-- =============================================================================
-- TABLE: withdrawals
-- =============================================================================
CREATE TABLE public.withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  bank_info JSONB NOT NULL DEFAULT '{}',  -- { bank_name, account_number, account_holder }
  status withdrawal_status NOT NULL DEFAULT 'PENDING',
  admin_note TEXT,
  processed_by UUID REFERENCES public.users(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_withdrawals_user ON public.withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON public.withdrawals(status);

-- =============================================================================
-- TABLE: audit_logs (Security)
-- =============================================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.users(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,       -- 'user', 'withdrawal', 'order'
  target_id UUID NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_admin ON public.audit_logs(admin_id);

-- =============================================================================
-- TRIGGER: Commission Splitting (The 50/40/10 Rule)
-- When an order is approved, split commission and update wallet.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_order_commission()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when status changes to APPROVED
  IF NEW.status = 'APPROVED' AND (OLD.status IS NULL OR OLD.status != 'APPROVED') THEN
    -- Calculate the 50/40/10 split
    NEW.user_commission := ROUND(NEW.commission_amount * 0.50, 2);
    NEW.system_fee := ROUND(NEW.commission_amount * 0.40, 2);
    NEW.tax := ROUND(NEW.commission_amount * 0.10, 2);

    -- Add to user's pending balance
    UPDATE public.wallets
    SET pending_balance = pending_balance + NEW.user_commission,
        lifetime_earnings = lifetime_earnings + NEW.user_commission,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;

    -- Record the ledger entry
    INSERT INTO public.transactions (user_id, amount, type, reference_id, description)
    VALUES (
      NEW.user_id,
      NEW.user_commission,
      'CASHBACK_PENDING',
      NEW.id,
      'Cashback from ' || NEW.platform || ' order #' || COALESCE(NEW.external_order_id, NEW.id::text)
    );
  END IF;

  -- When order is PAID, move from pending to available
  IF NEW.status = 'PAID' AND OLD.status = 'APPROVED' THEN
    UPDATE public.wallets
    SET pending_balance = pending_balance - NEW.user_commission,
        available_balance = available_balance + NEW.user_commission,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;

    INSERT INTO public.transactions (user_id, amount, type, reference_id, description)
    VALUES (
      NEW.user_id,
      NEW.user_commission,
      'CASHBACK_APPROVED',
      NEW.id,
      'Cashback approved for ' || NEW.platform || ' order'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_status_change
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_commission();

-- Also handle INSERT with APPROVED status
CREATE TRIGGER on_order_insert
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_commission();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can read their own data; Admins can read all
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'
  ));

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Wallet: users see only their own
CREATE POLICY "Users can view own wallet"
  ON public.wallets FOR SELECT
  USING (user_id = auth.uid());

-- Tracking links: users see only their own
CREATE POLICY "Users can manage own links"
  ON public.tracking_links FOR ALL
  USING (user_id = auth.uid());

-- Transactions: users see only their own
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (user_id = auth.uid());

-- Orders: users see only their own
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (user_id = auth.uid());

-- Withdrawals: users see only their own
CREATE POLICY "Users can manage own withdrawals"
  ON public.withdrawals FOR ALL
  USING (user_id = auth.uid());

-- Audit logs: admins only
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'
  ));

CREATE POLICY "Admins can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'
  ));
