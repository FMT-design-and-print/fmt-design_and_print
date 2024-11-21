-- This function returns the count of orders and custom-orders grouped by their status.
-- It uses UNION ALL to combine the counts from both the 'orders' and 'custom-orders' tables.

CREATE OR REPLACE FUNCTION get_order_count_by_status()
RETURNS TABLE(source_table text, status text, count integer) AS $$
  (
    SELECT 'orders' AS source_table, status, COUNT(*) AS count
    FROM orders
    GROUP BY status
    UNION ALL
    SELECT 'custom-orders' AS source_table, status, COUNT(*) AS count
    FROM "custom-orders"
    GROUP BY status
  );
$$ LANGUAGE sql;


-- This function returns the total count of orders from two tables: 'orders' and 'custom-orders'.
-- It uses a UNION to combine the results from both tables and applies the COUNT aggregate function to get the total number of orders.
CREATE OR REPLACE FUNCTION get_total_order_count()
RETURNS TABLE(table_name text, order_count integer) AS $$
  (
    SELECT 'orders' AS table_name, COUNT(*) AS count
    FROM orders
    UNION ALL
    SELECT 'custom_orders' AS table_name, COUNT(*) AS count
    FROM "custom-orders"
  );
$$ LANGUAGE sql;
