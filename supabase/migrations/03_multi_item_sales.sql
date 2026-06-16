-- Add items JSONB array to sales table to support multi-item sales
ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS "items" JSONB DEFAULT '[]'::jsonb;

-- Update the RPC functions to account for the new multi-item structure

CREATE OR REPLACE FUNCTION public.get_dashboard_summary(start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS JSON AS $$
DECLARE
    total_revenue NUMERIC := 0;
    total_expenses NUMERIC := 0;
    total_debts NUMERIC := 0;
    total_bad_debts NUMERIC := 0;
BEGIN
    -- Calculate Revenue
    SELECT COALESCE(SUM("totalAmount"), 0) INTO total_revenue
    FROM (
        SELECT "totalAmount" FROM public.sales WHERE "isDeleted" = false AND "created_at" >= start_date AND "created_at" <= end_date
        UNION ALL
        SELECT "totalAmount" FROM public.orders WHERE "isDeleted" = false AND "status" NOT IN ('cancelled', 'pending-cancellation') AND "created_at" >= start_date AND "created_at" <= end_date
        UNION ALL
        SELECT "totalAmount" FROM public."custom-orders" WHERE "isDeleted" = false AND "status" NOT IN ('cancelled', 'pending-cancellation') AND "created_at" >= start_date AND "created_at" <= end_date
    ) AS all_revenue;

    -- Calculate Debts
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

    -- Calculate Bad Debts
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
