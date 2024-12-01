import { IAdminUser } from "@/types/admin";
import { PaymentMethod } from "@/types";
import { Expenses } from "@/types/sales-expenses";
import {
  Stack,
  Select,
  TextInput,
  Group,
  Button,
  NumberInput,
  Checkbox,
  Card,
  Text,
  Title,
  Collapse,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import CommonFormFields from "./CommonFormFields";
import { CURRENCY_SYMBOL } from "../../PriceCalculator/constants";
import { getChangedExpenseFields } from "@/features/admin/Pages/SalesExpenses/form-helpers";
import { isEqual } from "lodash";

interface ExpensesFormProps {
  onSubmit: (data: Expenses) => void;
  loading: boolean;
  adminUser: IAdminUser | null;
  initialData?: Expenses;
  onCancel?: () => void;
  expenseTypes?: { value: string; label: string }[];
}

export default function ExpensesForm({
  onSubmit,
  loading,
  adminUser,
  initialData,
  onCancel,
  expenseTypes = [
    { value: "Rent", label: "Rent" },
    { value: "Utilities", label: "Utilities" },
    { value: "Raw Materials", label: "Raw Materials" },
    { value: "Marketing", label: "Marketing" },
    { value: "other", label: "Other" },
  ],
}: ExpensesFormProps) {
  const [amount, setAmount] = useState<number | undefined>(initialData?.amount);
  const [expenseType, setExpenseType] = useState(initialData?.type || "");
  const [customExpenseType, setCustomExpenseType] = useState("");
  const [approver, setApprover] = useState(initialData?.approver || "");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    initialData?.paymentMethods || []
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [summaryOpened, setSummaryOpened] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount);
      setExpenseType(initialData.type);
      setApprover(initialData.approver || "");
      setPaymentMethods(initialData.paymentMethods || []);
      setDescription(initialData.description || "");
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!initialData) {
      const data = {
        updated_at: new Date(),
        description,
        amount: amount || 0,
        type: expenseType === "other" ? customExpenseType : expenseType,
        paymentMethods,
        approver,
        createdBy: {
          userId: adminUser?.id,
          name: adminUser?.firstName + " " + adminUser?.lastName,
          email: adminUser?.email || "",
          role: adminUser?.role || "",
          image: adminUser?.avatar || "",
        },
      };
      onSubmit(data as Expenses);
      return;
    }

    const currentData = {
      description,
      amount: amount || 0,
      type: expenseType,
      paymentMethods,
      approver,
    };

    const changes = getChangedExpenseFields(currentData, initialData);
    onSubmit(changes as Expenses);
  };

  const hasChanges = () => {
    if (!initialData) return true; // Allow save for new entries

    const currentData = {
      description,
      amount: amount || 0,
      type: expenseType,
      paymentMethods,
      approver,
    };

    const originalData = {
      description: initialData.description,
      amount: initialData.amount,
      type: initialData.type,
      paymentMethods: initialData.paymentMethods,
      approver: initialData.approver,
    };

    return !isEqual(currentData, originalData);
  };

  return (
    <Stack gap="md">
      <Select
        label="Expense Type"
        placeholder="Select Expense Type"
        data={expenseTypes}
        value={expenseType}
        onChange={(value) => setExpenseType(value as string)}
        required
      />

      {expenseType === "other" && (
        <TextInput
          label="Custom Expense Type"
          required
          value={customExpenseType}
          onChange={(e) => setCustomExpenseType(e.target.value)}
        />
      )}

      <CommonFormFields
        description={description}
        setDescription={setDescription}
      />

      <NumberInput
        label="Amount"
        required
        value={amount}
        onChange={(value) => setAmount(value as number)}
        min={0}
        prefix={`${CURRENCY_SYMBOL} `}
        thousandSeparator=","
      />

      <Checkbox.Group
        label="Payment Method"
        value={paymentMethods}
        onChange={(value) => setPaymentMethods(value as PaymentMethod[])}
      >
        <Group mt="xs">
          <Checkbox value="Cash" label="Cash" color="pink" />
          <Checkbox value="Mobile Money" label="Mobile Money" color="pink" />
          <Checkbox value="Credit Card" label="Credit Card" color="pink" />
          <Checkbox value="Bank Transfer" label="Bank Transfer" color="pink" />
        </Group>
      </Checkbox.Group>

      <TextInput
        label="Approver Name or Email"
        required
        value={approver}
        onChange={(e) => setApprover(e.target.value)}
      />

      <Card withBorder>
        <UnstyledButton
          onClick={() => setSummaryOpened((o) => !o)}
          style={{ width: "100%" }}
        >
          <Group justify="space-between">
            <Title order={5}>Summary</Title>
            {summaryOpened ? (
              <IconChevronDown size="1.2rem" />
            ) : (
              <IconChevronRight size="1.2rem" />
            )}
          </Group>
        </UnstyledButton>

        <Collapse in={summaryOpened}>
          <Stack mt="md">
            <Text size="xs">
              <Text span fw={500} size="xs">
                Expense Type:
              </Text>{" "}
              <Text span fw={700} size="xs">
                {expenseType}
              </Text>
            </Text>
            <Text size="xs">
              <Text span fw={500} size="xs">
                Description:
              </Text>{" "}
              <Text span fw={700} size="xs">
                {description}
              </Text>
            </Text>
            <Text size="xs">
              <Text span fw={500} size="xs">
                Amount:
              </Text>{" "}
              <Text span fw={700} size="xs">
                {CURRENCY_SYMBOL} {amount?.toLocaleString()}
              </Text>
            </Text>
            <Text size="xs">
              <Text span fw={500} size="xs">
                Payment Methods:
              </Text>{" "}
              <Text span fw={700} size="xs">
                {paymentMethods.join(", ")}
              </Text>
            </Text>
            <Text size="xs">
              <Text span fw={500} size="xs">
                Approver:
              </Text>{" "}
              <Text span fw={700} size="xs">
                {approver}
              </Text>
            </Text>
          </Stack>
        </Collapse>
      </Card>

      <Group justify="flex-end">
        <Button variant="light" color="gray" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          color="pink"
          onClick={handleSubmit}
          loading={loading}
          disabled={!adminUser || (initialData && !hasChanges())}
        >
          {initialData ? "Update" : "Save"}
        </Button>
      </Group>
    </Stack>
  );
}
