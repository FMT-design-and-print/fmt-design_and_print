import { useCheckout } from "@/store/checkout";
import { Box, Radio, Stack, Text } from "@mantine/core";

export const DeliveryType = () => {
  const {
    update,
    details: { deliveryType },
  } = useCheckout((state) => state);

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
            update("deliveryType", "pickup");
            update("deliveryFee", 0);
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
            update("deliveryType", "delivery");
            update("deliveryFee", 30);
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
