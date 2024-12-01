import { Expenses } from "@/types/sales-expenses";
import { Stack, Text, Group, Avatar } from "@mantine/core";
import { CURRENCY_SYMBOL } from "../../PriceCalculator/constants";

interface ExpenseDetailsProps {
  expense: Expenses;
}

export default function ExpenseDetails({ expense }: ExpenseDetailsProps) {
  return (
    <Stack gap="md">
      <Group>
        <Avatar size="lg" src={expense.createdBy.image} />
        <Stack gap={0}>
          <Text size="sm" fw={500}>
            Created By
          </Text>
          <Text>{expense.createdBy.name}</Text>
        </Stack>
      </Group>

      <Stack gap="xs">
        <Text size="sm" fw={500}>
          Expense Type
        </Text>
        <Text>{expense.type}</Text>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" fw={500}>
          Description
        </Text>
        <Text>{expense.description}</Text>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" fw={500}>
          Amount
        </Text>
        <Text>
          {CURRENCY_SYMBOL} {expense.amount.toLocaleString()}
        </Text>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" fw={500}>
          Payment Methods
        </Text>
        <Text>{expense.paymentMethods.join(", ")}</Text>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" fw={500}>
          Approver
        </Text>
        <Text>{expense.approver}</Text>
      </Stack>
    </Stack>
  );
}
