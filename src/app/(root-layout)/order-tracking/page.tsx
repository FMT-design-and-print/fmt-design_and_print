import { TrackingForm } from "@/features/order-tracking/TrackingForm";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";
import { Container, Stack, Text, Title } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Tracking | FMT Design and Print",
};

const title = "Track your Orders";
const description =
  "You can Track Multiple Orders by separating order numbers with commas. Valid Order numbers are usually from 5 to 8 digits. For example: 34565,673466,7762256. Enter the tracking number(s) of your package below to track status. If you don't know your order number, please contact us.";

const OrderTrackingPage = async () => {
  await redirectAdminUser();

  return (
    <>
      <Container size="sm">
        <Stack align="center" my="xl" py="xl">
          <Title hiddenFrom="md" order={3}>
            {title}
          </Title>
          <Title visibleFrom="md">{title}</Title>
          <Text size="xs" ta="center" hiddenFrom="md">
            {description}
          </Text>
          <Text ta="center" size="sm" visibleFrom="md">
            {description}
          </Text>
        </Stack>

        <TrackingForm />
      </Container>
    </>
  );
};

export default OrderTrackingPage;
