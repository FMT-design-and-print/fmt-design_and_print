import { getOrderStatusText } from "@/functions";
import { OrderStatus } from "@/types/order";
import { Text } from "@mantine/core";
import React from "react";

interface Props {
  status: OrderStatus;
}

export const OrderStatusTextRenderer = ({ status }: Props) => {
  const statusText = getOrderStatusText(status);

  if (status === "pending") {
    return (
      <Text size="xs" c="yellow">
        {statusText}
      </Text>
    );
  }

  if (status === "pending-cancellation") {
    return (
      <Text size="xs" c="red">
        {statusText}
      </Text>
    );
  }

  if (status === "cancelled") {
    return (
      <Text size="xs" c="red">
        {statusText}
      </Text>
    );
  }

  if (status === "completed") {
    return (
      <Text size="xs" c="green">
        {statusText}
      </Text>
    );
  }

  if (status === "shipped") {
    return (
      <Text size="xs" c="indigo">
        {statusText}
      </Text>
    );
  }

  if (status === "delivered") {
    return (
      <Text size="xs" c="lime">
        {statusText}
      </Text>
    );
  }

  if (status === "packaging") {
    return (
      <Text size="xs" c="orange">
        {statusText}
      </Text>
    );
  }

  if (status === "ready") {
    return (
      <Text size="xs" c="cyan">
        {statusText}
      </Text>
    );
  }

  if (status === "processing") {
    return (
      <Text size="xs" c="blue">
        {statusText}
      </Text>
    );
  }

  if (status === "placed") {
    return <Text size="xs" c="cyan">{`${statusText}`}</Text>;
  }

  return (
    <Text size="xs" c="gray">
      {statusText}
    </Text>
  );
};
