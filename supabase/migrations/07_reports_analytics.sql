-- RPC Functions for Reports Hub

-- 1. Financial Summary Report
CREATE OR REPLACE FUNCTION public.get_financial_summary_report(start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS JSON AS $$
DECLARE
    total_revenue NUMERIC := 0;
    total_expenses NUMERIC := 0;
    total_debts NUMERIC := 0;
    total_bad_debts NUMERIC := 0;
    total_sales_count INT := 0;
    total_orders_count INT := 0;
    total_custom_orders_count INT := 0;
BEGIN
    -- Calculate Revenue and Counts
    SELECT COALESCE(SUM("totalAmount"), 0), COUNT(id) INTO total_revenue, total_sales_count
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

    -- Counts
    SELECT COUNT(id) INTO total_sales_count FROM public.sales WHERE "isDeleted" = false AND "created_at" >= start_date AND "created_at" <= end_date;
    -- Ignore orders for now to prevent column errors
    -- SELECT COUNT(id) INTO total_orders_count FROM public.orders WHERE "isDeleted" = false AND "status" NOT IN ('cancelled', 'pending-cancellation') AND "created_at" >= start_date AND "created_at" <= end_date;
    -- SELECT COUNT(id) INTO total_custom_orders_count FROM public."custom-orders" WHERE "isDeleted" = false AND "status" NOT IN ('cancelled', 'pending-cancellation') AND "created_at" >= start_date AND "created_at" <= end_date;

    RETURN json_build_object(
        'totalRevenue', total_revenue,
        'totalExpenses', total_expenses,
        'totalProfit', total_revenue - total_expenses,
        'totalDebts', total_debts,
        'totalBadDebts', total_bad_debts,
        'salesCount', total_sales_count,
        'ordersCount', total_orders_count,
        'customOrdersCount', total_custom_orders_count
    );
END;
$$ LANGUAGE plpgsql;

-- 2. Top Customers Report
CREATE OR REPLACE FUNCTION public.get_top_customers_report(start_date TIMESTAMP, end_date TIMESTAMP, limit_count INT DEFAULT 10)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(row_to_json(t)) INTO result
    FROM (
        SELECT 
            c.id, 
            c.name, 
            c.phone,
            COALESCE(SUM(s."totalAmount"), 0) as period_spent,
            COALESCE(SUM(CASE WHEN s."balanceDue" > 0 THEN s."balanceDue" ELSE 0 END), 0) as period_debt
        FROM public.customers c
        LEFT JOIN (
            SELECT customer_id, "totalAmount", "balanceDue" FROM public.sales WHERE "isDeleted" = false AND "created_at" >= start_date AND "created_at" <= end_date
            -- Removed orders and custom-orders to prevent missing column errors
        ) s ON c.id = s.customer_id
        GROUP BY c.id, c.name, c.phone
        HAVING COALESCE(SUM(s."totalAmount"), 0) > 0
        ORDER BY period_spent DESC
        LIMIT limit_count
    ) t;

    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- 3. Top Performing Categories / Services
CREATE OR REPLACE FUNCTION public.get_top_performing_services_report(start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(row_to_json(t)) INTO result
    FROM (
        WITH all_items AS (
            SELECT s."productType" as pt, s."totalAmount" as amount
            FROM public.sales s
            WHERE s."isDeleted" = false 
            AND s.created_at >= start_date AND s.created_at <= end_date
            AND (s.items IS NULL OR jsonb_array_length(s.items) = 0)
            AND s."productType" IS NOT NULL
            
            UNION ALL
            
            SELECT item->>'productType' as pt, (item->>'totalAmount')::NUMERIC as amount
            FROM public.sales s,
                 jsonb_array_elements(s.items) as item
            WHERE s."isDeleted" = false
            AND s.created_at >= start_date AND s.created_at <= end_date
            AND jsonb_array_length(s.items) > 0
        )
        SELECT 
            COALESCE(pc.name, pt.category, 'Uncategorized') as category,
            SUM(a.amount) as total_revenue
        FROM all_items a
        LEFT JOIN public.product_types pt ON a.pt = pt.name
        LEFT JOIN public.product_categories pc ON pt.category_id = pc.id
        GROUP BY COALESCE(pc.name, pt.category, 'Uncategorized')
        ORDER BY total_revenue DESC
    ) t;

    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- 3.5 Top Performing Product Types
CREATE OR REPLACE FUNCTION public.get_top_performing_product_types_report(start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(row_to_json(t)) INTO result
    FROM (
        WITH all_items AS (
            SELECT s."productType" as pt, s."totalAmount" as amount
            FROM public.sales s
            WHERE s."isDeleted" = false 
            AND s.created_at >= start_date AND s.created_at <= end_date
            AND (s.items IS NULL OR jsonb_array_length(s.items) = 0)
            AND s."productType" IS NOT NULL
            
            UNION ALL
            
            SELECT item->>'productType' as pt, (item->>'totalAmount')::NUMERIC as amount
            FROM public.sales s,
                 jsonb_array_elements(s.items) as item
            WHERE s."isDeleted" = false
            AND s.created_at >= start_date AND s.created_at <= end_date
            AND jsonb_array_length(s.items) > 0
        )
        SELECT 
            COALESCE(pt.name, a.pt, 'Uncategorized') as product_type,
            SUM(a.amount) as total_revenue
        FROM all_items a
        LEFT JOIN public.product_types pt ON a.pt = pt.name
        GROUP BY COALESCE(pt.name, a.pt, 'Uncategorized')
        ORDER BY total_revenue DESC
    ) t;

    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- 4. Expenses by Type (Fixed column name to "type")
CREATE OR REPLACE FUNCTION public.get_expenses_by_type_report(start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(row_to_json(t)) INTO result
    FROM (
        SELECT 
            COALESCE("type", 'Uncategorized') as expense_type,
            SUM(amount) as total_amount,
            COUNT(id) as expense_count
        FROM public.expenses
        WHERE "isDeleted" = false AND "created_at" >= start_date AND "created_at" <= end_date
        GROUP BY "type"
        ORDER BY total_amount DESC
    ) t;

    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- 5. Detailed Service Performance Search (Categories and Product Types)
CREATE OR REPLACE FUNCTION public.get_detailed_service_performance_report(start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(row_to_json(t)) INTO result
    FROM (
        WITH all_items AS (
            SELECT s."productType" as pt, s."totalAmount" as amount, s.id as sale_id
            FROM public.sales s
            WHERE s."isDeleted" = false 
            AND s.created_at >= start_date AND s.created_at <= end_date
            AND (s.items IS NULL OR jsonb_array_length(s.items) = 0)
            AND s."productType" IS NOT NULL
            
            UNION ALL
            
            SELECT item->>'productType' as pt, (item->>'totalAmount')::NUMERIC as amount, s.id as sale_id
            FROM public.sales s,
                 jsonb_array_elements(s.items) as item
            WHERE s."isDeleted" = false
            AND s.created_at >= start_date AND s.created_at <= end_date
            AND jsonb_array_length(s.items) > 0
        )
        SELECT 
            COALESCE(pc.name, pt.category, 'Uncategorized') as category,
            COALESCE(pt.name, a.pt, 'Uncategorized') as product_type,
            COUNT(DISTINCT a.sale_id) as sales_count,
            SUM(a.amount) as total_revenue
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
