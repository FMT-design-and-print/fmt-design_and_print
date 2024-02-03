import {
  Card,
  Title,
  Divider,
  Stack,
  Group,
  Button,
  Text,
} from "@mantine/core";
import React, { useState } from "react";
import { DiscountForm } from "./DiscountForm";
import { PaymentOptions } from "./PaymentOptions";
import { calculateTotalPrice } from "@/functions";
import { useCheckout } from "@/store/checkout";
import { PayButton } from "./PayButton";

export const PaymentDetails = () => {
  const {
    details: { items },
  } = useCheckout((state) => state);
  const [discount, setDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  const subTotal = calculateTotalPrice(items);
  const total = subTotal + shippingFee - discount;

  return (
    <Card withBorder px="xl" style={{ backgroundColor: "var(--primary-400)" }}>
      <Title order={3} py={16} c="white">
        Payment Details
      </Title>
      <Divider label="Do you have coupon code?" color="white" my={16} />
      <DiscountForm />
      <Divider my={16} />

      <PaymentOptions />
      <Divider my={16} />
      <Stack>
        <Group justify="space-between">
          <Text fz="sm" c="gray.1">
            Sub Total
          </Text>
          <Text fz="sm" fw={600} c="white">
            GHS {subTotal.toFixed(1)}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text fz="sm" c="gray.1">
            Discount
          </Text>
          <Text fz="sm" fw={600} c="white">
            -GHS {discount.toFixed(1)}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text fz="sm" c="gray.1">
            Shipping
          </Text>
          <Text fz="sm" fw={600} c="white">
            +GHS {shippingFee.toFixed(1)}
          </Text>
        </Group>

        <Divider my={16} />
        <Group justify="space-between">
          <Text fz="sm" c="gray.1">
            TOTAL
          </Text>
          <Text fz="sm" fw={600} c="white">
            GHS {total.toFixed(1)}
          </Text>
        </Group>
        <PayButton total={total} />
      </Stack>
    </Card>
  );
};
