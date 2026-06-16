-- RPC to calculate revenue by product type and category
CREATE OR REPLACE FUNCTION public.get_revenue_by_product_type(start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS TABLE (
    product_type TEXT,
    category TEXT,
    total_revenue NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH all_items AS (
        -- From sales (legacy single productType)
        SELECT s."productType" as pt, s."totalAmount" as amount
        FROM public.sales s
        WHERE s."isDeleted" = false 
        AND s.created_at >= start_date AND s.created_at <= end_date
        AND (s.items IS NULL OR jsonb_array_length(s.items) = 0)
        AND s."productType" IS NOT NULL
        
        UNION ALL
        
        -- From sales (new items array)
        SELECT item->>'productType' as pt, (item->>'totalAmount')::NUMERIC as amount
        FROM public.sales s,
             jsonb_array_elements(s.items) as item
        WHERE s."isDeleted" = false
        AND s.created_at >= start_date AND s.created_at <= end_date
        AND jsonb_array_length(s.items) > 0
    )
    SELECT 
        COALESCE(pt.name, a.pt) as product_type,
        COALESCE(pc.name, pt.category, 'Uncategorized') as category,
        SUM(a.amount) as total_revenue
    FROM all_items a
    LEFT JOIN public.product_types pt ON a.pt = pt.name
    LEFT JOIN public.product_categories pc ON pt.category_id = pc.id
    GROUP BY COALESCE(pt.name, a.pt), COALESCE(pc.name, pt.category, 'Uncategorized')
    ORDER BY total_revenue DESC;
END;
$$ LANGUAGE plpgsql;
