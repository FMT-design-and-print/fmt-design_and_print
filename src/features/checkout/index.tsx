"use client";
import { Alert, Box, Button, Card, Grid, Group, Text } from "@mantine/core";
import { DeliveryInformation } from "./DeliveryInformation";
import { PaymentDetails } from "./PaymentDetails";
import { ReviewItems } from "./ReviewItems";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { useRouter } from "next/navigation";
import { IShippingAddress } from "@/types";
import Link from "next/link";
import { useSession } from "@/store";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { calculateTotalPrice } from "@/functions";
import { createClient } from "@/utils/supabase/client";
import { PayButton } from "@/components/PaymentDetails/PayButton";
import { IconExclamationCircle } from "@tabler/icons-react";

interface Props {
  shippingAddresses?: IShippingAddress[];
}

export const Checkout = ({ shippingAddresses }: Props) => {
  const { session, user } = useSession();
  const router = useRouter();
  const cartItems = useCart((state) => state.items);
  const { setItems, details } = useCheckout((state) => state);
  const [emptyRequiredFields, setEmptyRequiredFields] = useState<string[]>([]);
  const { clearItemsFromCart } = useCart((state) => state);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const shippingFee = details.deliveryFee || 0;
  const subTotal = calculateTotalPrice(details.items);
  const total = subTotal + shippingFee - (details.discount || 0);

  const shippingAddress = {
    contactName: details.contactName,
    phone1: details.phone1,
    phone2: details.phone2,
    email: details.email,
    country: details.country,
    region: details.region,
    address: details.address,
    town: details.town,
  };

  const handleOnPaymentSuccess = async (ref: any) => {
    const supabase = createClient();

    setIsLoading(true);
    const { error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user?.id,
          orderId: ref.reference,
          items: details.items as any[],
          totalAmount: total,
          status: "placed",
          deliveryType: details.deliveryType,
          paymentType: details.paymentType,
          deliveryFee: details.deliveryFee,
          reference: ref.reference,
          deliveryDetails: shippingAddress,
          note: details.note,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      setIsLoading(false);
      return;
    }

    if (details.saveAddress) {
      const { error } = await supabase
        .from("shipping-addresses")
        .insert([
          {
            user_id: user?.id,
            ...shippingAddress,
          },
        ])
        .select();

      if (error) {
        // log address could not be saved
      }
    }

    clearItemsFromCart(details.items.map((item) => item.id));
    router.push(`/order-success?reference=${ref.reference}`);
  };

  useEffect(() => {
    if (details.items.length === 0 && cartItems.length > 0) {
      setItems(cartItems);
    } else if (details.items.length === 0) {
      router.push("/cart");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, details.items.length]);

  return (
    <Box
      w={{ base: "100%", lg: "90%" }}
      mx="auto"
      py={{ base: "sm", sm: "xl" }}
      pos="relative"
    >
      <LoadingOverlay visible={isLoading} />
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
          <Box visibleFrom="md">
            <DeliveryInformation shippingAddresses={shippingAddresses} />
          </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <PaymentDetails />
          <Box hiddenFrom="md" mb="lg">
            <DeliveryInformation shippingAddresses={shippingAddresses} />
          </Box>
          {details.region && details.region !== "GREATER ACCRA" && (
            <Box pb="md">
              <Text fz="xs" fs="italic" c="gray.9">
                Your region is outside Greater Accra. Delivery fee is not
                finalized and will be confirmed later
              </Text>
            </Box>
          )}
          <Group grow pb="lg">
            <PayButton
              total={total}
              shippingAddress={shippingAddress}
              deliveryType={details.deliveryType}
              onSuccess={handleOnPaymentSuccess}
              setEmptyRequiredFields={setEmptyRequiredFields}
            />
          </Group>
          <Box bg="white">
            {emptyRequiredFields.length > 0 && (
              <Alert
                variant="light"
                color="red"
                title={
                  <Text size="xs">Please fill out the following fields:</Text>
                }
                icon={<IconExclamationCircle />}
              >
                {emptyRequiredFields.join(", ")}
              </Alert>
            )}
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
};
