import { Expenses } from "@/types/sales-expenses";
import { Stack, Text, Group, Avatar, Card, Title, Grid, Badge, Divider } from "@mantine/core";
import { IconCash, IconListDetails, IconUserCheck, IconAlertTriangle } from "@tabler/icons-react";
import { CURRENCY_SYMBOL } from "../../PriceCalculator/constants";
import { formatDate } from "./utils";
import { useSales } from "@/hooks/admin/useSales";

interface ExpenseDetailsProps {
  expense: Expenses;
}

export default function ExpenseDetails({ expense }: ExpenseDetailsProps) {
  const { data: sales } = useSales();

  const badDebtRef = expense.badDebtReference || expense.bad_debt_reference;
  const isBadDebt = expense.isBadDebt || expense.is_bad_debt;
  const referenceSale = sales?.find(s => s.id === badDebtRef);
  const referenceText = referenceSale
    ? `Sale - ${formatDate(referenceSale.created_at)} - ${referenceSale.items && referenceSale.items.length > 0 ? referenceSale.items[0].productType + (referenceSale.items.length > 1 ? ` (+${referenceSale.items.length - 1})` : '') : referenceSale.productType}`
    : badDebtRef;

  return (
    <Stack gap="xl">
      <Group>
        <Avatar size="lg" src={expense.createdBy?.image} radius="xl" />
        <Stack gap={0}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            Recorded By
          </Text>
          <Text fw={500}>{expense.createdBy?.name || "System"}</Text>
          <Text size="xs" c="dimmed">{formatDate(expense.created_at)}</Text>
        </Stack>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="md" h="100%">
            <Group mb="md">
              <IconListDetails size="1.2rem" className="text-pink-500" />
              <Title order={5}>Expense Info</Title>
            </Group>

            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Type</Text>
                <Text size="sm" fw={500}>{expense.type}</Text>
              </Group>
              <Divider variant="dashed" />
              <Group justify="space-between" align="flex-start">
                <Text size="sm" c="dimmed" style={{ whiteSpace: "nowrap" }}>Description</Text>
                <Text size="sm" fw={500} style={{ maxWidth: '60%', textAlign: 'right' }}>
                  {expense.description || "N/A"}
                </Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="md" h="100%">
            <Group mb="md">
              <IconUserCheck size="1.2rem" className="text-pink-500" />
              <Title order={5}>Approval</Title>
            </Group>

            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Approver Name</Text>
                <Text size="sm" fw={500}>{expense.approver || "N/A"}</Text>
              </Group>
              {expense.notes && (
                <>
                  <Divider variant="dashed" />
                  <Group justify="space-between" align="flex-start">
                    <Text size="sm" c="dimmed" style={{ whiteSpace: "nowrap" }}>Notes</Text>
                    <Text size="sm" fw={500} style={{ maxWidth: '60%', textAlign: 'right' }}>
                      {expense.notes}
                    </Text>
                  </Group>
                </>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {isBadDebt && (
        <Card withBorder radius="md" p="md" bg="red.0" style={{ borderColor: 'var(--mantine-color-red-3)' }}>
          <Group mb="md">
            <IconAlertTriangle size="1.2rem" color="var(--mantine-color-red-6)" />
            <Title order={5} c="red.7">Bad Debt / Spoilt Item Details</Title>
          </Group>
          <Stack gap="sm">
            <Group justify="space-between">
              <Text size="sm" c="dimmed" fw={500}>Status</Text>
              <Badge color="red" variant="filled">Marked as Bad Debt</Badge>
            </Group>
            <Divider variant="dashed" color="red.2" />
            <Group justify="space-between">
              <Text size="sm" c="dimmed" fw={500}>Reference / Order</Text>
              <Text size="sm" fw={600} c="red.8">{referenceText || "N/A"}</Text>
            </Group>
          </Stack>
        </Card>
      )}

      <Card withBorder radius="md" p="md">
        <Group mb="md">
          <IconCash size="1.2rem" className="text-pink-500" />
          <Title order={5}>Financial Details</Title>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Payment Method</Text>
                <Text size="sm" fw={500}>
                  {(expense.paymentMethods || []).join(", ") || "N/A"}
                </Text>
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Stack gap="sm" bg="gray.0" p="md" style={{ borderRadius: '8px' }}>
              <Group justify="space-between">
                <Text size="sm" fw={600}>Total Amount</Text>
                <Text size="lg" fw={700} c="red">
                  {CURRENCY_SYMBOL} {(expense.amount || 0).toLocaleString()}
                </Text>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>
    </Stack>
  );
}