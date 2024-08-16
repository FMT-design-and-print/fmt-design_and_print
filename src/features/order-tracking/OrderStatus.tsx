"use client";
import { IOrder } from "@/types/order";
import { Box, Card, Group, Stack, Text } from "@mantine/core";
import { DeliveryOrderStatus } from "./DeliveryOrderStatus";
import { InStoreOrderStatus } from "./InStoreOrderStatus";
import { OrderStatusAlert } from "./OrderStatusAlert";
import { EstimatedTime } from "./EstimatedTime";
import {
  calculateEstimatedFulfillmentDate,
  getOrderCompletedDate,
  getOrderStatusText,
} from "@/functions";

interface Props {
  order: IOrder;
}

const topLevelStatuses = [
  "cancelled",
  "pending",
  "requested",
  "pending-cancellation",
];

export const OrderStatus = ({ order }: Props) => {
  const createdAt = new Date(order.created_at);

  const estimatedFulfillmentDate = calculateEstimatedFulfillmentDate(
    createdAt,
    order.estimatedFulfillmentDate
  );

  return topLevelStatuses.includes(order.status) ? (
    <OrderStatusAlert orderId={order.orderId} status={order.status} />
  ) : (
    <>
      <Card withBorder bg="gray.1" my="xl">
        <Group justify="space-between" px="xl">
          <Stack align="center" gap={4}>
            <Text size="sm" fw={500}>
              Order Placed
            </Text>
            <Text size="xs" c="dimmed">
              {createdAt.toDateString()}
            </Text>
          </Stack>
          <Stack align="center" gap={4}>
            <Text size="sm" fw={500}>
              Total
            </Text>
            <Text size="xs" c="dimmed">
              {order.totalAmount}
            </Text>
          </Stack>

          {order.deliveryDetails && (
            <Stack align="center" gap={4}>
              <Text size="sm" fw={500}>
                Ship to
              </Text>
              <Text size="xs" c="dimmed">
                {order.deliveryDetails.town}, {order.deliveryDetails.region}
              </Text>
            </Stack>
          )}

          <Stack align="center" gap={4}>
            <Text size="sm" fw={500}>
              Order
            </Text>
            <Text size="xs" c="dimmed">
              #{order.orderId}
            </Text>
          </Stack>
        </Group>
      </Card>

      <>
        {order.status === "completed" ? (
          <Box mb="xl">
            <OrderStatusAlert
              title={`Order Completed on ${getOrderCompletedDate(
                order.updated_at
              )}`}
              status="completed"
              orderId={order.orderId}
            />
          </Box>
        ) : (
          <Stack align="center" mb="xl" pb="xl" gap="sm">
            <Group>
              <Text fw={500} size="md">
                Order Status:
              </Text>
              <Text c="pink" fw={500} size="md">
                {getOrderStatusText(order.status)}
              </Text>
            </Group>

            {order.deliveryType === "delivery" ? (
              <EstimatedTime
                label="Estimated Delivery Date:"
                time={estimatedFulfillmentDate.toDateString()}
              />
            ) : (
              <EstimatedTime
                label="Estimated Ready Time:"
                time={`${estimatedFulfillmentDate.toDateString()}, ${estimatedFulfillmentDate.toLocaleTimeString()}`}
              />
            )}
          </Stack>
        )}

        {order.deliveryType === "delivery" && (
          <DeliveryOrderStatus status={order.status} />
        )}
        {order.deliveryType === "pickup" && (
          <InStoreOrderStatus status={order.status} />
        )}
      </>
    </>
  );
};
