import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export interface ProductRevenue {
  product_type: string;
  category: string;
  total_revenue: number;
}

export const useRevenueByProductType = (startDate: string | null, endDate: string | null) => {
  const supabase = createClient();

  return useQuery({
    queryKey: ["revenue-by-product-type", startDate, endDate],
    queryFn: async () => {
      // Ensure we have a valid date range to query
      // If dates are not provided, we can either default to a very wide range or return empty.
      // Assuming we default to all time if no filter is applied
      const start = startDate || new Date(0).toISOString();
      const end = endDate || new Date().toISOString();

      const { data, error } = await supabase.rpc("get_revenue_by_product_type", {
        start_date: start,
        end_date: end,
      });

      if (error) {
        console.error("Error fetching revenue by product type:", error);
        throw error;
      }

      return data as ProductRevenue[];
    },
    // We want to run this even if dates are null, as we provide fallbacks
  });
};
