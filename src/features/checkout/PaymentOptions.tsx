import { Box, Radio, Stack, Text } from "@mantine/core";

export const PaymentOptions = () => {
  return (
    <Box py="md">
      <Radio.Group
        name="favoriteFramework"
        label="Payment Options"
        description="Choose your preferred mode of payment"
      >
        <Stack mt="md">
          <Radio
            variant="outline"
            color="pink"
            value="momo"
            label="Mobile Money (MTN, VODAFONE, AT)"
          />
          <Radio
            variant="outline"
            color="pink"
            value="card"
            label="Card (Master/Visa)"
          />
          <Radio
            color="pink"
            variant="outline"
            value="cod"
            label="Cash On Delivery"
          />
        </Stack>
      </Radio.Group>
    </Box>
  );
};
