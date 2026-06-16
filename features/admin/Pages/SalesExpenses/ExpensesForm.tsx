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
  Grid,
} from "@mantine/core";
import { IconChevronDown, IconChevronRight, IconListDetails, IconCash, IconReceipt, IconAlertTriangle } from "@tabler/icons-react";
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
  const [isBadDebt, setIsBadDebt] = useState(initialData?.isBadDebt || false);
  const [badDebtReference, setBadDebtReference] = useState(initialData?.badDebtReference || "");
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
      setIsBadDebt(initialData.isBadDebt || false);
      setBadDebtReference(initialData.badDebtReference || "");
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
        isBadDebt,
        badDebtReference: isBadDebt ? badDebtReference : null,
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
      isBadDebt,
      badDebtReference: isBadDebt ? badDebtReference : null,
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
      isBadDebt,
      badDebtReference: isBadDebt ? badDebtReference : null,
    };

    const originalData = {
      description: initialData.description,
      amount: initialData.amount,
      type: initialData.type,
      paymentMethods: initialData.paymentMethods,
      approver: initialData.approver,
      isBadDebt: initialData.isBadDebt || false,
      badDebtReference: initialData.badDebtReference || null,
    };

    return !isEqual(currentData, originalData);
  };

  return (
    <Stack gap="xl">
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap="lg">
            <Card withBorder p="md" radius="md">
              <Group mb="md">
                <IconListDetails size="1.2rem" className="text-pink-500" />
                <Title order={5}>Expense Details</Title>
              </Group>

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
              </Stack>
            </Card>

            <Card withBorder p="md" radius="md" bg="red.0">
              <Group mb="md">
                <IconAlertTriangle size="1.2rem" color="red" />
                <Title order={5} c="red">Bad Debt Tracking</Title>
              </Group>
              <Checkbox
                label="Mark as Bad Debt (e.g. Spoilt Item Replacement)"
                checked={isBadDebt}
                onChange={(e) => setIsBadDebt(e.currentTarget.checked)}
                color="red"
                fw={500}
              />
              {isBadDebt && (
                <TextInput
                  mt="md"
                  label="Order or Product Reference"
                  placeholder="e.g. Order #1234 or Banner Job"
                  required={isBadDebt}
                  value={badDebtReference}
                  onChange={(e) => setBadDebtReference(e.target.value)}
                />
              )}
            </Card>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="lg">
            <Card withBorder p="md" radius="md">
              <Group mb="md">
                <IconCash size="1.2rem" className="text-pink-500" />
                <Title order={5}>Pricing & Payment</Title>
              </Group>

              <Stack gap="md">
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
              </Stack>
            </Card>

            <Card withBorder radius="md" bg="gray.0">
              <UnstyledButton
                onClick={() => setSummaryOpened((o) => !o)}
                style={{ width: "100%" }}
              >
                <Group justify="space-between">
                  <Group>
                    <IconReceipt size="1.2rem" className="text-pink-500" />
                    <Title order={5}>Summary</Title>
                  </Group>
                  {summaryOpened ? (
                    <IconChevronDown size="1.2rem" />
                  ) : (
                    <IconChevronRight size="1.2rem" />
                  )}
                </Group>
              </UnstyledButton>

              <Collapse in={summaryOpened}>
                <Stack mt="md" gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Expense Type:</Text>
                    <Text size="sm" fw={500}>{expenseType}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Amount:</Text>
                    <Text size="sm" fw={500}>{CURRENCY_SYMBOL} {amount?.toLocaleString()}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Approver:</Text>
                    <Text size="sm" fw={500}>{approver}</Text>
                  </Group>
                  {isBadDebt && (
                    <Group justify="space-between">
                      <Text size="sm" c="red" fw={500}>Bad Debt Ref:</Text>
                      <Text size="sm" c="red" fw={500}>{badDebtReference}</Text>
                    </Group>
                  )}
                </Stack>
              </Collapse>
            </Card>

            <Group justify="flex-end" mt="md">
              <Button variant="light" color="gray" onClick={onCancel} size="md">
                Cancel
              </Button>
              <Button
                color="pink"
                onClick={handleSubmit}
                loading={loading}
                disabled={!adminUser || (initialData && !hasChanges())}
                size="md"
              >
                {initialData ? "Update Expense" : "Save Expense"}
              </Button>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
