import { IOrder } from "@/types/order";
import { Badge, Group, Table, Text } from "@mantine/core";
import { getFormattedDurationFromNow } from "@/functions/durations";
import { OrderStatusRenderer } from "@/components/OrderStatusRenderer";
import { OrderDetails } from "./OrderDetails";
import { OrderStatusOptions } from "./OrderStatusOptions";
import { CopyIcon } from "@/components/CopyIcon";

interface Props {
  order: IOrder;
}

export const OrderTableRow = ({ order }: Props) => {
  const createdAt = new Date(order.created_at);

  return (
    <Table.Tr>
      <Table.Td>
        <Group gap="0">
          <Text size="sm" fw="bolder">
            {order.orderId}
          </Text>
          <CopyIcon value={order.orderId} />
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="xs">
          {createdAt.toDateString()} {createdAt.toLocaleTimeString()}
        </Text>
        <Badge size="xs" variant="dot" color="gray">
          {getFormattedDurationFromNow(createdAt)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{order.totalAmount?.toFixed(2)}</Text>
      </Table.Td>
      <Table.Td>
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
      </Table.Td>
      <Table.Td>
        <OrderDetails order={order} />
      </Table.Td>
    </Table.Tr>
  );
};
