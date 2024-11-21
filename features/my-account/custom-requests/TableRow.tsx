import { OrderStatusRenderer } from "@/components/OrderStatusRenderer";
import { ICustomOrder } from "@/types/order";
import { Group, Table, Text } from "@mantine/core";
import Link from "next/link";
import { CancelRequest } from "./CancelRequest";
import { formatString } from "@/functions";
import { CustomOrderDetails } from "./CustomOrderDetails";

interface Props {
  order: ICustomOrder;
}

export const TableRow = ({ order }: Props) => {
  const createdAt = new Date(order.created_at);

  return (
    <Table.Tr>
      <Table.Td>
        <Text
          title="Track this custom order"
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
        <Text size="sm">{formatString(order.itemTypes.join(", "))}</Text>
      </Table.Td>

      <Table.Td>
        <Group gap={4}>
          <Text size="sm">{createdAt.toDateString()}</Text>
          <Text size="xs" c="dimmed">
            {createdAt.toLocaleTimeString()}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Group>
          <OrderStatusRenderer status={order.status} />
          {(order.status === "requested" || order.status === "pending") && (
            <CancelRequest orderId={order.id} orderNumber={order.orderId} />
          )}
        </Group>
      </Table.Td>

      <Table.Td>
        <Text size="sm">{order.totalAmount || "Unknown"}</Text>
      </Table.Td>
      <Table.Td>
        <CustomOrderDetails
          orderId={order.orderId}
          orderDetails={order.orderDetails}
        />
      </Table.Td>
    </Table.Tr>
  );
};
