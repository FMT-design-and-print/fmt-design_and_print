import { featureFlags } from "@/constants/feature-flags";
import { useCheckout } from "@/store/checkout";
import { Box, Radio, Stack, Text } from "@mantine/core";

export const PaymentOptions = () => {
  const {
    update,
    details: { paymentType },
  } = useCheckout((state) => state);

  return (
    <Box py="md">
      <Text c="white">Payment Options</Text>
      <Text component="span" size="xs" c="gray.2">
        Choose your preferred mode of payment
      </Text>
      <Stack mt="md">
        <Radio
          variant="outline"
          color="dark"
          checked={paymentType === "momo"}
          onChange={() => {
            console.log();
            update("paymentType", "momo");
          }}
          label={
            <Text component="span" c="white" size="sm">
              Mobile Money (MTN, VODAFONE, AT)
            </Text>
          }
        />
        <Radio
          variant="outline"
          color="dark"
          checked={paymentType === "card"}
          onChange={() => {
            update("paymentType", "card");
          }}
          label={
            <Text component="span" c="white" size="sm">
              Card (Master | Visa)
            </Text>
          }
        />
        {featureFlags.cod && (
          <Radio
            color="dark"
            variant="outline"
            checked={paymentType === "cod"}
            onChange={() => {
              update("paymentType", "cod");
            }}
            label={
              <Text component="span" c="white" size="sm">
                Cash On Delivery
              </Text>
            }
          />
        )}
      </Stack>
    </Box>
  );
};
