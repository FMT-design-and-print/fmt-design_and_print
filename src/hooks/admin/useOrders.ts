import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { ICustomOrder, IOrder } from "@/types/order";

const fetchOrders = async (tableName: "orders" | "custom-orders") => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .order("created_at", { ascending: false })
    .returns<IOrder[] | ICustomOrder[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useOrders = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["orders", "admin"],
    queryFn: () => fetchOrders("orders"),
  });
  const orders = data as IOrder[] | undefined;
  return { orders, error, isLoading };
};

export const useCustomOrders = () => {
  const {
    data: orders,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["custom-orders", "admin"],
    queryFn: () => fetchOrders("custom-orders"),
  });
  const customerOrders = orders as ICustomOrder[] | undefined;
  return { customerOrders, error, isLoading };
};
