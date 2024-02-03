"use client";
import { Box, Grid } from "@mantine/core";
import { DeliveryInformation } from "./DeliveryInformation";
import { PaymentDetails } from "./PaymentDetails";
import { ReviewItems } from "./ReviewItems";

// const initialState: CheckoutDetails = {
//   orderId: "",
//   paymentType: "",
//   fullName: "",
//   email: "",
//   phone: "",
//   country: "",
//   address: "",
//   region: "",
// };

export const Checkout = () => {
  // const [state, setState] = useState<CheckoutDetails>({
  //   ...initialState,
  //   orderId: getOrderId(),
  // });

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
          <Box hiddenFrom="sm">
            <PaymentDetails />
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 4, lg: 3 }} visibleFrom="sm">
          <PaymentDetails />
        </Grid.Col>
      </Grid>
    </Box>
  );
};
