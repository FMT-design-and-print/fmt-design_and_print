"use client";
import { CURRENCY_SYMBOL } from "@/features/admin/PriceCalculator/constants";
import { calculateTotal } from "@/functions";
import { IQuoteItem } from "@/types/quote";
import { Box, Card, Group, Stack, Text, Title } from "@mantine/core";

interface Props {
  items: IQuoteItem[];
  paymentPercentage: number;
}

export function QuoteCards({ items, paymentPercentage }: Props) {
  return (
    <Box>
      {items.map((item) => (
        <Card key={item.id} withBorder my="xs">
          <Text size="sm">{item.description}</Text>
          <Group>
            <Group gap={4}>
              <Text size="xs">Qty: </Text>
              <Text c="gray" size="xs">
                {item.quantity}
              </Text>
            </Group>

            <Group gap={4}>
              <Text size="xs">Unit Price: </Text>
              <Text c="gray" size="xs">
                {item.unitPrice}
              </Text>
            </Group>

            <Group gap={4}>
              <Text size="xs">Total Price: </Text>
              <Text c="gray" size="xs">
                {item.totalAmount}
              </Text>
            </Group>
          </Group>
        </Card>
      ))}

      <Stack align="flex-end" my="xl">
        <Title
          order={4}
          px="xl"
          className="border-y border-gray-300 bg-gray-100 py-2 "
        >
          {" "}
          Subtotal: {CURRENCY_SYMBOL}
          {calculateTotal(items.map((item) => item.totalAmount)).toFixed(2)}
        </Title>
        <Text px="xl" size="sm">
          {" "}
          Amount Due:{" "}
          <span className="font-bold">
            {CURRENCY_SYMBOL}
            {(
              (calculateTotal(items.map((item) => item.totalAmount)) *
                paymentPercentage) /
              100
            ).toFixed(2)}
          </span>
        </Text>
      </Stack>
    </Box>
  );
}
