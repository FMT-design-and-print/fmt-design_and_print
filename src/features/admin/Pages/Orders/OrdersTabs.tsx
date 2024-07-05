import { Loading } from "@/components/Loading";
import { formatOrderStatus, groupOrdersByStatus } from "@/functions/orders";
import { useOrders } from "@/hooks/admin/useOrders";
import { OrderStatus } from "@/types/order";
import { Tabs } from "@mantine/core";
import { OrdersTable } from "./OrdersTable";
import { useState } from "react";

const statuses: OrderStatus[] = [
  "pending",
  "placed",
  "processing",
  "shipped",
  "delivered",
  "packaging",
  "ready",
  "completed",
  "pending-cancellation",
  "cancelled",
];

export function OrdersTabs() {
  const { orders, isLoading, error } = useOrders();
  const [activeTab, setActiveTab] = useState<OrderStatus | null>(statuses[0]);

  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  const groupedOrders = orders ? groupOrdersByStatus(orders) : {};

  return (
    <Tabs defaultValue="first">
      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value as OrderStatus)}
      >
        <Tabs.List>
          {statuses.map((status: OrderStatus) => (
            <Tabs.Tab value={status} key={status}>
              {formatOrderStatus(status)}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {statuses.map((status: OrderStatus) => (
          <Tabs.Panel value={status} key={status}>
            <OrdersTable orders={groupedOrders[status] || []} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Tabs>
  );
}
