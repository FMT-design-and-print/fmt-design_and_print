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

export const PaymentDetails = () => {
  const { items } = useCheckout((state) => state);
  const [discount, setDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  const subTotal = calculateTotalPrice(items);
  const total = subTotal + shippingFee - discount;

  return (
    <Card withBorder px="xl">
      <Title order={3} py={16} c="dimmed">
        Payment Details
      </Title>
      <Divider label="Do you have coupon code" my={16} />
      <DiscountForm />
      <Divider my={16} />

      <PaymentOptions />
      <Divider my={16} />
      <Stack>
        <Group justify="space-between">
          <Text fz="sm" c="dimmed">
            Sub Total
          </Text>
          <Text fz="sm" fw={600}>
            GHS {subTotal.toFixed(1)}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text fz="sm" c="dimmed">
            Discount
          </Text>
          <Text fz="sm" fw={600}>
            -GHS 3545{discount.toFixed(1)}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text fz="sm" c="dimmed">
            Shipping
          </Text>
          <Text fz="sm" fw={600}>
            +GHS {shippingFee.toFixed(1)}
          </Text>
        </Group>

        <Divider my={16} />
        <Group justify="space-between">
          <Text fz="sm" c="dimmed">
            TOTAL
          </Text>
          <Text fz="sm" fw={600}>
            GHS {total.toFixed(1)}
          </Text>
        </Group>
        <Button className="btn">Pay GHS {total.toFixed(1)}</Button>
      </Stack>
    </Card>
  );
};
