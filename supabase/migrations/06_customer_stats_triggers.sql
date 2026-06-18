-- Migration to automatically update customer stats (total_spent, total_debt) based on their sales.

-- 1. Create the trigger function
CREATE OR REPLACE FUNCTION public.update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- If an INSERT or UPDATE happens
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF NEW.customer_id IS NOT NULL THEN
            UPDATE public.customers
            SET 
                total_spent = (SELECT COALESCE(SUM("totalAmount"), 0) FROM public.sales WHERE customer_id = NEW.customer_id AND "isDeleted" = false),
                total_debt = (SELECT COALESCE(SUM("balanceDue"), 0) FROM public.sales WHERE customer_id = NEW.customer_id AND "isDeleted" = false)
            WHERE id = NEW.customer_id;
        END IF;
        
        -- If the customer_id was changed to another customer, update the old customer as well
        IF TG_OP = 'UPDATE' AND OLD.customer_id IS NOT NULL AND OLD.customer_id != NEW.customer_id THEN
            UPDATE public.customers
            SET 
                total_spent = (SELECT COALESCE(SUM("totalAmount"), 0) FROM public.sales WHERE customer_id = OLD.customer_id AND "isDeleted" = false),
                total_debt = (SELECT COALESCE(SUM("balanceDue"), 0) FROM public.sales WHERE customer_id = OLD.customer_id AND "isDeleted" = false)
            WHERE id = OLD.customer_id;
        END IF;
    -- If a DELETE happens
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.customer_id IS NOT NULL THEN
            UPDATE public.customers
            SET 
                total_spent = (SELECT COALESCE(SUM("totalAmount"), 0) FROM public.sales WHERE customer_id = OLD.customer_id AND "isDeleted" = false),
                total_debt = (SELECT COALESCE(SUM("balanceDue"), 0) FROM public.sales WHERE customer_id = OLD.customer_id AND "isDeleted" = false)
            WHERE id = OLD.customer_id;
        END IF;
    END IF;
    
    RETURN NULL; -- AFTER trigger can return NULL
END;
$$ LANGUAGE plpgsql;

-- 2. Attach the trigger to the sales table
DROP TRIGGER IF EXISTS trigger_update_customer_stats ON public.sales;
CREATE TRIGGER trigger_update_customer_stats
AFTER INSERT OR UPDATE OR DELETE ON public.sales
FOR EACH ROW EXECUTE FUNCTION public.update_customer_stats();

-- 3. Run a one-time update for all existing customers to fix the current 0 values
UPDATE public.customers c
SET 
    total_spent = COALESCE((SELECT SUM("totalAmount") FROM public.sales s WHERE s.customer_id = c.id AND s."isDeleted" = false), 0),
    total_debt = COALESCE((SELECT SUM("balanceDue") FROM public.sales s WHERE s.customer_id = c.id AND s."isDeleted" = false), 0);
