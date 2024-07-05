import { Title } from "@mantine/core";
import { OrdersTabs } from "./OrdersTabs";

export const Orders = () => {
  return (
    <>
      <Title order={2} mb="md">
        Orders
      </Title>
      {/* <OrdersTable orders={orders || []} /> */}
      <OrdersTabs />
    </>
  );
};
