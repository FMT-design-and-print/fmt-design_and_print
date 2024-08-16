import {
  Card,
  Title,
  Divider,
  Stack,
  Group,
  Text,
  Textarea,
  Box,
} from "@mantine/core";
import React, { useState } from "react";
import { DiscountForm } from "./DiscountForm";
import { calculateTotalPrice } from "@/functions";
import { useCheckout } from "@/store/checkout";
import { PayButton } from "./PayButton";
import { DeliveryType } from "./DeliveryType";

export const PaymentDetails = () => {
  const {
    details: { deliveryFee, items, note, region },
    update,
  } = useCheckout((state) => state);
  const [discount] = useState(0);

  const shippingFee = deliveryFee || 0;
  const subTotal = calculateTotalPrice(items);
  const total = subTotal + shippingFee - discount;

  return (
    <Card
      withBorder
      px="xl"
      style={{ backgroundColor: "var(--primary-light)" }}
    >
      <Title order={3} py={16}>
        Payment Details
      </Title>
      <Divider
        label={
          <Text c="black" size="xs">
            Do you have coupon code?
          </Text>
        }
        color="black"
        my={16}
      />
      <DiscountForm />
      <Divider my={16} color="black" />

      {/* <PaymentOptions /> */}
      <DeliveryType />
      <Divider my={16} />
      <Stack>
        <Group justify="space-between">
          <Text fz="sm" c="gray.9">
            Sub Total
          </Text>
          <Text fz="sm" fw={600}>
            GHS {subTotal.toFixed(1)}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text fz="sm" c="gray.9">
            Discount
          </Text>
          <Text fz="sm" fw={600}>
            -GHS {discount.toFixed(1)}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text fz="sm" c="gray.9">
            Delivery Fee
          </Text>
          <Text fz="sm" fw={600}>
            +GHS {region === "GREATER ACCRA" ? shippingFee.toFixed(1) : 0}
          </Text>
        </Group>

        {region && region !== "GREATER ACCRA" && (
          <Box>
            <Text fz="xs" fs="italic" c="gray.9">
              Your region is outside Greater Accra. Delivery fee is not
              finalized and will be confirmed later
            </Text>
          </Box>
        )}

        <Divider mt={16} />
        <Textarea
          value={note}
          onChange={(e) => update("note", e.currentTarget.value)}
          label="Additional note"
          placeholder="any additional note on your order if any"
        />
        <Divider mt={8} mb={16} />
        <Group justify="space-between">
          <Text fz="sm" c="gray.9">
            TOTAL
          </Text>
          <Text fz="sm" fw={600}>
            GHS {total.toFixed(1)}
          </Text>
        </Group>
        <PayButton total={total} />
      </Stack>
    </Card>
  );
};
