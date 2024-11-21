import { NoItemsFound } from "@/components/NoItemsFound";
import { formatOrderStatus, groupOrdersByStatus } from "@/functions/orders";
import { ICustomOrder, IOrder, OrderStatus } from "@/types/order";
import { Alert, LoadingOverlay, Tabs, TextInput } from "@mantine/core";
import { IconSearch, IconShoppingCart } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { OrdersCard } from "./OrdersCard";
import { OrdersTable } from "./OrdersTable";
import { AdminOrdersContext } from "./OrdersContext";

export function OrdersTabs({
  orders: allOrders,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedOrders, setSearchedOrders] = useState<
    (IOrder | ICustomOrder)[]
  >(allOrders || []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.trim().length >= 3) {
        const foundOrders = allOrders.filter((order) => {
          return order.orderId.includes(searchTerm);
        });
        setSearchedOrders(foundOrders);
      } else {
        setSearchedOrders(allOrders);
      }
    }, 1000);

    // Cleanup function to clear the timeout
    return () => clearTimeout(timeout);
  }, [allOrders, searchTerm]);

  if (error) {
    return (
      <Alert title="Error loading orders" color="red">
        There was an error encountered whiles loading orders. Try refreshing
        page again
      </Alert>
    );
  }

  const groupedOrders = searchedOrders
    ? groupOrdersByStatus(searchedOrders as IOrder[])
    : {};

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
              <TextInput
                my="xs"
                size="xs"
                placeholder="Search by order number E.g 7067545"
                rightSection={<IconSearch size="1rem" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
              />

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
