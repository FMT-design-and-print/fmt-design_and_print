import { CopyIcon } from "@/components/CopyIcon";
import { OrderStatusRenderer } from "@/components/OrderStatusRenderer";
import { getFormattedDurationFromNow } from "@/functions/durations";
import { ICustomOrder } from "@/types/order";
import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Group,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { CustomOrderDetailsRenderer } from "./CustomOrderDetailsRenderer";
import { EstimatedFulfillmentDate } from "./EstimatedFulfillmentDate";
import { OrderStatusOptions } from "./OrderStatusOptions";
import { QuotesManager } from "./Quote/QuotesManager";

export const CustomOrderDetails = ({
  order,
  label,
}: {
  order: ICustomOrder;
  label?: string;
}) => {
  const createdAt = new Date(order.created_at);

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Custom Order Details"
        position="right"
        size="100%"
      >
        <Grid>
          <Grid.Col span={{ base: 12, sm: 5 }}>
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

            <Group>
              <Text size="sm">Status: </Text>
              <Group>
                <OrderStatusRenderer status={order.status} />
                <OrderStatusOptions
                  status={order.status}
                  orderId={order.id}
                  orderNumber={order.orderId}
                  numberOfItems={0}
                  totalAmount={order.totalAmount}
                />
              </Group>
            </Group>

            <Group my="sm">
              <Text size="sm">Amount: </Text>
              {order.totalAmount ? (
                <Text size="sm" fw="bold">
                  {order.totalAmount.toFixed(2)}
                </Text>
              ) : (
                "Not set"
              )}
            </Group>

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
              defaultFulfillmentDate={order.estimatedFulfillmentDate}
            />

            <CustomOrderDetailsRenderer orderDetails={order.orderDetails} />

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
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 7 }}>
            <QuotesManager order={order} />
          </Grid.Col>
        </Grid>
      </Drawer>

      <Button onClick={open} variant="transparent" color="pink" size="xs">
        {label || "View"}
      </Button>
    </>
  );
};
