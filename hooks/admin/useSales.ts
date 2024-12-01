import { ISales } from "@/types/sales-expenses";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

const SALES_QUERY_KEY = ["sales"] as const;

async function fetchSales() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sales")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as ISales[];
}

export function useSales() {
  const {
    data: sales,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: SALES_QUERY_KEY,
    queryFn: fetchSales,
  });

  return {
    sales,
    loading,
    error: error as Error | null,
  };
}

// Export the query key for invalidation
export { SALES_QUERY_KEY };
