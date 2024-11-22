import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { ICustomOrder, IOrder } from "@/types/order";
import { useEffect } from "react";
import { Channels } from "@/constants/channels";

const supabase = createClient();

const fetchOrders = async (tableName: "orders" | "custom-orders") => {
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
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["orders", "admin"],
    queryFn: () => fetchOrders("orders"),
  });
  const orders = data as IOrder[] | undefined;

  useEffect(() => {
    const handleTableChange = () => {
      queryClient.invalidateQueries({
        queryKey: ["orders", "admin"],
      });
    };

    const ordersChannel = supabase
      .channel(Channels.AdminOrders)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        handleTableChange
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [queryClient]);

  return { orders, error, isLoading };
};

export const useCustomOrders = () => {
  const queryClient = useQueryClient();

  const {
    data: orders,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["custom-orders", "admin"],
    queryFn: () => fetchOrders("custom-orders"),
  });
  const customerOrders = orders as ICustomOrder[] | undefined;

  useEffect(() => {
    const handleTableChange = () => {
      queryClient.invalidateQueries({
        queryKey: ["custom-orders", "admin"],
      });
    };

    const ordersChannel = supabase
      .channel(Channels.AdminCustomOrders)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "custom-orders" },
        handleTableChange
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [queryClient]);

  return { customerOrders, error, isLoading };
};
