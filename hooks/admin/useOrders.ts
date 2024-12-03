import { createClient } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { IOrder, ICustomOrder } from "@/types/order";

const supabase = createClient();

export const useOrders = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return useQuery<IOrder[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCustomOrders = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabase
      .channel("custom-orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "custom-orders" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["custom-orders"] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return useQuery<ICustomOrder[]>({
    queryKey: ["custom-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom-orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
