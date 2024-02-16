import { IOrder } from "@/types/order";
import { Box, Card, Group, Text, Title } from "@mantine/core";
import { OrderItems } from "./OrderItems";

interface Props {
  orders: IOrder[];
}

export const OrdersCard = ({ orders }: Props) => {
  return (
    <Box hiddenFrom="sm">
      {orders.map((order) => (
        <Card key={order.id} withBorder my="sm">
          <Title order={4} c="dimmed" mb="sm">
            {order.orderId}
          </Title>

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
              <Text fz="xs" fw={500}>
                {order.status}
              </Text>
            </Group>
            <OrderItems
              orderId={order.id}
              items={order.items}
              btnLabel="View Items"
            />
          </Group>
        </Card>
      ))}
    </Box>
  );
};
