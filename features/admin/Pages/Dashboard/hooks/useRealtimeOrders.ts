import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { IOrder, ICustomOrder, OrderStatus } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { orderStatuses } from "@/constants/order-statuses";

type DateFilter = "today" | "3days" | "7days" | "15days" | "30days";

export function useRealtimeOrders(
  table: "orders" | "custom-orders",
  dateFilter: DateFilter
) {
  const supabase = createClient();
  const [realtimeData, setRealtimeData] = useState<(IOrder | ICustomOrder)[]>(
    []
  );

  const getDateRange = (filter: DateFilter) => {
    const now = new Date();
    const days = parseInt(filter.replace(/[^0-9]/g, "")) || 1;
    const start = new Date(now);
    start.setDate(start.getDate() - days);
    return { start, end: now };
  };

  const { data: initialData } = useQuery({
    queryKey: ["orders", table, dateFilter],
    queryFn: async () => {
      const { start, end } = getDateRange(dateFilter);
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (initialData) {
      setRealtimeData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const channel = supabase
      .channel("orders-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setRealtimeData((prev) => [
              payload.new as IOrder | ICustomOrder,
              ...prev,
            ]);
          } else if (payload.eventType === "UPDATE") {
            setRealtimeData((prev) =>
              prev.map((item) =>
                item.id === payload.new.id
                  ? (payload.new as IOrder | ICustomOrder)
                  : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setRealtimeData((prev) =>
              prev.filter((item) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, table]);

  const statusCounts = orderStatuses.reduce(
    (acc, status) => {
      acc[status] = 0;
      return acc;
    },
    {} as Record<OrderStatus, number>
  );

  realtimeData.forEach((order) => {
    if (order.status) {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    }
  });

  return {
    orders: realtimeData,
    statusCounts,
  };
}
