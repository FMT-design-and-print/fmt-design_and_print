import { OrderStatusRenderer } from "@/components/OrderStatusRenderer";
import { IOrder } from "@/types/order";
import { Group, Table, Text } from "@mantine/core";
import Link from "next/link";
import { CancelRequest } from "./CancelRequest";
import { OrderItems } from "./OrderItems";

interface Props {
  order: IOrder;
}

export const OrderTableRow = ({ order }: Props) => {
  const createdAt = new Date(order.created_at);

  return (
    <Table.Tr>
      <Table.Td>
        <Text
          title="Track this order"
          size="sm"
          component={Link}
          c="pink"
          fw="bolder"
          href={`/order-tracking/${order.orderId}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {order.orderId}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{createdAt.toDateString()}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{createdAt.toLocaleTimeString()}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{order.totalAmount}</Text>
      </Table.Td>
      <Table.Td>
        <Group>
          <OrderStatusRenderer status={order.status} />
          {order.status === "pending" && (
            <CancelRequest orderId={order.id} orderNumber={order.orderId} />
          )}
        </Group>
      </Table.Td>
      <Table.Td>
        <OrderItems
          orderId={order.id}
          orderNumber={order.orderId}
          items={order.items}
        />
      </Table.Td>
    </Table.Tr>
  );
};
