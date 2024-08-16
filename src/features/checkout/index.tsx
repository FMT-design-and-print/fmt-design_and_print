"use client";
import { Box, Button, Card, Grid, Group, Text } from "@mantine/core";
import { DeliveryInformation } from "./DeliveryInformation";
import { PaymentDetails } from "./PaymentDetails";
import { ReviewItems } from "./ReviewItems";
import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { useRouter } from "next/navigation";
import { IShippingAddress } from "@/types";
import Link from "next/link";
import { useSession } from "@/store";

interface Props {
  shippingAddresses?: IShippingAddress[];
}

export const Checkout = ({ shippingAddresses }: Props) => {
  const { session } = useSession();
  const router = useRouter();
  const cartItems = useCart((state) => state.items);
  const {
    setItems,
    details: { items: checkoutItems },
  } = useCheckout((state) => state);

  useEffect(() => {
    if (checkoutItems.length === 0 && cartItems.length > 0) {
      setItems(cartItems);
    } else if (checkoutItems.length === 0) {
      router.push("/cart");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, checkoutItems.length]);

  return (
    <Box
      w={{ base: "100%", lg: "90%" }}
      mx="auto"
      py={{ base: "sm", sm: "xl" }}
    >
      <Grid>
        <Grid.Col span="auto">
          {!session && (
            <Card withBorder my="sm">
              <Group>
                <Text size="sm">Already have an account? </Text>
                <Button
                  variant="transparent"
                  size="xs"
                  component={Link}
                  href={"/login?redirect=/checkout"}
                  color="pink"
                >
                  Login
                </Button>

                <Text size="sm">otherwise </Text>
                <Button
                  variant="transparent"
                  size="xs"
                  component={Link}
                  href={"/signup?redirect=/checkout"}
                  color="pink"
                >
                  Signup
                </Button>
              </Group>
              <Text size="xs" c="dimmed">
                Don&apos;t worry! You can still continue to make your purchase
                without an account
              </Text>
            </Card>
          )}
          <ReviewItems />
          <DeliveryInformation shippingAddresses={shippingAddresses} />
          <Box hiddenFrom="md">
            <PaymentDetails />
          </Box>
        </Grid.Col>
        <Grid.Col span={4} visibleFrom="md">
          <PaymentDetails />
        </Grid.Col>
      </Grid>
    </Box>
  );
};
