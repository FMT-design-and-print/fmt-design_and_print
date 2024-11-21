"use client";
import { calculateTotal } from "@/functions";
import { IQuoteItem } from "@/types/quote";
import { Box, Card, Group, Text, Title } from "@mantine/core";

interface Props {
  items: IQuoteItem[];
}

export function QuoteCards({ items }: Props) {
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

      <Group justify="flex-end" my="xl">
        <Title
          order={4}
          px="xl"
          className="border-y border-gray-300 bg-gray-100 py-3 "
        >
          {" "}
          Subtotal:{" "}
          {calculateTotal(items.map((item) => item.totalAmount)).toFixed(2)}
        </Title>
      </Group>
    </Box>
  );
}
