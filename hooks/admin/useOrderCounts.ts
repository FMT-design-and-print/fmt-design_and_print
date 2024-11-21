import { statusColor } from "@/constants/status-colors";
import { formatOrderStatus } from "@/functions/orders";
import { OrderStatus } from "@/types/order";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

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

async function getOrderCountByStatus() {
  const { data, error } = await supabase
    .rpc<any, null>("get_order_count_by_status")
    .returns<StatusStat[]>();

  if (error) {
    // TODO: send to sentry
    return { orders: [], customOrders: [] };
  }

  const result = data.map((stat) => ({
    source_table: stat.source_table,
    title: formatOrderStatus(stat.status),
    value: stat.count,
    color: statusColor[stat.status],
  }));

  const orders = result.filter((item) => item.source_table === "orders");
  const customOrders = result.filter(
    (item) => item.source_table === "custom-orders"
  );

  return { orders, customOrders };
}

async function getTotalOrderCount() {
  const { data, error } = await supabase
    .rpc<any, null>("get_total_order_count")
    .returns<OrderTableStat[]>();

  if (error) {
    // TODO: send to sentry
    return [];
  }

  return data.map((stat) => ({
    title: orderTableMap[stat.table_name],
    value: stat.count,
  }));
}

export const useOrderCountByStatus = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["order-count-by-status", "admin"],
    queryFn: () => getOrderCountByStatus(),
  });

  return {
    orders: data?.orders,
    customOrders: data?.customOrders,
    error,
    isLoading,
  };
};

export const useOrderCount = () => {
  const {
    data: orders,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["order-count", "admin"],
    queryFn: () => getTotalOrderCount(),
  });

  return { orders, error, isLoading };
};
