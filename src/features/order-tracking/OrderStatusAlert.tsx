import { OrderStatus } from "@/types/order";
import { Alert } from "@mantine/core";
import React from "react";

interface Props {
  title?: string;
  status: OrderStatus;
  orderId: string;
}
export const OrderStatusAlert = ({ title, status, orderId }: Props) => {
  if (status === "cancelled") {
    return (
      <Alert
        variant="light"
        color="red"
        title={title || "Order Cancelled"}
        maw={400}
        mx="auto"
      >
        Order with id <span className="font-bold">#{orderId}</span> is was
        cancelled
      </Alert>
    );
  }

  if (status === "completed") {
    return (
      <Alert
        variant="light"
        color="green"
        title={title || "Order Completed"}
        maw={400}
        mx="auto"
      />
    );
  }

  if (status === "pending" || status === "requested") {
    return (
      <Alert
        variant="light"
        color="yellow"
        title={title || "Pending Order"}
        maw={500}
        mx="auto"
      >
        Order with id <span className="font-bold">#{orderId}</span> is pending
        and awaiting confirmation
      </Alert>
    );
  }

  if (status === "pending-cancellation") {
    return (
      <Alert
        variant="light"
        color="red"
        title={title || "Awaiting Cancellation"}
        maw={500}
        mx="auto"
      >
        We are Processing Cancellation request for order with id{" "}
        <span className="font-bold">#{orderId}</span>
      </Alert>
    );
  }

  return <></>;
};
