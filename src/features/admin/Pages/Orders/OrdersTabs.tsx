import { NoItemsFound } from "@/components/NoItemsFound";
import { formatOrderStatus, groupOrdersByStatus } from "@/functions/orders";
import { ICustomOrder, IOrder, OrderStatus } from "@/types/order";
import { Alert, LoadingOverlay, Tabs } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";
import { useState } from "react";
import { OrdersCard } from "./OrdersCard";
import { OrdersTable } from "./OrdersTable";
import { AdminOrdersContext } from "./OrdersContext";

export function OrdersTabs({
  orders,
  isLoading,
  error,
  statuses,
  type,
}: {
  orders: IOrder[] | ICustomOrder[];
  isLoading: boolean;
  error: unknown;
  statuses: OrderStatus[];
  type: "orders" | "custom-orders";
}) {
  const [activeTab, setActiveTab] = useState<OrderStatus | null>(statuses[0]);

  if (error) {
    return (
      <Alert title="Error loading orders" color="red">
        There was an error encountered whiles loading orders. Try refreshing
        page again
      </Alert>
    );
  }

  const groupedOrders = orders ? groupOrdersByStatus(orders as IOrder[]) : {};

  return (
    <AdminOrdersContext.Provider value={{ type }}>
      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value as OrderStatus)}
        pos="relative"
        mah={500}
        style={{ overflow: "auto" }}
      >
        {isLoading && <LoadingOverlay visible={isLoading} />}
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
    </AdminOrdersContext.Provider>
  );
}
