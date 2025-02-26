import { OrderStatusRenderer } from "@/components/OrderStatusRenderer";
import { IOrder } from "@/types/order";
import { Badge, Group, Table, Text } from "@mantine/core";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CancelRequest } from "./CancelRequest";
import { OrderItems } from "./OrderItems";
import { IShippingAddress } from "@/types";
import { toast } from "react-toastify";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { CURRENCY_SYMBOL } from "@/features/admin/PriceCalculator/constants";

interface Props {
  order: IOrder;
}

export const OrderTableRow = ({ order }: Props) => {
  const supabase = createClientComponentClient();
  const createdAt = new Date(order.created_at);

  const getPaymentStatusColor = (status: string) => {
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

  const handleUpdateDeliveryDetails = async (
    orderId: string,
    details: IShippingAddress
  ) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          deliveryDetails: details,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      toast.success("Delivery details updated successfully");
    } catch (error) {
      console.error("Error updating delivery details:", error);
      toast.error("Failed to update delivery details");
    }
  };

  const handleUpdateNote = async (orderId: string, note: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          note,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      toast.success("Order note updated successfully");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  return (
    <Table.Tr>
      <Table.Td>
        <Text
          title="Track order status"
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
        <Text size="sm" c="dimmed">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">
          {CURRENCY_SYMBOL}
          {order.totalAmount}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge
          color={getPaymentStatusColor(order.paymentStatus || "unpaid")}
          variant="light"
        >
          {order.paymentStatus}
        </Badge>
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
          order={order}
          onUpdateDeliveryDetails={handleUpdateDeliveryDetails}
          onUpdateNote={handleUpdateNote}
        />
      </Table.Td>
    </Table.Tr>
  );
};
