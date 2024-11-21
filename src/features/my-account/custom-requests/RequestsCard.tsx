import { OrderStatusRenderer } from "@/components/OrderStatusRenderer";
import { ICustomOrder } from "@/types/order";
import { Box, Card, Group, Text } from "@mantine/core";
import Link from "next/link";
import { CancelRequest } from "./CancelRequest";
import { formatString } from "@/functions";
import { CustomOrderDetails } from "./CustomOrderDetails";

interface Props {
  requests: Partial<ICustomOrder[]>;
}

export const RequestsCard = ({ requests }: Props) => {
  return (
    <Box hiddenFrom="sm">
      {requests.map(
        (order) =>
          order && (
            <Card key={order.id} withBorder my="sm">
              <Group justify="space-between">
                <Group align="center" mb="sm">
                  <Text
                    title="Track this custom order"
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
                  <Text size="sm" fw="bold">
                    {formatString(order.itemTypes.join(" | "))}
                  </Text>
                </Group>
                <CustomOrderDetails
                  orderId={order.orderId}
                  orderDetails={order.orderDetails}
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
                    {order.totalAmount || "Unknown"}
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
                    {(order.status === "requested" ||
                      order.status === "pending") && (
                      <CancelRequest
                        orderId={order.id}
                        orderNumber={order.orderId}
                      />
                    )}
                  </Group>
                </Group>
              </Group>
            </Card>
          )
      )}
    </Box>
  );
};
