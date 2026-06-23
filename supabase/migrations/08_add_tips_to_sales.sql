-- Add tip_amount column to sales table
ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS tip_amount NUMERIC DEFAULT 0;

-- Update financial summary RPC to include tips
CREATE OR REPLACE FUNCTION public.get_financial_summary_report(start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS JSON AS $$
DECLARE
    total_revenue NUMERIC := 0;
    total_expenses NUMERIC := 0;
    total_debts NUMERIC := 0;
    total_bad_debts NUMERIC := 0;
    total_tips NUMERIC := 0;
    total_sales_count INT := 0;
    total_orders_count INT := 0;
    total_custom_orders_count INT := 0;
BEGIN
    -- Calculate Revenue, Tips, and Counts
    SELECT COALESCE(SUM("totalAmount"), 0), COUNT(id), COALESCE(SUM("tip_amount"), 0) 
    INTO total_revenue, total_sales_count, total_tips
    FROM public.sales 
    WHERE "isDeleted" = false AND "created_at" >= start_date AND "created_at" <= end_date;

    -- For this simple report, let's just combine everything into revenue like dashboard
    SELECT COALESCE(SUM("totalAmount"), 0) INTO total_revenue
    FROM (
        SELECT "totalAmount" FROM public.sales WHERE "isDeleted" = false AND "created_at" >= start_date AND "created_at" <= end_date
    ) AS all_revenue;

    -- Calculate Debts
    SELECT COALESCE(SUM(CASE WHEN "balanceDue" > 0 THEN "balanceDue" ELSE 0 END), 0) INTO total_debts
    FROM (
        SELECT "balanceDue" FROM public.sales WHERE "isDeleted" = false AND "created_at" >= start_date AND "created_at" <= end_date
    ) AS all_debts;

    -- Calculate Expenses
    SELECT COALESCE(SUM("amount"), 0) INTO total_expenses
    FROM public.expenses
    WHERE "isDeleted" = false AND "created_at" >= start_date AND "created_at" <= end_date;

    -- Calculate Bad Debts
    SELECT COALESCE(SUM("amount"), 0) INTO total_bad_debts
    FROM public.expenses
    WHERE "isDeleted" = false AND ("isBadDebt" = true OR "is_bad_debt" = true) AND "created_at" >= start_date AND "created_at" <= end_date;

    RETURN json_build_object(
        'totalRevenue', total_revenue,
        'totalExpenses', total_expenses,
        'totalProfit', total_revenue - total_expenses,
        'totalDebts', total_debts,
        'totalBadDebts', total_bad_debts,
        'totalTips', total_tips,
        'salesCount', total_sales_count,
        'ordersCount', total_orders_count,
        'customOrdersCount', total_custom_orders_count
    );
END;
$$ LANGUAGE plpgsql;
