import { ISales } from "@/types/sales-expenses";
import { Stack, Text, Group, Avatar } from "@mantine/core";
import { CURRENCY_SYMBOL } from "../../PriceCalculator/constants";

interface SalesDetailsProps {
  sale: ISales;
}

export default function SalesDetails({ sale }: SalesDetailsProps) {
  return (
    <Stack gap="md">
      <Group>
        <Avatar size="lg" src={sale.createdBy.image} />
        <Stack gap={0}>
          <Text size="sm" fw={500}>
            Created By
          </Text>
          <Text>{sale.createdBy.name}</Text>
        </Stack>
      </Group>

      <Stack gap="xs">
        <Text size="sm" fw={500}>
          Product Type
        </Text>
        <Text>{sale.productType}</Text>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" fw={500}>
          Description
        </Text>
        <Text>{sale.description}</Text>
      </Stack>

      <Group grow>
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Unit Price
          </Text>
          <Text>
            {CURRENCY_SYMBOL} {sale.unitPrice.toLocaleString()}
          </Text>
        </Stack>

        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Quantity
          </Text>
          <Text>{sale.quantity}</Text>
        </Stack>
      </Group>

      {sale.discount && (
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Discount
          </Text>
          <Text>
            {sale.discount.type === "percentage"
              ? `${sale.discount.value}%`
              : `${CURRENCY_SYMBOL} ${sale.discount.value}`}
          </Text>
        </Stack>
      )}

      <Stack gap="xs">
        <Text size="sm" fw={500}>
          Payment Methods
        </Text>
        <Text>{sale.paymentMethods.join(", ")}</Text>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" fw={500}>
          Total Amount
        </Text>
        <Text size="lg" fw={700}>
          {CURRENCY_SYMBOL} {sale.totalAmount.toLocaleString()}
        </Text>
      </Stack>
    </Stack>
  );
}
