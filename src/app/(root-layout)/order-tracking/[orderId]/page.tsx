import { NoItemsFound } from "@/components/NoItemsFound";
import { OrderStatuses } from "@/features/order-tracking";
import { areAllowedOrderNumbers } from "@/functions";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { IOrder } from "@/types/order";
import { createClient } from "@/utils/supabase/server";
import {
  Button,
  Center,
  Container,
  Group,
  Notification,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconPackage } from "@tabler/icons-react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Tracking | FMT Design and Print",
};

export const revalidate = 0;

interface Props {
  params: { orderId: string };
}
const columns =
  "id, created_at, orderId, totalAmount, status, deliveryDetails, deliveryType, estimatedFulfillmentDate, updated_at";

const OrderIdPage = async ({ params }: Props) => {
  await redirectAdminUser();

  const { orderId } = params;
  const orderNumbers = orderId.split("-").map((x) => x.trim());
  const areAllowedNumbers = areAllowedOrderNumbers(orderNumbers);

  if (!areAllowedNumbers) {
    return (
      <Container size="sm" my="xl">
        <Notification color="red" p="xl">
          Invalid Order number(s). Please try again.
          <Group>
            <Text size="xs">Received Order Numbers: </Text>
            <Text size="xs" fw="bold">
              {orderNumbers.join(", ")}{" "}
            </Text>
          </Group>
        </Notification>
      </Container>
    );
  }

  const cookieStore = cookies();
  const supabase1 = createClient(cookieStore);

  const cookieStore2 = cookies();
  const supabase2 = createClient(cookieStore2);

  const [ordersResponse, customOrdersResponse] = await Promise.all([
    supabase1.from("orders").select(columns).in("orderId", orderNumbers),
    supabase2.from("custom-orders").select(columns).in("orderId", orderNumbers),
  ]);

  const { data: orders, error: ordersError } = ordersResponse;
  const { data: customOrders, error: customOrdersError } = customOrdersResponse;

  if (ordersError || customOrdersError) {
    // TODO: Handle error
    console.error(ordersError, customOrdersError);
    return;
  }

  const trackedOrders: IOrder[] = [...orders, ...customOrders] as any[];

  return (
    <>
      {trackedOrders == null || trackedOrders.length === 0 ? (
        <NoItemsFound
          label="No Orders were found for your search"
          icon={
            <IconPackage size={48} stroke={1.5} color="var(--primary-300)" />
          }
        >
          <TrackNewOrderButton />
        </NoItemsFound>
      ) : (
        <Container size="xl">
          <Stack align="center" my="xl" py="xl">
            <Title hiddenFrom="md" order={3}>
              Order Status
            </Title>
            <Title visibleFrom="md">Order Status</Title>
            <Text size="sm" ta="center">
              Please note that these are accurate but not guaranteed estimates.
              Delivery date is subject to change without advanced notice
            </Text>
          </Stack>
          <OrderStatuses orders={trackedOrders as IOrder[]} />

          <TrackNewOrderButton />
        </Container>
      )}
    </>
  );
};

const TrackNewOrderButton = () => {
  return (
    <Center mt="xl" pt="xl">
      <Button
        component={Link}
        href="/order-tracking"
        variant="subtle"
        color="pink"
      >
        Track new order
      </Button>
    </Center>
  );
};

export default OrderIdPage;
