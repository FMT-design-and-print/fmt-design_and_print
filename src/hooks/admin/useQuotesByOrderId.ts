import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

const fetchQuotesByOrderId = async (orderId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("order_id", orderId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useQuotesByOrderId = (orderId: string) => {
  const {
    data: quotes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quotes", orderId],
    queryFn: () => fetchQuotesByOrderId(orderId),
    enabled: Boolean(orderId),
    retry: 2,
  });

  return { quotes, isLoading, error };
};
