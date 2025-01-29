import { CopyIcon } from "@/components/CopyIcon";
import { getFormattedDurationFromNow } from "@/functions/durations";
import { IOrder } from "@/types/order";
import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Group,
  Text,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { EstimatedFulfillmentDate } from "./EstimatedFulfillmentDate";
import { OrderItem } from "./OrderItem";

export const OrderDetails = ({
  order,
  label,
}: {
  order: IOrder;
  label?: string;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const createdAt = new Date(order.created_at);
  const fulfillmentDate = order.estimatedFulfillmentDate
    ? new Date(order.estimatedFulfillmentDate)
    : undefined;

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Order Details"
        position="right"
        size="lg"
      >
        <Group my="sm">
          <Text size="sm">Order Id: </Text>
          <Group gap={2}>
            <Text
              title="View Order tracking page"
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
            <CopyIcon value={order.orderId} />
          </Group>
        </Group>
        {order.totalAmount && (
          <Group my="sm">
            <Text size="sm">Amount: </Text>
            <Text size="sm" fw="bold">
              {order.totalAmount.toFixed(2)}
            </Text>
          </Group>
        )}
        <Group my="sm">
          <Text size="sm">Order placed on: </Text>
          <Badge color="gray" size="sm">
            {createdAt.toDateString()}, {createdAt.toLocaleTimeString()}{" "}
          </Badge>
          <Badge variant="light" color="gray" size="xs">
            {getFormattedDurationFromNow(createdAt)}
          </Badge>
        </Group>

        <EstimatedFulfillmentDate
          orderId={order.id}
          orderStatus={order.status}
          defaultFulfillmentDate={fulfillmentDate}
        />
        {order.deliveryDetails && (
          <>
            <Divider
              label={<Text size="sm">Delivery Details</Text>}
              labelPosition="left"
              my="md"
            />
            <Box>
              <Group my="xs">
                <Text size="sm" fw="bold">
                  Delivery Type:{" "}
                </Text>
                <Badge size="sm" color="pink">
                  {order.deliveryType}
                </Badge>
              </Group>
              <Group my="xs">
                <Text size="sm" fw="bold">
                  Contact Name:{" "}
                </Text>
                <Text size="sm">{order.deliveryDetails.contactName} </Text>
              </Group>

              <Group my="xs">
                <Text size="sm" fw="bold">
                  Email:{" "}
                </Text>
                <Text size="sm">{order.deliveryDetails.email} </Text>
              </Group>

              <Group my="xs">
                <Text size="sm" fw="bold">
                  Phone:{" "}
                </Text>
                <Text size="sm">
                  {order.deliveryDetails.phone1}
                  {order.deliveryDetails.phone2 &&
                    `/${order.deliveryDetails.phone2}`}{" "}
                </Text>
              </Group>

              <Group my="xs">
                <Text size="sm" fw="bold">
                  Address:{" "}
                </Text>

                <Badge size="sm" variant="outline" radius="sm" color="gray">
                  {order.deliveryDetails.country},{" "}
                  {order.deliveryDetails.region?.name} -{" "}
                  {order.deliveryDetails.town?.name},{" "}
                  {order.deliveryDetails.address}
                </Badge>
              </Group>
            </Box>
          </>
        )}
        {order.items && (
          <>
            <Divider
              label={<Text size="sm">Items</Text>}
              labelPosition="left"
              my="md"
            />
            {order.items.map((item) => (
              <OrderItem key={item.id} item={item} />
            ))}
          </>
        )}
        <Textarea label="Note" rows={5} defaultValue={order.note} readOnly />
      </Drawer>

      <Button onClick={open} variant="transparent" color="pink" size="xs">
        {label || "View"}
      </Button>
    </>
  );
};
