import {
  Group,
  Stack,
  TextInput,
  SegmentedControl,
  Button,
  Select,
  Title,
  Popover,
  Badge,
  ActionIcon,
  Box,
  Text,
  Divider,
} from "@mantine/core";
import { DatePickerInput, DatesRangeValue } from "@mantine/dates";
import { useMemo, useState } from "react";
import { ISales, Expenses } from "@/types/sales-expenses";
import { AmountFilter } from "../hooks/useFilters";
import { DATE_PRESETS } from "@/constants/presets";
import { SalesFilters, ExpensesFilters } from "@/store/salesExpenses";
import { IconFilter, IconX } from "@tabler/icons-react";

interface SalesFiltersProps {
  filters: SalesFilters;
  onFiltersChange: (filters: Partial<SalesFilters>) => void;
  data: ISales[];
  onClearFilters: () => void;
}

interface ExpensesFiltersProps {
  filters: ExpensesFilters;
  onFiltersChange: (filters: Partial<ExpensesFilters>) => void;
  data: Expenses[];
  onClearFilters: () => void;
}

function areDatesEqual(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

const getPresets = () => ({
  today: DATE_PRESETS.today,
  thisWeek: DATE_PRESETS.thisWeek,
  thisMonth: DATE_PRESETS.thisMonth,
  last30Days: DATE_PRESETS.last30Days,
});

export function SalesTableFilters({
  filters,
  onFiltersChange,
  data,
  onClearFilters,
}: SalesFiltersProps) {
  const [amountType, setAmountType] = useState<AmountFilter["type"]>("exact");
  const [amountValue, setAmountValue] = useState<string>("");
  const presets = getPresets();

  const uniqueUsers = useMemo(() => {
    if (!data?.length) return [];
    const uniqueItems = Array.from(
      new Map(data.map((item) => [item.createdBy.userId, { value: item.createdBy.userId, label: item.createdBy.name }])).values()
    );
    return uniqueItems;
  }, [data]);

  const uniqueProductTypes = useMemo(() => {
    if (!data?.length) return [];
    const uniqueItems = Array.from(
      new Set(
        data.flatMap(item => [
          item.productType,
          ...(item.items?.map(i => i.productType) || [])
        ]).filter(Boolean)
      )
    );
    return uniqueItems.map(pt => ({ value: pt as string, label: pt as string }));
  }, [data]);

  const handleAmountChange = (value: string) => {
    setAmountValue(value);
    const numValue = Number(value);
    onFiltersChange({
      amount: value ? { type: amountType, value: numValue } : null,
    });
  };

  const activeFilterCount = [
    filters.createdBy,
    filters.dateRange[0],
    filters.amount?.value,
    filters.productType,
    filters.paymentStatus
  ].filter(Boolean).length;

  return (
    <Group justify="flex-start" mb="md" align="flex-end">
      <DatePickerInput
        type="range"
        label="Created Date"
        placeholder="Select date range"
        value={filters.dateRange}
        onChange={(val) => onFiltersChange({ dateRange: val })}
        clearable
        w={250}
      />

      <Popover position="bottom-start" withArrow shadow="md">
        <Popover.Target>
          <Button
            variant={activeFilterCount > 0 ? "light" : "default"}
            leftSection={<IconFilter size={16} />}
            rightSection={activeFilterCount > 0 && <Badge size="sm" circle color="pink">{activeFilterCount}</Badge>}
          >
            Advanced Filters
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack gap="md" w={300}>
            <Title order={6}>Advanced Filters</Title>

            <Select
              label="Created By"
              placeholder="Select User"
              data={uniqueUsers}
              value={filters.createdBy}
              onChange={(val) => onFiltersChange({ createdBy: val })}
              clearable
            />

            <Select
              label="Product Type"
              placeholder="Select Product Type"
              data={uniqueProductTypes}
              value={filters.productType}
              onChange={(val) => onFiltersChange({ productType: val })}
              clearable
              searchable
            />

            <Select
              label="Payment Status"
              placeholder="Select Status"
              data={[
                { value: "paid", label: "Paid" },
                { value: "unpaid", label: "Unpaid / Balance Due" },
              ]}
              value={filters.paymentStatus}
              onChange={(val) => onFiltersChange({ paymentStatus: val })}
              clearable
            />

            <Box>
              <Text size="sm" fw={500} mb={5}>Amount</Text>
              <Group align="flex-start" gap="xs">
                <SegmentedControl
                  size="sm"
                  value={amountType}
                  onChange={(val: string) => {
                    setAmountType(val as AmountFilter["type"]);
                    if (amountValue) {
                      onFiltersChange({
                        amount: { type: val as AmountFilter["type"], value: Number(amountValue) },
                      });
                    }
                  }}
                  data={[
                    { label: "=", value: "exact" },
                    { label: "<", value: "less" },
                    { label: ">", value: "greater" },
                  ]}
                />
                <TextInput
                  placeholder="Amount"
                  value={amountValue}
                  onChange={(e) => handleAmountChange(e.currentTarget.value)}
                  type="number"
                  style={{ flex: 1 }}
                />
              </Group>
            </Box>

            <Divider />

            <Button variant="subtle" color="red" fullWidth onClick={() => {
              setAmountValue("");
              onClearFilters();
            }}>
              Clear All Filters
            </Button>
          </Stack>
        </Popover.Dropdown>
      </Popover>

      {activeFilterCount > 0 && (
        <Button variant="subtle" color="red" size="sm" onClick={() => {
          setAmountValue("");
          onClearFilters();
        }}>
          Clear Filters
        </Button>
      )}
    </Group>
  );
}

export function ExpensesTableFilters({
  filters,
  onFiltersChange,
  data,
  onClearFilters,
}: ExpensesFiltersProps) {
  const [amountType, setAmountType] = useState<AmountFilter["type"]>("exact");
  const [amountValue, setAmountValue] = useState<string>("");

  const uniqueUsers = useMemo(() => {
    if (!data?.length) return [];
    const uniqueItems = Array.from(
      new Map(data.map((item) => [item.createdBy.userId, { value: item.createdBy.userId, label: item.createdBy.name }])).values()
    );
    return uniqueItems;
  }, [data]);

  const uniqueExpenseTypes = useMemo(() => {
    if (!data?.length) return [];
    const uniqueItems = Array.from(new Set(data.map(item => item.type).filter(Boolean)));
    return uniqueItems.map(pt => ({ value: pt as string, label: pt as string }));
  }, [data]);

  const uniqueApprovers = useMemo(() => {
    if (!data?.length) return [];
    const uniqueItems = Array.from(new Set(data.map(item => item.approver).filter(Boolean)));
    return uniqueItems.map(pt => ({ value: pt as string, label: pt as string }));
  }, [data]);

  const handleAmountChange = (value: string) => {
    setAmountValue(value);
    const numValue = Number(value);
    onFiltersChange({
      amount: value ? { type: amountType, value: numValue } : null,
    });
  };

  const activeFilterCount = [
    filters.createdBy,
    filters.dateRange[0],
    filters.amount?.value,
    filters.expenseType,
    filters.isBadDebt !== null ? "badDebt" : null,
    filters.approver
  ].filter(Boolean).length;

  return (
    <Group justify="flex-start" mb="md" align="flex-end">
      <DatePickerInput
        type="range"
        label="Created Date"
        placeholder="Select date range"
        value={filters.dateRange}
        onChange={(val) => onFiltersChange({ dateRange: val })}
        clearable
        w={250}
      />

      <Popover position="bottom-start" withArrow shadow="md">
        <Popover.Target>
          <Button
            variant={activeFilterCount > 0 ? "light" : "default"}
            leftSection={<IconFilter size={16} />}
            rightSection={activeFilterCount > 0 && <Badge size="sm" circle color="pink">{activeFilterCount}</Badge>}
          >
            Advanced Filters
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack gap="md" w={300}>
            <Title order={6}>Advanced Filters</Title>

            <Select
              label="Created By"
              placeholder="Select User"
              data={uniqueUsers}
              value={filters.createdBy}
              onChange={(val) => onFiltersChange({ createdBy: val })}
              clearable
            />

            <Select
              label="Expense Type"
              placeholder="Select Type"
              data={uniqueExpenseTypes}
              value={filters.expenseType}
              onChange={(val) => onFiltersChange({ expenseType: val })}
              clearable
              searchable
            />

            <Select
              label="Approver"
              placeholder="Select Approver"
              data={uniqueApprovers}
              value={filters.approver}
              onChange={(val) => onFiltersChange({ approver: val })}
              clearable
              searchable
            />

            <Select
              label="Bad Debt"
              placeholder="Any"
              data={[
                { value: "true", label: "Only Bad Debts" },
                { value: "false", label: "Exclude Bad Debts" },
              ]}
              value={filters.isBadDebt === null ? null : filters.isBadDebt.toString()}
              onChange={(val) => onFiltersChange({ isBadDebt: val === null ? null : val === "true" })}
              clearable
            />

            <Box>
              <Text size="sm" fw={500} mb={5}>Amount</Text>
              <Group align="flex-start" gap="xs">
                <SegmentedControl
                  size="sm"
                  value={amountType}
                  onChange={(val: string) => {
                    setAmountType(val as AmountFilter["type"]);
                    if (amountValue) {
                      onFiltersChange({
                        amount: { type: val as AmountFilter["type"], value: Number(amountValue) },
                      });
                    }
                  }}
                  data={[
                    { label: "=", value: "exact" },
                    { label: "<", value: "less" },
                    { label: ">", value: "greater" },
                  ]}
                />
                <TextInput
                  placeholder="Amount"
                  value={amountValue}
                  onChange={(e) => handleAmountChange(e.currentTarget.value)}
                  type="number"
                  style={{ flex: 1 }}
                />
              </Group>
            </Box>

            <Divider />

            <Button variant="subtle" color="red" fullWidth onClick={() => {
              setAmountValue("");
              onClearFilters();
            }}>
              Clear All Filters
            </Button>
          </Stack>
        </Popover.Dropdown>
      </Popover>

      {activeFilterCount > 0 && (
        <Button variant="subtle" color="red" size="sm" onClick={() => {
          setAmountValue("");
          onClearFilters();
        }}>
          Clear Filters
        </Button>
      )}
    </Group>
  );
}
