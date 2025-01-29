import { DeliveryType } from "@/types/order";
import {
  Box,
  Divider,
  Group,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { LoadingOverlay } from "../LoadingOverlay";
import { DeliveryTypeSelect } from "./DeliveryType";
import { DiscountForm } from "./DiscountForm";
import { PaymentOptions } from "./PaymentOptions";
import { useEffect } from "react";
import { PaymentType } from "@/types";

interface Props {
  subTotal: number;
  deliveryFee: number;
  isLoading: boolean;
  note: string;
  discount: number;
  deliveryType: DeliveryType;
  paymentType: PaymentType;
  setNote?: (note: string) => void;
  setDiscount?: (value: number) => void;
  setDeliveryType: (deliveryType: DeliveryType) => void;
  setPaymentType: (paymentType: PaymentType) => void;
  requiresDelivery?: boolean;
  acceptCOD?: boolean;
}

export const PaymentDetailsCard = (props: Props) => {
  const {
    subTotal,
    deliveryFee,
    note,
    discount,
    setNote,
    setDiscount,
    isLoading,
    deliveryType,
    setDeliveryType,
    paymentType,
    setPaymentType,
    requiresDelivery = true,
    acceptCOD = true,
  } = props;

  const total = subTotal + deliveryFee - discount;

  useEffect(() => {
    if (subTotal + deliveryFee > 500 && paymentType === "cod") {
      setPaymentType("momo");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subTotal, paymentType, deliveryFee]);

  useEffect(() => {
    if (!requiresDelivery) {
      setDeliveryType("pickup");
    }
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requiresDelivery]);

  useEffect(() => {
    if (!acceptCOD && paymentType === "cod") {
      setPaymentType("momo");
    }
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptCOD]);

  return (
    <Box px="xl" pos="relative">
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
      <DiscountForm setDiscount={setDiscount} />
      <Divider my={16} color="black" />

      {requiresDelivery && (
        <DeliveryTypeSelect
          deliveryType={deliveryType}
          setDeliveryType={setDeliveryType}
        />
      )}

      <PaymentOptions
        amountInvolved={subTotal + deliveryFee}
        paymentType={paymentType}
        updatePaymentType={setPaymentType}
        acceptCOD={acceptCOD}
      />

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
        {requiresDelivery && (
          <Group justify="space-between">
            <Text fz="sm" c="gray.9">
              Delivery Fee
            </Text>
            <Text fz="sm" fw={600}>
              +GHS {deliveryFee.toFixed(2)}
            </Text>
          </Group>
        )}

        <Divider mt={8} mb={16} />
        <Group justify="space-between">
          <Text fz="sm" c="gray.9">
            TOTAL
          </Text>
          <Text fz="sm" fw={600}>
            GHS {total.toFixed(1)}
          </Text>
        </Group>

        <Divider mt={16} />
        <Textarea
          value={note}
          onChange={(e) => setNote?.(e.currentTarget.value)}
          label="Additional note"
          placeholder="any additional note on your order if any"
        />
      </Stack>
    </Box>
  );
};
