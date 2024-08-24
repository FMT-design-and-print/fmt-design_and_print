import {
  Box,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { DeliveryType } from "./DeliveryType";
import { DiscountForm } from "./DiscountForm";
import { PayButton } from "./PayButton";
import { IShippingAddress } from "@/types";
import { LoadingOverlay } from "../LoadingOverlay";

interface Props {
  subTotal: number;
  deliveryFee: number;
  note: string;
  isLoading: boolean;
  shippingAddress: IShippingAddress;
  onPaySuccess?: (ref: any) => void;
  setNote?: (note: string) => void;
  style?: {
    bg: string;
  };
}

export const PaymentDetailsCard = (props: Props) => {
  const {
    subTotal,
    deliveryFee,
    note,
    setNote,
    isLoading,
    shippingAddress,
    onPaySuccess,
    style,
  } = props;
  const { region } = shippingAddress;
  const [discount] = useState(0);

  const shippingFee = deliveryFee || 0;
  const total = subTotal + shippingFee - discount;

  return (
    <Card
      withBorder
      px="xl"
      bg={style?.bg || "var(--primary-light)"}
      pos="relative"
    >
      <LoadingOverlay visible={isLoading} />
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
            +GHS {shippingFee.toFixed(2)}
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
          onChange={(e) => setNote?.(e.currentTarget.value)}
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
        <PayButton
          total={total}
          shippingAddress={shippingAddress}
          onSuccess={onPaySuccess}
        />
      </Stack>
    </Card>
  );
};
