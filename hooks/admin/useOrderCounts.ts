/* eslint-disable @typescript-eslint/no-explicit-any */
import { Channels } from "@/constants/channels";
import { statusColor } from "@/constants/status-colors";
import { formatOrderStatus } from "@/functions/orders";
import { OrderStatus } from "@/types/order";
import { createClient } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const supabase = createClient();

type StatusStat = {
  source_table: "orders" | "custom-orders";
  status: OrderStatus;
  count: number;
};

type OrderTableStat = {
  table_name: "orders" | "custom_orders";
  count: number;
};

const orderTableMap = {
  orders: "Orders",
  custom_orders: "Custom Orders",
};

async function fetchRpc<T>(rpcName: string): Promise<T[]> {
  const { data, error } = await supabase.rpc<any, null>(rpcName).returns<T[]>();

  if (error) {
    // TODO: send to sentry
    console.error(`${rpcName} error:`, error.message);
    return [];
  }

  return (data as T[]) || [];
}

function useRealtimeSubscription(
  tables: { tableName: string; channel: string }[],
  queryKeyArr: string[]
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleTableChange = () => {
      queryClient.invalidateQueries({ queryKey: queryKeyArr });
    };

    const channels = tables.map((table) =>
      supabase
        .channel(table.channel)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: table.tableName },
          handleTableChange
        )
        .subscribe()
    );

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [queryKeyArr, tables, queryClient]);
}

export const useOrderCountByStatus = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["order-count-by-status", "admin"],
    queryFn: async () => {
      const data = await fetchRpc<StatusStat>("get_order_count_by_status");

      const result = data.map((stat) => ({
        source_table: stat.source_table,
        title: formatOrderStatus(stat.status),
        value: stat.count,
        color: statusColor[stat.status],
      }));

      return {
        orders: result.filter((item) => item.source_table === "orders"),
        customOrders: result.filter(
          (item) => item.source_table === "custom-orders"
        ),
      };
    },
  });

  useRealtimeSubscription(
    [
      { tableName: "orders", channel: Channels.OrdersCountByStatus },
      {
        tableName: "custom-orders",
        channel: Channels.CustomOrdersCountByStatus,
      },
    ],
    ["order-count-by-status", "admin"]
  );

  return {
    orders: data?.orders ?? [],
    customOrders: data?.customOrders ?? [],
    error,
    isLoading,
  };
};

// Hook for fetching and subscribing to total order counts
export const useOrderCount = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["order-count", "admin"],
    queryFn: async () =>
      await fetchRpc<OrderTableStat>("get_total_order_count").then((data) =>
        data.map((stat) => ({
          title: orderTableMap[stat.table_name],
          value: stat.count,
        }))
      ),
  });

  useRealtimeSubscription(
    [
      { tableName: "orders", channel: Channels.OrdersCount },
      { tableName: "custom-orders", channel: Channels.CustomOrdersCount },
    ],
    ["order-count", "admin"]
  );

  return { orders: data ?? [], error, isLoading };
};
