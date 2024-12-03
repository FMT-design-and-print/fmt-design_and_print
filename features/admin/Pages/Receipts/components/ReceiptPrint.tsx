import { Text, Stack, Table, Group, Box, Title } from "@mantine/core";
import { Receipt } from "@/types/receipts";
import {
  formatCurrency,
  formatDate,
} from "../../SalesAndExpensesDashboard/utils/formatters";
import { FMTLogo } from "@/components/FMTLogo";

interface ReceiptPrintProps {
  receipt: Receipt;
}

export function ReceiptPrint({ receipt }: ReceiptPrintProps) {
  return (
    <Box p="xl">
      <Stack gap="md">
        <Group justify="space-between">
          <div>
            <Text size="xl" fw={700}>
              RECEIPT
            </Text>
            <Text size="sm" c="dimmed">
              #{receipt.receiptNumber}
            </Text>
          </div>
          <Text>{formatDate(receipt.date)}</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500}>Bill To:</Text>
          <Text>{receipt.customerName}</Text>
          {receipt.customerAddress && <Text>{receipt.customerAddress}</Text>}
          {receipt.customerPhone && <Text>Phone: {receipt.customerPhone}</Text>}
          {receipt.customerEmail && <Text>Email: {receipt.customerEmail}</Text>}
        </Stack>

        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Description</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Unit Price</Table.Th>
              <Table.Th>Total</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {receipt.items.map((item, index) => (
              <Table.Tr key={index}>
                <Table.Td>{item.description}</Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
                <Table.Td>{formatCurrency(item.unitPrice)}</Table.Td>
                <Table.Td>
                  {formatCurrency(item.quantity * item.unitPrice)}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Stack gap="xs" align="flex-end">
          <Group gap="xl">
            <Text>Subtotal:</Text>
            <Text>{formatCurrency(receipt.subtotal)}</Text>
          </Group>
          <Group gap="xl">
            <Text>Tax ({receipt.taxRate}%):</Text>
            <Text>{formatCurrency(receipt.taxAmount)}</Text>
          </Group>
          <Group gap="xl">
            <Text fw={500}>Total:</Text>
            <Text fw={500}>{formatCurrency(receipt.totalAmount)}</Text>
          </Group>
        </Stack>

        <Stack gap="xs" mt="xl">
          <Text>Payment Status: {receipt.paymentStatus.toUpperCase()}</Text>
          <Text>
            Payment Method:{" "}
            {receipt.paymentMethod.replace("_", " ").toUpperCase()}
          </Text>
          {receipt.notes && (
            <Text c="dimmed" size="sm">
              Notes: {receipt.notes}
            </Text>
          )}
        </Stack>
      </Stack>
      <Box my="xl" className="space-y-2">
        <FMTLogo image="https://res.cloudinary.com/dnbmynikp/image/upload/v1703264782/FMT/logo1_tpiges.png" />
        <Title order={3}>FMT DESIGN & PRINT</Title>
        <Text size="sm" c="muted">
          fmtdesignprint@gmail.com
        </Text>
        <Text size="sm" c="muted">
          +233559617959
        </Text>
      </Box>
    </Box>
  );
}
