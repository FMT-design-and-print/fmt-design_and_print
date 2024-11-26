import { Stack, Title } from "@mantine/core";
import { OrdersTabs } from "./OrdersTabs";
import { useCustomOrders, useOrders } from "@/hooks/admin/useOrders";
import { OrderStatus } from "@/types/order";
import { orderStatuses } from "@/constants/order-statuses";

const customOrderStatuses: OrderStatus[] = ["requested", ...orderStatuses];

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
        <Title order={3} mb="md">
          Orders
        </Title>
        <OrdersTabs
          orders={orders || []}
          isLoading={isLoading}
          error={error}
          statuses={orderStatuses}
          type="orders"
        />
      </Stack>
      <Stack my="xl">
        <Title order={3} mb="md">
          Custom Orders
        </Title>
        <OrdersTabs
          orders={customerOrders || []}
          isLoading={isLoadingCustomOrder}
          error={customOrderError}
          statuses={customOrderStatuses}
          type="custom-orders"
        />
      </Stack>
    </>
  );
};
