-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    total_spent NUMERIC DEFAULT 0,
    total_debt NUMERIC DEFAULT 0,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdBy" JSONB,
    "updatedBy" JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_types table for manual sales/expenses
CREATE TABLE IF NOT EXISTS public.product_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdBy" JSONB,
    "updatedBy" JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alter sales table
ALTER TABLE public.sales 
ADD COLUMN IF NOT EXISTS "amountPaid" NUMERIC,
ADD COLUMN IF NOT EXISTS "balanceDue" NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS "customer_id" UUID REFERENCES public.customers(id),
ADD COLUMN IF NOT EXISTS "updatedBy" JSONB,
ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN DEFAULT false;

-- Alter orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS "amountPaid" NUMERIC,
ADD COLUMN IF NOT EXISTS "balanceDue" NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS "updatedBy" JSONB,
ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN DEFAULT false;

-- Alter custom-orders table
ALTER TABLE public."custom-orders" 
ADD COLUMN IF NOT EXISTS "amountPaid" NUMERIC,
ADD COLUMN IF NOT EXISTS "balanceDue" NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS "updatedBy" JSONB,
ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN DEFAULT false;

-- Alter expenses table
ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS "isBadDebt" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "badDebtReference" TEXT,
ADD COLUMN IF NOT EXISTS "updatedBy" JSONB,
ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN DEFAULT false;

-- Update existing sales/orders to set amountPaid = totalAmount initially
UPDATE public.sales SET "amountPaid" = "totalAmount" WHERE "amountPaid" IS NULL;
UPDATE public.orders SET "amountPaid" = "totalAmount" WHERE "amountPaid" IS NULL;
UPDATE public."custom-orders" SET "amountPaid" = "totalAmount" WHERE "amountPaid" IS NULL;

-- Create payment_history table to track partial payments / debt clearance
CREATE TABLE IF NOT EXISTS public.payment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id),
    reference_type TEXT NOT NULL, -- 'sales', 'orders', 'custom-orders'
    reference_id TEXT NOT NULL, -- ID of the sale or order
    amount_paid NUMERIC NOT NULL,
    payment_method TEXT,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdBy" JSONB,
    "updatedBy" JSONB
);

-- Create RPC Functions for Dashboard
CREATE OR REPLACE FUNCTION public.get_dashboard_summary(start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS JSON AS $$
DECLARE
    total_revenue NUMERIC := 0;
    total_expenses NUMERIC := 0;
    total_debts NUMERIC := 0;
    total_bad_debts NUMERIC := 0;
BEGIN
    -- Calculate Revenue (Total Amount of all non-cancelled & non-deleted orders & sales)
    SELECT COALESCE(SUM("totalAmount"), 0) INTO total_revenue
    FROM (
        SELECT "totalAmount" FROM public.sales WHERE "isDeleted" = false AND "created_at" >= start_date AND "created_at" <= end_date
        UNION ALL
        SELECT "totalAmount" FROM public.orders WHERE "isDeleted" = false AND "status" NOT IN ('cancelled', 'pending-cancellation') AND "created_at" >= start_date AND "created_at" <= end_date
        UNION ALL
        SELECT "totalAmount" FROM public."custom-orders" WHERE "isDeleted" = false AND "status" NOT IN ('cancelled', 'pending-cancellation') AND "created_at" >= start_date AND "created_at" <= end_date
    ) AS all_revenue;

    -- Calculate Debts (Balance Due)
    SELECT COALESCE(SUM("balanceDue"), 0) INTO total_debts
    FROM (
        SELECT "balanceDue" FROM public.sales WHERE "isDeleted" = false AND "created_at" >= start_date AND "created_at" <= end_date
        UNION ALL
        SELECT "balanceDue" FROM public.orders WHERE "isDeleted" = false AND "status" NOT IN ('cancelled', 'pending-cancellation') AND "created_at" >= start_date AND "created_at" <= end_date
        UNION ALL
        SELECT "balanceDue" FROM public."custom-orders" WHERE "isDeleted" = false AND "status" NOT IN ('cancelled', 'pending-cancellation') AND "created_at" >= start_date AND "created_at" <= end_date
    ) AS all_debts;

    -- Calculate Expenses
    SELECT COALESCE(SUM("amount"), 0) INTO total_expenses
    FROM public.expenses
    WHERE "isDeleted" = false AND "created_at" >= start_date AND "created_at" <= end_date;

    -- Calculate Bad Debts (Subset of expenses)
    SELECT COALESCE(SUM("amount"), 0) INTO total_bad_debts
    FROM public.expenses
    WHERE "isDeleted" = false AND "isBadDebt" = true AND "created_at" >= start_date AND "created_at" <= end_date;

    RETURN json_build_object(
        'totalRevenue', total_revenue,
        'totalExpenses', total_expenses,
        'totalProfit', total_revenue - total_expenses,
        'totalDebts', total_debts,
        'totalBadDebts', total_bad_debts
    );
END;
$$ LANGUAGE plpgsql;