import { DeliveryType } from "@/types/order";
import { Box, Radio, Stack, Text } from "@mantine/core";

interface Props {
  deliveryType: DeliveryType;
  setDeliveryType?: (type: DeliveryType) => void;
}

export const DeliveryTypeSelect = ({
  deliveryType,
  setDeliveryType,
}: Props) => {
  return (
    <Box py="md">
      <Text>Delivery Method</Text>
      <Text component="span" size="xs" c="gray.8">
        How do you want to receive your order?
      </Text>
      <Stack mt="md">
        <Radio
          variant="outline"
          color="var(--primary-700)"
          checked={deliveryType === "pickup"}
          onChange={() => {
            setDeliveryType?.("pickup");
          }}
          label={
            <Text component="span" size="sm">
              I will pick up my self
            </Text>
          }
        />
        <Radio
          variant="outline"
          color="var(--primary-700)"
          checked={deliveryType === "delivery"}
          onChange={() => {
            setDeliveryType?.("delivery");
          }}
          label={
            <Text component="span" size="sm">
              Deliver to me
            </Text>
          }
        />
      </Stack>
    </Box>
  );
};
