import { useCheckout } from "@/store/checkout";
import { Box, Radio, Stack, Text } from "@mantine/core";

export const DeliveryType = () => {
  const {
    update,
    details: { deliveryType },
  } = useCheckout((state) => state);

  return (
    <Box py="md">
      <Text component="span" size="xs" c="gray.2">
        How do you want to receive your order?
      </Text>
      <Stack mt="md">
        <Radio
          variant="outline"
          color="dark"
          checked={deliveryType === "pickup"}
          onChange={() => {
            update("deliveryType", "pickup");
            update("deliveryFee", 0);
          }}
          label={
            <Text component="span" c="white" size="sm">
              I will pick up my self
            </Text>
          }
        />
        <Radio
          variant="outline"
          color="dark"
          checked={deliveryType === "delivery"}
          onChange={() => {
            update("deliveryType", "delivery");
            update("deliveryFee", 30);
          }}
          label={
            <Text component="span" c="white" size="sm">
              Deliver to me
            </Text>
          }
        />
      </Stack>
    </Box>
  );
};
