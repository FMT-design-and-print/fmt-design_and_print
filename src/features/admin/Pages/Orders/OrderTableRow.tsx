import { ICustomOrder, IOrder } from "@/types/order";
import { Badge, Group, Table, Text } from "@mantine/core";
import { getFormattedDurationFromNow } from "@/functions/durations";
import { OrderStatusRenderer } from "@/components/OrderStatusRenderer";
import { OrderDetails } from "./OrderDetails";
import { OrderStatusOptions } from "./OrderStatusOptions";
import { CopyIcon } from "@/components/CopyIcon";
import { useAdminOrdersContext } from "./OrdersContext";
import { CustomOrderDetails } from "./CustomOrderDetails";
import { dateOptions } from "@/constants";

interface Props {
  order: IOrder | ICustomOrder;
}

export const OrderTableRow = ({ order }: Props) => {
  const { type } = useAdminOrdersContext();
  const createdAt = new Date(order.created_at);
  const updatedAt = order.updated_at ? new Date(order.updated_at) : createdAt;

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
        <Badge
          size="xs"
          variant="light"
          color="gray"
          title={createdAt.toLocaleString("en-US", dateOptions)}
        >
          {getFormattedDurationFromNow(createdAt)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge
          size="xs"
          variant="light"
          color="gray"
          title={updatedAt.toLocaleString("en-US", dateOptions)}
        >
          {getFormattedDurationFromNow(updatedAt)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm">
          {order.totalAmount ? order.totalAmount?.toFixed(2) : "Not set"}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap={1}>
          <OrderStatusRenderer status={order.status} />
          <OrderStatusOptions
            status={order.status}
            orderId={order.id}
            orderNumber={order.orderId}
            numberOfItems={(order as IOrder).items?.length || 0}
            totalAmount={order.totalAmount}
          />
        </Group>
      </Table.Td>
      <Table.Td>
        {type === "custom-orders" ? (
          <CustomOrderDetails order={order as unknown as ICustomOrder} />
        ) : (
          <OrderDetails order={order as IOrder} />
        )}
      </Table.Td>
    </Table.Tr>
  );
};
