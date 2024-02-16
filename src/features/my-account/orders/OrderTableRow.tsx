import { IOrder } from "@/types/order";
import { Table, Text } from "@mantine/core";
import { OrderItems } from "./OrderItems";

interface Props {
  order: IOrder;
}

export const OrderTableRow = ({ order }: Props) => {
  const createdAt = new Date(order.created_at);

  return (
    <Table.Tr>
      <Table.Td>
        <Text size="sm">{order.orderId}</Text>
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
        <Text size="sm">{order.status}</Text>
      </Table.Td>
      <Table.Td>
        <OrderItems orderId={order.orderId} items={order.items} />
      </Table.Td>
    </Table.Tr>
  );
};
