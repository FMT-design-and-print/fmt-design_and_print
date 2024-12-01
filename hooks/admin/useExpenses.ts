import { Expenses } from "@/types/sales-expenses";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

const EXPENSES_QUERY_KEY = ["expenses"] as const;

async function fetchExpenses() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Expenses[];
}

export function useExpenses() {
  const {
    data: expenses,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: EXPENSES_QUERY_KEY,
    queryFn: fetchExpenses,
  });

  return {
    expenses,
    loading,
    error: error as Error | null,
  };
}

export { EXPENSES_QUERY_KEY };
