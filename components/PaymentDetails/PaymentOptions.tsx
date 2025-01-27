import { featureFlags } from "@/constants/feature-flags";
import { PaymentType } from "@/types";
import { Box, Radio, Stack, Text } from "@mantine/core";

interface Props {
  amountInvolved: number;
  paymentType: PaymentType;
  updatePaymentType: (paymentType: PaymentType) => void;
}

export const PaymentOptions = ({
  amountInvolved,
  paymentType,
  updatePaymentType,
}: Props) => {
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
            updatePaymentType("momo");
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
            updatePaymentType("card");
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
                updatePaymentType("cod");
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
