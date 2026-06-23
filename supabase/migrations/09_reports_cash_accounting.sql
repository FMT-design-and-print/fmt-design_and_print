-- 1. Financial Summary Report (Updated for Cash Accounting)
CREATE OR REPLACE FUNCTION public.get_financial_summary_report(start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS JSON AS $$
DECLARE
    total_revenue NUMERIC := 0;
    total_expenses NUMERIC := 0;
    total_debts NUMERIC := 0;
    total_bad_debts NUMERIC := 0;
    total_tips NUMERIC := 0;
    total_cash_received NUMERIC := 0;
    total_sales_count INT := 0;
    total_orders_count INT := 0;
    total_custom_orders_count INT := 0;
BEGIN
    -- Calculate Revenue, Tips, Cash Received, and Counts
    SELECT 
        COALESCE(SUM("totalAmount"), 0), 
        COUNT(id), 
        COALESCE(SUM("tip_amount"), 0),
        COALESCE(SUM("amountPaid"), 0)
    INTO total_revenue, total_sales_count, total_tips, total_cash_received
    FROM public.sales 
    WHERE "isDeleted" = false AND "created_at" >= start_date AND "created_at" <= end_date;

    -- Calculate Debts
    SELECT COALESCE(SUM(CASE WHEN "balanceDue" > 0 THEN "balanceDue" ELSE 0 END), 0) INTO total_debts
    FROM public.sales WHERE "isDeleted" = false AND "created_at" >= start_date AND "created_at" <= end_date;

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
        'totalCashReceived', total_cash_received,
        'salesCount', total_sales_count,
        'ordersCount', total_orders_count,
        'customOrdersCount', total_custom_orders_count
    );
END;
$$ LANGUAGE plpgsql;

-- 2. Detailed Service Performance Search (Categories and Product Types) - Updated with Tips and Cash
CREATE OR REPLACE FUNCTION public.get_detailed_service_performance_report(start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(row_to_json(t)) INTO result
    FROM (
        WITH all_items AS (
            SELECT
                s."productType" as pt,
                s."totalAmount" as amount,
                s.id as sale_id,
                COALESCE(s.tip_amount, 0) as tip_amount,
                COALESCE(s."amountPaid", 0) as amount_paid
            FROM public.sales s
            WHERE s."isDeleted" = false
            AND s.created_at >= start_date AND s.created_at <= end_date
            AND (s.items IS NULL OR jsonb_array_length(s.items) = 0)
            AND s."productType" IS NOT NULL

            UNION ALL

            SELECT
                item->>'productType' as pt,
                -- Pro-rata allocation of net sale revenue (post-discount) across items.
                -- Item.totalAmount is gross (unitPrice * qty); sale."totalAmount" is post-discount.
                -- Using items_gross_sum keeps the row totals aligned with the Financial Summary card.
                (s."totalAmount" * ((item->>'totalAmount')::NUMERIC / NULLIF(items_gross_sum.gross, 0))) as amount,
                s.id as sale_id,
                -- Pro-rata allocation of tips and amount paid for multi-item sales (use gross items basis)
                (COALESCE(s.tip_amount, 0) * ((item->>'totalAmount')::NUMERIC / NULLIF(items_gross_sum.gross, 0))) as tip_amount,
                (COALESCE(s."amountPaid", 0) * ((item->>'totalAmount')::NUMERIC / NULLIF(items_gross_sum.gross, 0))) as amount_paid
            FROM public.sales s,
                 jsonb_array_elements(s.items) as item,
                 LATERAL (
                    SELECT SUM((i->>'totalAmount')::NUMERIC) as gross
                    FROM jsonb_array_elements(s.items) as i
                 ) as items_gross_sum
            WHERE s."isDeleted" = false
            AND s.created_at >= start_date AND s.created_at <= end_date
            AND jsonb_array_length(s.items) > 0
        )
        SELECT 
            COALESCE(pc.name, pt.category, 'Uncategorized') as category,
            COALESCE(pt.name, a.pt, 'Uncategorized') as product_type,
            COUNT(DISTINCT a.sale_id) as sales_count,
            SUM(a.amount) as total_revenue,
            SUM(a.tip_amount) as total_tips,
            SUM(a.amount_paid) as total_cash_received
        FROM all_items a
        LEFT JOIN public.product_types pt ON a.pt = pt.name
        LEFT JOIN public.product_categories pc ON pt.category_id = pc.id
        GROUP BY 
            COALESCE(pc.name, pt.category, 'Uncategorized'),
            COALESCE(pt.name, a.pt, 'Uncategorized')
        ORDER BY total_revenue DESC
    ) t;

    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;