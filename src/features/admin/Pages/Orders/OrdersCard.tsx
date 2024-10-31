import { CopyIcon } from "@/components/CopyIcon";
import { OrderStatusRenderer } from "@/components/OrderStatusRenderer";
import { dateOptions } from "@/constants";
import { getFormattedDurationFromNow } from "@/functions/durations";
import { ICustomOrder, IOrder } from "@/types/order";
import { Badge, Box, Card, Group, Text } from "@mantine/core";
import { CustomOrderDetails } from "./CustomOrderDetails";
import { OrderDetails } from "./OrderDetails";
import { OrderStatusOptions } from "./OrderStatusOptions";
import { useAdminOrdersContext } from "./OrdersContext";

interface Props {
  orders: IOrder[];
}

export const OrdersCard = ({ orders }: Props) => {
  const { type } = useAdminOrdersContext();

  return (
    <Box hiddenFrom="md">
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
              {type === "custom-orders" ? (
                <CustomOrderDetails
                  order={order as unknown as ICustomOrder}
                  label="View details"
                />
              ) : (
                <OrderDetails order={order as IOrder} label="View details" />
              )}
            </Group>
          </Group>

          <Group>
            <Group gap="5px">
              <Text size="xs" fw="bold">
                Created:
              </Text>
              <Badge
                size="xs"
                variant="light"
                color="gray"
                title={new Date(order.created_at).toLocaleString(
                  "en-US",
                  dateOptions
                )}
              >
                {getFormattedDurationFromNow(new Date(order.created_at))}
              </Badge>
            </Group>

            <Group gap="5px">
              <Text size="xs" fw="bold">
                Updated:
              </Text>
              <Badge
                size="xs"
                variant="light"
                color="gray"
                title={new Date(
                  order.updated_at || order.created_at
                ).toLocaleString("en-US", dateOptions)}
              >
                {getFormattedDurationFromNow(
                  new Date(order.updated_at || order.created_at)
                )}
              </Badge>
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

            <Group>
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
