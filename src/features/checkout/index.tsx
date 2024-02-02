"use client";
import { Box, Grid } from "@mantine/core";
import { PaymentDetails } from "./PaymentDetails";
import { ReviewItems } from "./ReviewItems";
import { DeliveryInformation } from "./DeliveryInformation";
import { useState } from "react";
import { CheckoutDetails } from "@/types";
import { getOrderId } from "@/functions";

const initialState: CheckoutDetails = {
  orderId: "",
  paymentType: "",
  fullName: "",
  email: "",
  phone: "",
  country: "",
  address: "",
  region: "",
};

export const Checkout = () => {
  const [state, setState] = useState<CheckoutDetails>({
    ...initialState,
    orderId: getOrderId(),
  });

  return (
    <>
      <Grid>
        <Grid.Col span="auto">
          <ReviewItems />
          <DeliveryInformation details={state} setDetails={setState} />
          <Box hiddenFrom="sm">
            <PaymentDetails />
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 4, lg: 3 }} visibleFrom="sm">
          <PaymentDetails />
        </Grid.Col>
      </Grid>
    </>
  );
};
