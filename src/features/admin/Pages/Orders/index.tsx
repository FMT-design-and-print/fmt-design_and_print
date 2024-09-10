import { Stack, Title } from "@mantine/core";
import { OrdersTabs } from "./OrdersTabs";
import { useCustomOrders, useOrders } from "@/hooks/admin/useOrders";
import { OrderStatus } from "@/types/order";

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

const customOrderStatuses: OrderStatus[] = ["requested", ...statuses];

export const Orders = () => {
  const { orders, isLoading, error } = useOrders();
  const {
    customerOrders,
    isLoading: isLoadingCustomOrder,
    error: customOrderError,
  } = useCustomOrders();

  return (
    <>
      <Stack mb="xl">
        <Title order={2} mb="md">
          Orders
        </Title>
        <OrdersTabs
          orders={orders || []}
          isLoading={isLoading}
          error={error}
          statuses={statuses}
        />
      </Stack>
      <Stack my="xl">
        <Title order={2} mb="md">
          Custom Orders
        </Title>
        <OrdersTabs
          orders={customerOrders || []}
          isLoading={isLoadingCustomOrder}
          error={customOrderError}
          statuses={customOrderStatuses}
        />
      </Stack>
    </>
  );
};
