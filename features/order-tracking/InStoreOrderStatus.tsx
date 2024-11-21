import { Center, Box } from "@mantine/core";
import React from "react";
import { PickupSteps } from "./PickupSteps";
import { OrderStatus } from "@/types/order";

interface Props {
  status: OrderStatus;
}

export const InStoreOrderStatus = ({ status }: Props) => {
  return (
    <Center>
      <Box hiddenFrom="md">
        <PickupSteps orientation="vertical" status={status} />
      </Box>

      <Box visibleFrom="md">
        <PickupSteps status={status} />
      </Box>
    </Center>
  );
};
