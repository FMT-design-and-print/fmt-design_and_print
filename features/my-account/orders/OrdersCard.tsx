import { OrderStatusRenderer } from "@/components/OrderStatusRenderer";
import { IOrder } from "@/types/order";
import { Box, Card, Group, Text, Badge } from "@mantine/core";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CancelRequest } from "./CancelRequest";
import { OrderItems } from "./OrderItems";

interface Props {
  orders: IOrder[];
}

const getPaymentStatusColor = (status: string | undefined) => {
  if (!status) return "gray";
  switch (status) {
    case "paid":
      return "green";
    case "partly-paid":
      return "yellow";
    case "unpaid":
      return "red";
    default:
      return "gray";
  }
};

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
              btnLabel="View Details"
              orderId={order.id}
              orderNumber={order.orderId}
              order={order}
            />
          </Group>

          <Group gap="md">
            <Group gap="5px">
              <Text fz="xs" c="dimmed">
                Date:
              </Text>
              <Text fz="xs" fw={500}>
                {formatDistanceToNow(new Date(order.created_at), {
                  addSuffix: true,
                })}
              </Text>
            </Group>

            <Group gap="5px">
              <Text fz="xs" c="dimmed">
                Amount:
              </Text>
              <Text fz="xs" fw={500}>
                {order.totalAmount}
              </Text>
            </Group>
          </Group>

          <Group justify="space-between" mt="md">
            <Group gap="md">
              <Group gap="5px">
                <Text fz="xs" c="dimmed">
                  Payment:
                </Text>
                <Badge
                  size="sm"
                  color={getPaymentStatusColor(order.paymentStatus)}
                >
                  {order.paymentStatus || "N/A"}
                </Badge>
              </Group>

              <Group gap="5px">
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
          </Group>
        </Card>
      ))}
    </Box>
  );
};
