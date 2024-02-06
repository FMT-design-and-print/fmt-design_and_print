"use client";
import { Box, Grid } from "@mantine/core";
import { DeliveryInformation } from "./DeliveryInformation";
import { PaymentDetails } from "./PaymentDetails";
import { ReviewItems } from "./ReviewItems";
import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { useRouter } from "next/navigation";

export const Checkout = () => {
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
          <ReviewItems />
          <DeliveryInformation />
          <Box hiddenFrom="md">
            <PaymentDetails />
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 4, lg: 3 }} visibleFrom="md">
          <PaymentDetails />
        </Grid.Col>
      </Grid>
    </Box>
  );
};
