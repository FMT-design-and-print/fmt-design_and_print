import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { IOrder } from "@/types/order";

const fetchOrders = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, orderId, items, totalAmount, status, deliveryDetails"
    )
    .order("created_at", { ascending: false })
    .returns<IOrder[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useOrders = () => {
  const {
    data: orders,
    error,
    isLoading,
  } = useQuery({ queryKey: ["orders", "admin"], queryFn: () => fetchOrders() });
  return { orders, error, isLoading };
};
