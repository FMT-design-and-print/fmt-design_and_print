import { Box, Table, Text, Badge, Stack, Group, Paper, Title, Button, Modal, NumberInput, Select, TextInput } from "@mantine/core";
import { usePaymentHistory } from "@/hooks/admin/usePaymentHistory";
import { useSales } from "@/hooks/admin/useSales";
import { createClient } from "@/utils/supabase/client";
import { CURRENCY_SYMBOL } from "../../PriceCalculator/constants";
import { useState, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useCurrentAdminUser } from "@/hooks/admin/useCurrentAdminUser";
import { toast } from "react-toastify";
import { supabase } from "@/hooks/admin/useUpdateOrder";

export default function CustomerPaymentHistory({ customerId }: { customerId: string }) {
  const { data: payments, isLoading, recordPayment } = usePaymentHistory(customerId);
  const { data: sales } = useSales();
  const { adminUser } = useCurrentAdminUser();
  const [opened, { open, close }] = useDisclosure(false);

  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [method, setMethod] = useState("Cash");
  const [referenceType, setReferenceType] = useState("sales");
  const [referenceId, setReferenceId] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customerSales = useMemo(() => {
    return (sales || [])
      .filter((s) => s.customer_id === customerId && (s.balanceDue || 0) > 0)
      .map((s) => ({
        value: s.id,
        label: `${s.productType || "Sale"} - Due: ${CURRENCY_SYMBOL} ${(s.balanceDue || 0).toLocaleString()} (${new Date(s.created_at).toLocaleDateString()})`,
      }));
  }, [sales, customerId]);

  const handleRecordPayment = async () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!referenceId.trim()) {
      toast.error("Please enter a reference ID (Order/Sale number)");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Record the payment
      await recordPayment({
        customer_id: customerId,
        amount_paid: amount,
        payment_method: method,
        reference_type: referenceType as any,
        reference_id: referenceId,
        notes,
        payment_date: new Date().toISOString(),
        createdBy: {
          userId: adminUser?.id || "",
          name: adminUser?.firstName + " " + adminUser?.lastName,
          email: adminUser?.email || "",
          role: adminUser?.role || "",
          image: adminUser?.avatar || "",
        }
      });

      // 2. We need to automatically update the associated sale's balance due
      if (referenceType === "sales" && referenceId) {
        const sale = sales?.find(s => s.id === referenceId);
        if (sale) {
          const newAmountPaid = (sale.amountPaid || 0) + amount;
          const newBalanceDue = Math.max(0, (sale.totalAmount || 0) - newAmountPaid);

          const supabase = createClient();
          await supabase.from("sales").update({
            amountPaid: newAmountPaid,
            balanceDue: newBalanceDue
          }).eq("id", referenceId);
        }
      }

      toast.success("Payment recorded successfully");
      close();
      // Reset form
      setAmount(undefined);
      setReferenceId("");
      setNotes("");
    } catch (e) {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Text size="sm" c="dimmed">Loading payment history...</Text>;
  }

  return (
    <Box mt="md">
      <Group justify="space-between" mb="sm">
        <Title order={5}>Payment History</Title>
        <Button size="xs" color="pink" onClick={open}>Record Payment</Button>
      </Group>

      {!payments || payments.length === 0 ? (
        <Text size="sm" c="dimmed">No payment history found for this customer.</Text>
      ) : (
        <Paper withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Amount Paid</Table.Th>
                <Table.Th>Method</Table.Th>
                <Table.Th>Reference</Table.Th>
                <Table.Th>Notes</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {payments.map((payment) => (
                <Table.Tr key={payment.id}>
                  <Table.Td>{new Date(payment.payment_date).toLocaleString()}</Table.Td>
                  <Table.Td fw={600} c="green">
                    {CURRENCY_SYMBOL} {payment.amount_paid.toLocaleString()}
                  </Table.Td>
                  <Table.Td>
                    <Badge color="pink" variant="light">{payment.payment_method || "Cash"}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" tt="uppercase" fw={500}>{payment.reference_type}</Text>
                    <Text size="xs" c="dimmed">#{payment.reference_id.substring(0, 8)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs">{payment.notes || "-"}</Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      )}

      <Modal opened={opened} onClose={close} title="Record New Payment">
        <Stack gap="md">
          <NumberInput
            label="Amount Paid"
            required
            value={amount}
            onChange={(val) => setAmount(val as number)}
            prefix={`${CURRENCY_SYMBOL} `}
            min={0.01}
          />
          <Select
            label="Payment Method"
            data={["Cash", "Mobile Money", "Bank Transfer", "Credit Card"]}
            value={method}
            onChange={(val) => setMethod(val || "Cash")}
            required
          />
          <Group grow>
            <Select
              label="For (Type)"
              data={[
                { value: "sales", label: "Manual Sale" },
                { value: "orders", label: "Standard Order" },
                { value: "custom-orders", label: "Custom Order" }
              ]}
              value={referenceType}
              onChange={(val) => {
                setReferenceType(val || "sales");
                setReferenceId("");
              }}
              required
            />
            {referenceType === "sales" ? (
              <Select
                label="Select Sale"
                data={customerSales}
                value={referenceId}
                onChange={(val) => setReferenceId(val || "")}
                required
                searchable
                nothingFoundMessage="No unpaid sales found"
              />
            ) : (
              <TextInput
                label="Reference ID / Number"
                placeholder="e.g. #ORD-123"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                required
              />
            )}
          </Group>
          <TextInput
            label="Notes (Optional)"
            placeholder="e.g. Final payment for banner"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" color="gray" onClick={close}>Cancel</Button>
            <Button color="pink" onClick={handleRecordPayment} loading={isSubmitting}>Save Payment</Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}