import { PaymentMethod } from "@/types";
import { IAdminUser } from "@/types/admin";
import { Expenses } from "@/types/sales-expenses";
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { IconAlertTriangle, IconCash, IconChevronDown, IconChevronRight, IconListDetails, IconReceipt } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { CURRENCY_SYMBOL } from "../../PriceCalculator/constants";
import CommonFormFields from "./CommonFormFields";

import { useLoadAdminUsers } from "@/hooks/admin/useLoadAdminUsers";
import { useSales } from "@/hooks/admin/useSales";

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
    { value: "Raw Materials", label: "Raw Materials" },
    { value: "Materials & Substrates", label: "Materials & Substrates (Flexi, Vinyl, etc)" },
    { value: "Ink & Toner", label: "Ink & Toner" },
    { value: "Equipment Maintenance", label: "Equipment Maintenance" },
    { value: "Electricity / Utilities", label: "Electricity / Utilities" },
    { value: "Logistics & Delivery", label: "Logistics & Delivery" },
    { value: "Outsourced Printing", label: "Outsourced Printing" },
    { value: "Refunds", label: "Refunds" },
    { value: "Packaging Materials", label: "Packaging Materials" },
    { value: "Staff Food/Allowance", label: "Staff Food/Allowance" },
    { value: "Salary/Wages", label: "Salary/Wages" },
    { value: "Marketing & Ads", label: "Marketing & Ads" },
    { value: "Office Supplies", label: "Office Supplies" },
    { value: "Rent", label: "Rent" },
    { value: "other", label: "Other" },
  ],
}: ExpensesFormProps) {
  const { data: sales } = useSales();
  const { adminUsers } = useLoadAdminUsers();

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

  const salesOptions = useMemo(() => {
    return (sales || []).map((s) => {
      const date = new Date(s.created_at).toLocaleDateString();
      const productType = s.items && s.items.length > 0
        ? s.items[0].productType + (s.items.length > 1 ? ` (+${s.items.length - 1})` : '')
        : s.productType;
      return {
        value: s.id,
        label: `Sale - ${date} - ${productType} (${CURRENCY_SYMBOL}${s.totalAmount})`
      };
    });
  }, [sales]);

  const approverOptions = useMemo(() => {
    return (adminUsers || []).map((user) => ({
      value: `${user.firstName} ${user.lastName}`,
      label: `${user.firstName} ${user.lastName}`
    }));
  }, [adminUsers]);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount);
      setExpenseType(initialData.type);
      setApprover(initialData.approver || "");
      setIsBadDebt(initialData.isBadDebt || initialData.is_bad_debt || false);
      setBadDebtReference(initialData.badDebtReference || initialData.bad_debt_reference || "");
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
        is_bad_debt: isBadDebt,
        badDebtReference: isBadDebt ? badDebtReference : null,
        bad_debt_reference: isBadDebt ? badDebtReference : null,
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
      id: initialData.id,
      updated_at: new Date(),
      description,
      amount: amount || 0,
      type: expenseType === "other" ? customExpenseType : expenseType,
      paymentMethods,
      approver,
      isBadDebt,
      is_bad_debt: isBadDebt,
      badDebtReference: isBadDebt ? badDebtReference : null,
      bad_debt_reference: isBadDebt ? badDebtReference : null,
      updatedBy: {
        userId: adminUser?.id,
        name: adminUser?.firstName + " " + adminUser?.lastName,
        email: adminUser?.email || "",
        role: adminUser?.role || "",
        image: adminUser?.avatar || "",
      },
    };

    // Bypass getChangedExpenseFields and pass the entire payload directly, 
    // exactly like we did for SalesForm to fix the update bug.
    onSubmit(currentData as unknown as Expenses);
  };

  const hasChanges = () => {
    if (!initialData) return true; // Allow save for new entries
    return true; // Always allow saving on edit view to bypass broken diff logic, similar to SalesForm
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
                <Select
                  mt="md"
                  label="Reference Sale (Optional)"
                  placeholder="Select a related sale if applicable"
                  data={salesOptions}
                  value={badDebtReference}
                  onChange={(val) => setBadDebtReference(val || "")}
                  searchable
                  clearable
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

                <Select
                  label="Approver"
                  placeholder="Select an approver"
                  required
                  data={approverOptions}
                  value={approver}
                  onChange={(val) => setApprover(val || "")}
                  searchable
                  clearable
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
