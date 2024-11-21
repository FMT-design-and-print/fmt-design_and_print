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

interface Props {
  subTotal: number;
  deliveryFee: number;
  isLoading: boolean;
  note: string;
  discount: number;
  setNote?: (note: string) => void;
  setDiscount?: (value: number) => void;
  deliveryType: DeliveryType;
  setDeliveryType: (deliveryType: DeliveryType) => void;
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
  } = props;

  const total = subTotal + deliveryFee - discount;

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

      {/* <PaymentOptions /> */}
      <DeliveryTypeSelect
        deliveryType={deliveryType}
        setDeliveryType={setDeliveryType}
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
        <Group justify="space-between">
          <Text fz="sm" c="gray.9">
            Delivery Fee
          </Text>
          <Text fz="sm" fw={600}>
            +GHS {deliveryFee.toFixed(2)}
          </Text>
        </Group>

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
