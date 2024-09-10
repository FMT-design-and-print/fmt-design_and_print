import { CopyIcon } from "@/components/CopyIcon";
import { OrderStatusRenderer } from "@/components/OrderStatusRenderer";
import { IOrder } from "@/types/order";
import { Box, Card, Group, Text } from "@mantine/core";
import { OrderDetails } from "./OrderDetails";
import { OrderStatusOptions } from "./OrderStatusOptions";

interface Props {
  orders: IOrder[];
}

export const OrdersCard = ({ orders }: Props) => {
  return (
    <Box hiddenFrom="sm">
      {orders.map((order) => (
        <Card key={order.id} withBorder my="sm">
          <Group justify="space-between" align="center" mb="sm">
            <Group gap="0">
              <Text size="sm" fw="bolder">
                {order.orderId}
              </Text>
              <CopyIcon value={order.orderId} />
            </Group>
            <Group gap={1}>
              <OrderDetails order={order} label="View Details" />
            </Group>
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

            {order.totalAmount && (
              <Group>
                <Text fz="xs" c="dimmed">
                  Amount:
                </Text>
                <Text fz="xs" fw={500}>
                  {order.totalAmount}
                </Text>
              </Group>
            )}
          </Group>

          <Group justify="space-between">
            <Group mt="sm">
              <Text fz="xs" c="dimmed">
                Status:
              </Text>
              <Group>
                <Group gap={1}>
                  <OrderStatusRenderer status={order.status} />
                  <OrderStatusOptions
                    status={order.status}
                    orderId={order.id}
                    orderNumber={order.orderId}
                    numberOfItems={order.items?.length || 0}
                    totalAmount={order.totalAmount}
                  />
                </Group>
              </Group>
            </Group>
          </Group>
        </Card>
      ))}
    </Box>
  );
};
