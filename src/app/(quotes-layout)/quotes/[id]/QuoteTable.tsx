"use client";
import { calculateTotal } from "@/functions";
import { IQuoteItem } from "@/types/quote";
import { Box, Group, Table, Text, Title } from "@mantine/core";

interface Props {
  items: IQuoteItem[];
}

export function QuoteTable({ items }: Props) {
  const rows = items.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.description}</Table.Td>
      <Table.Td>{element.quantity}</Table.Td>
      <Table.Td>{element.unitPrice.toFixed(2)}</Table.Td>
      <Table.Td className="font-bold">
        {element.totalAmount.toFixed(2)}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box>
      <Table>
        <Table.Thead bg="var(--primary-500)">
          <Table.Tr>
            <Table.Th>
              <Text c="white" size="sm" fw={500}>
                Item
              </Text>
            </Table.Th>
            <Table.Th>
              <Text c="white" size="sm" fw={500}>
                Quantity
              </Text>
            </Table.Th>
            <Table.Th>
              <Text c="white" size="sm" fw={500}>
                Unit Price
              </Text>
            </Table.Th>
            <Table.Th>
              <Text c="white" size="sm" fw={500}>
                Total Cost
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
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
