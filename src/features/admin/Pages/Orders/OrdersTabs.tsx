import { NoItemsFound } from "@/components/NoItemsFound";
import { formatOrderStatus, groupOrdersByStatus } from "@/functions/orders";
import { useOrders } from "@/hooks/admin/useOrders";
import { OrderStatus } from "@/types/order";
import { LoadingOverlay, Tabs } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";
import { useState } from "react";
import { OrdersCard } from "./OrdersCard";
import { OrdersTable } from "./OrdersTable";

const statuses: OrderStatus[] = [
  "pending",
  "placed",
  "processing",
  "packaging",
  "shipped",
  "ready",
  "delivered",
  "completed",
  "pending-cancellation",
  "cancelled",
];

export function OrdersTabs() {
  const { orders, isLoading, error } = useOrders();
  const [activeTab, setActiveTab] = useState<OrderStatus | null>(statuses[0]);

  if (error) {
    return console.error(error.message);
  }

  const groupedOrders = orders ? groupOrdersByStatus(orders) : {};

  return (
    <Tabs defaultValue="first">
      {isLoading && <LoadingOverlay visible={isLoading} />}
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

        {statuses.map((status: OrderStatus) => {
          const orders = groupedOrders[status] || [];

          return (
            <Tabs.Panel value={status} key={status}>
              {orders.length === 0 ? (
                <NoItemsFound
                  label={`No ${status} orders available`}
                  mih={100}
                  icon={
                    <IconShoppingCart size="8rem" style={{ color: "gray" }} />
                  }
                ></NoItemsFound>
              ) : (
                <>
                  <OrdersTable orders={orders} />
                  <OrdersCard orders={orders} />
                </>
              )}
            </Tabs.Panel>
          );
        })}
      </Tabs>
    </Tabs>
  );
}
