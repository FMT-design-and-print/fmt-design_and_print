import { featureFlags } from "@/constants/feature-flags";
import { useCheckout } from "@/store/checkout";
import { Box, Radio, Stack, Text } from "@mantine/core";

export const PaymentOptions = ({
  amountInvolved,
}: {
  amountInvolved: number;
}) => {
  const {
    update,
    details: { paymentType },
  } = useCheckout((state) => state);

  const isCodDisabled = amountInvolved > 500; // cod is disabled for orders above GHS 500

  return (
    <Box py="md">
      <Text>Payment Options</Text>
      <Text component="span" size="xs" c="gray.8">
        Choose your preferred mode of payment
      </Text>
      <Stack mt="md">
        <Radio
          variant="outline"
          color="var(--primary-800)"
          checked={paymentType === "momo"}
          onChange={() => {
            update("paymentType", "momo");
          }}
          label={
            <Text component="span" size="sm">
              MOMO (MTN, Telecel, AT)
            </Text>
          }
        />
        <Radio
          variant="outline"
          color="var(--primary-800)"
          checked={paymentType === "card"}
          onChange={() => {
            update("paymentType", "card");
          }}
          label={
            <Text component="span" size="sm">
              Card (Master, Visa)
            </Text>
          }
        />
        {featureFlags.cod && (
          <Radio
            color="var(--primary-800)"
            variant="outline"
            checked={paymentType === "cod"}
            onChange={() => {
              if (!isCodDisabled) {
                update("paymentType", "cod");
              }
            }}
            label={
              <Text component="span" size="sm">
                Cash On Delivery
              </Text>
            }
            description={
              isCodDisabled
                ? "This option is disabled because the order amount does not allow for this method of payment"
                : ""
            }
            disabled={isCodDisabled}
          />
        )}
      </Stack>
    </Box>
  );
};
