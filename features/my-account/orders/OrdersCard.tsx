import { OrderStatusRenderer } from "@/components/OrderStatusRenderer";
import { IOrder } from "@/types/order";
import { Box, Card, Group, Text } from "@mantine/core";
import Link from "next/link";
import { CancelRequest } from "./CancelRequest";
import { OrderItems } from "./OrderItems";

interface Props {
  orders: IOrder[];
}

export const OrdersCard = ({ orders }: Props) => {
  return (
    <Box hiddenFrom="sm">
      {orders.map((order) => (
        <Card key={order.id} withBorder my="sm">
          <Group justify="space-between" align="center" mb="sm">
            <Text
              title="Track this order"
              fz="sm"
              component={Link}
              c="dimmed"
              fw="bolder"
              href={`/order-tracking/${order.orderId}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {order.orderId}
            </Text>
            <OrderItems
              items={order.items}
              btnLabel="View Items"
              orderId={order.id}
              orderNumber={order.orderId}
            />
          </Group>

          <Group>
            <Group gap="5px">
              <Text fz="xs" c="dimmed">
                Date:
              </Text>
              <Text fz="xs" fw={500}>
                {new Date(order.created_at).toDateString()}
              </Text>
            </Group>

            <Group>
              <Text fz="xs" c="dimmed">
                Time:
              </Text>
              <Text fz="xs" fw={500}>
                {new Date(order.created_at).toLocaleTimeString()}
              </Text>
            </Group>

            <Group>
              <Text fz="xs" c="dimmed">
                Amount:
              </Text>
              <Text fz="xs" fw={500}>
                {order.totalAmount}
              </Text>
            </Group>
          </Group>

          <Group justify="space-between">
            <Group mt="sm">
              <Text fz="xs" c="dimmed">
                Status:
              </Text>
              <Group>
                <OrderStatusRenderer status={order.status} />
                {order.status === "pending" && (
                  <CancelRequest
                    orderId={order.id}
                    orderNumber={order.orderId}
                  />
                )}
              </Group>
            </Group>
          </Group>
        </Card>
      ))}
    </Box>
  );
};
