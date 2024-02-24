import { Center, Box } from "@mantine/core";
import React from "react";
import { OrderSteps } from "./OrderSteps";
import { OrderStatus } from "@/types/order";

interface Props {
  status: OrderStatus;
}
export const DeliveryOrderStatus = ({ status }: Props) => {
  return (
    <Center>
      <Box hiddenFrom="md">
        <OrderSteps status={status} orientation="vertical" />
      </Box>

      <Box visibleFrom="md">
        <OrderSteps status={status} />
      </Box>
    </Center>
  );
};
